import fs from 'fs';
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import path from "node:path"
import sharp from "sharp"
import { v4 as uuidv4 } from "uuid"
import { config } from "../config/config"
import { buffer } from "node:stream/consumers"
import { Readable } from "node:stream"
import { UploadedFile } from 'express-fileupload';

const s3Client = new S3Client({
    region: config.aws.region,
    credentials: {
        accessKeyId: config.aws.accessKeyId as string,
        secretAccessKey: config.aws.secretAccessKey as string,
    },
})

export const urlBucket = (): string => `https://${config.aws.bucket}.s3.amazonaws.com/`

interface UploadResponse {
    path: string;
    miniPath?: string;
}

export const uploadImage = async (
    imgData: { data: Buffer; name: string },
    dimension: number,
    folder: string,
    mini: boolean = false,
    miniDimension: number = 100
): Promise<UploadResponse> => {
    try {
        if (!imgData?.data || !imgData?.name) throw new Error("Datos de imagen inválidos.")

        const imageFile = sharp(imgData.data)
        const { width, height, format } = await imageFile.metadata()

        if (!width || !height || !format) throw new Error("No se pudo obtener metadatos de la imagen.")

        const maxDimension = Math.max(width, height)
        const percentage = dimension / maxDimension
        const resizedImage =
            percentage < 1
                ? await imageFile.resize(Math.round(width * percentage), Math.round(height * percentage)).toBuffer()
                : await imageFile.toBuffer()

        const extension = path.extname(imgData.name)
        const fileName = `${folder}/${uuidv4()}${extension}`
        const uploadParams = {
            Bucket: config.aws.bucket,
            Key: fileName,
            Body: resizedImage,
            ContentType: `image/${format}`
        }

        await s3Client.send(new PutObjectCommand(uploadParams))

        let miniPath: string | undefined

        if (mini) {
            const miniImage = await sharp(imgData.data).resize(miniDimension).toBuffer()
            const miniFileName = `${folder}/${uuidv4()}${extension}`
            const miniUploadParams = {
                Bucket: config.aws.bucket,
                Key: miniFileName,
                Body: miniImage,
                ContentType: `image/${format}`
            }
            await s3Client.send(new PutObjectCommand(miniUploadParams))
            miniPath = miniFileName
        }

        return { path: fileName, miniPath }
    } catch (error) {
        throw new Error("No se pudo subir la imagen.")
    }
}

export const uploadImageBase64 = async (base64String: string, filePath: string, dimension: number): Promise<string> => {
    try {
        if (!base64String) throw new Error("La cadena Base64 no puede estar vacía.")
        if (!filePath) throw new Error("El path del archivo no puede estar vacío.")
        if (!dimension || dimension <= 0) throw new Error("La dimensión debe ser un número positivo.")

        const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "")
        const decodedData = Buffer.from(base64Data, "base64")
        const imageFile = sharp(decodedData)

        const metadata = await imageFile.metadata()
        const { width = 0, height = 0, format } = metadata

        if (!format) throw new Error("Formato de imagen no reconocido.")

        const maxDimension = Math.max(width, height)
        const scale = dimension / maxDimension

        const processedImage = scale < 1
            ? await imageFile.resize(Math.round(width * scale), Math.round(height * scale)).toBuffer()
            : await sharp(decodedData).toBuffer()

        const fileName = `${filePath}/${uuidv4()}.${format}`

        const putObjectCommand = new PutObjectCommand({
            Bucket: config.aws.bucket,
            Key: fileName,
            Body: processedImage,
            ContentType: `image/${format}`,
        })

        await s3Client.send(putObjectCommand)

        return fileName
    } catch (error) {
        throw new Error("No se pudo subir la imagen Base64.")
    }
}

export const uploadFile = async (file: UploadedFile, ruta: string): Promise<{ url: string; path: string }> => {
    try {
        if (!file) throw new Error("Archivo no proporcionado.")

        const bucketName = config.aws.bucket
        const extension = path.extname(file.name)
        const fileName = `${ruta}/${uuidv4()}${extension}`

        const fileBuffer = file.tempFilePath
            ? fs.readFileSync(file.tempFilePath)
            : file.data;

        const uploadParams = {
            Bucket: bucketName,
            Key: fileName,
            Body: fileBuffer,
            ContentType: file.mimetype
        }
        const response = await s3Client.send(new PutObjectCommand(uploadParams))
        return {
            url: `https://${bucketName}.s3.amazonaws.com/${fileName}`,
            path: fileName
        }
    } catch (error) {
        throw new Error("No se pudo subir el archivo.")
    }
}

export const uploadTxt = async (text: string, folder: string, fileName?: string): Promise<string> => {
    try {
        if (!text) throw new Error("El texto no puede estar vacío.")
        if (!folder) throw new Error("El folder no puede estar vacío.")

        const uuid = fileName || uuidv4()
        const filePath = `${folder}/${uuid}.txt`

        await s3Client.send(
            new PutObjectCommand({
                Bucket: config.aws.bucket,
                Key: filePath,
                Body: text,
                ContentType: "text/plain"
            })
        )

        return filePath
    } catch (error) {
        throw new Error("No se pudo subir el archivo de texto.")
    }
}

// Los archivos a eliminar se almacenan con su respectiva ruta en un json alojado en el mismo bucket
export const deleteFile = async (fileNameOrUrl: string) => {
    if (!fileNameOrUrl) {
        console.error('El nombre del archivo no puede estar vacío.');
        return;
    }

    // Extraer solo la key si es una URL completa
    let fileName = fileNameOrUrl;
    if (fileNameOrUrl.startsWith('http://') || fileNameOrUrl.startsWith('https://')) {
        const url = new URL(fileNameOrUrl);
        fileName = url.pathname.substring(1); // Remover el '/' inicial
    }

    const route = 'trash/deleteFiles.json';

    try {
        // Obtener el archivo JSON existente
        let existingData: string[] = [];
        try {
            const { Body } = await s3Client.send(new GetObjectCommand({
                Bucket: config.aws.bucket,
                Key: route,
            }));

            // Verificar que Body no sea undefined
            if (!Body) {
                throw new Error('El cuerpo de la respuesta de S3 es undefined.');
            }

            // Convertir Body a un ReadableStream si es necesario
            const bodyStream = Body as Readable;
            const bodyBuffer = await streamToPromise(bodyStream);
            const bodyString = bodyBuffer.toString();
            existingData = JSON.parse(bodyString);
        } catch (error) {
             // Verificar si error es un objeto y tiene la propiedad name
			if (error instanceof Error && error.name !== 'NotFound') {
				console.error('Error obteniendo el objeto existente:', error);
				throw error; // Relanzar el error si no es "NotFound"
			}
        }

        // Verificar si el fileName ya existe en existingData
        if (!existingData.includes(fileName)) {
            existingData.push(fileName);

            // Guardar el archivo JSON actualizado
            await s3Client.send(new PutObjectCommand({
                Bucket: config.aws.bucket,
                Key: route,
                Body: JSON.stringify(existingData, null, 2),
                ContentType: 'application/json',
            }));
        }

        console.log(`Archivo ${fileName} registrado en ${route}.`);

    } catch (error) {
        console.error('Error:', error);
    }
};

// Función para convertir un stream a una promesa
function streamToPromise(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on('data', (chunk: Buffer) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', (error: Error) => reject(error));
    });
}

/**
 * Descarga un archivo de AWS S3 y lo guarda temporalmente en el sistema de archivos local.
 *
 * @param {string} s3KeyOrUrl - Ruta del archivo en S3 (ej: "knowledge/uuid.pdf") o URL completa.
 * @param {string} tempPath - Ruta local donde guardar el archivo temporalmente.
 * @returns {Promise<string>} - Promesa que se resuelve con la ruta del archivo descargado.
 */
export const downloadFile = async (s3KeyOrUrl: string, tempPath: string): Promise<string> => {
    try {
        // Extraer solo la key si es una URL completa
        let s3Key = s3KeyOrUrl;
        if (s3KeyOrUrl.startsWith('http://') || s3KeyOrUrl.startsWith('https://')) {
            const url = new URL(s3KeyOrUrl);
            s3Key = url.pathname.substring(1); // Remover el '/' inicial
        }

        const { Body } = await s3Client.send(new GetObjectCommand({
            Bucket: config.aws.bucket,
            Key: s3Key,
        }));

        if (!Body) {
            throw new Error('El cuerpo de la respuesta de S3 es undefined.');
        }

        const bodyStream = Body as Readable;
        const bodyBuffer = await streamToPromise(bodyStream);
        
        // Crear directorio si no existe
        const dir = path.dirname(tempPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        // Guardar archivo temporalmente
        fs.writeFileSync(tempPath, bodyBuffer);
        
        return tempPath;
    } catch (error) {
        throw new Error(`No se pudo descargar el archivo de S3: ${error}`);
    }
};
