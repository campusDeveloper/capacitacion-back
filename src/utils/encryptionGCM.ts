import crypto from 'crypto';
import { config } from '../config/config';

/**
 * Encriptación AES-256-GCM (con autenticación de integridad)
 * 
 * Ventajas sobre CBC:
 * - Detecta manipulación de datos (bit flipping attacks)
 * - Auth Tag verifica integridad del ciphertext
 * - Más rápido en hardware moderno
 * - Recomendado por NIST
 */
export class EncryptionGCM {
    private static readonly ALGORITHM = 'aes-256-gcm';
    private static readonly KEY_LENGTH = 32; // 256 bits
    private static readonly IV_LENGTH = 16;  // 128 bits
    private static readonly AUTH_TAG_LENGTH = 16; // 128 bits

    /**
     * Obtener la clave de encriptación del entorno
     */
    private static getEncryptionKey(): Buffer {
        const key = config.security.encryptionKey;
        
        if (!key) {
            throw new Error('❌ ENCRYPTION_KEY no está configurada en .env');
        }

        if (key.length !== 64) { // 32 bytes = 64 hex chars
            throw new Error('❌ ENCRYPTION_KEY debe tener 64 caracteres hexadecimales (32 bytes)');
        }

        return Buffer.from(key, 'hex');
    }

    /**
     * Encriptar texto con autenticación
     * 
     * @param plainText - Texto a encriptar
     * @returns Formato: iv:authTag:encryptedData
     * 
     * Ejemplo de salida:
     * "a1b2c3d4e5f6g7h8:9i0j1k2l3m4n5o6p:q7r8s9t0u1v2w3x4..."
     */
    static encrypt(plainText: string): string {
        try {
            const key = this.getEncryptionKey();
            
            // 1. Generar IV aleatorio (Initialization Vector)
            const iv = crypto.randomBytes(this.IV_LENGTH);
            
            // 2. Crear cipher con GCM
            const cipher = crypto.createCipheriv(
                this.ALGORITHM,
                key,
                iv
            ) as crypto.CipherGCM;
            
            // 3. Encriptar datos
            let encrypted = cipher.update(plainText, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            
            // 4. Obtener Auth Tag (firma de autenticidad)
            const authTag = cipher.getAuthTag();
            
            // 5. Retornar en formato: IV:AUTH_TAG:ENCRYPTED_DATA
            const result = `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
            
            console.log('✅ [EncryptionGCM] Datos encriptados con autenticación');
            return result;
            
        } catch (error) {
            console.error('❌ [EncryptionGCM] Error al encriptar:', error);
            throw new Error('Error al encriptar los datos');
        }
    }

    /**
     * Desencriptar y verificar autenticidad
     * 
     * @param encryptedText - Formato: iv:authTag:encryptedData
     * @returns Texto desencriptado
     * @throws Error si los datos fueron manipulados
     */
    static decrypt(encryptedText: string): string {
        try {
            const key = this.getEncryptionKey();
            
            // 1. Separar componentes
            const parts = encryptedText.split(':');
            if (parts.length !== 3) {
                throw new Error('Formato de datos encriptados inválido');
            }
            
            const iv = Buffer.from(parts[0], 'hex');
            const authTag = Buffer.from(parts[1], 'hex');
            const encrypted = parts[2];
            
            // 2. Crear decipher con GCM
            const decipher = crypto.createDecipheriv(
                this.ALGORITHM,
                key,
                iv
            ) as crypto.DecipherGCM;
            
            // 3. Establecer Auth Tag para verificación
            decipher.setAuthTag(authTag);
            
            // 4. Desencriptar (automáticamente verifica integridad)
            let decrypted = decipher.update(encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            
            console.log('✅ [EncryptionGCM] Datos desencriptados y verificados');
            return decrypted;
            
        } catch (error) {
            // Si el Auth Tag no coincide, lanza error aquí
            console.error('❌ [EncryptionGCM] Error al desencriptar:', error);
            
            if (error instanceof Error && error.message.includes('Unsupported state')) {
                throw new Error('⚠️ Datos manipulados o corruptos. Auth Tag no coincide.');
            }
            
            throw new Error('Error al desencriptar los datos');
        }
    }

    /**
     * Generar nueva clave de encriptación
     * Usar para generar ENCRYPTION_KEY inicial
     * 
     * @returns Clave hexadecimal de 64 caracteres
     */
    static generateEncryptionKey(): string {
        const key = crypto.randomBytes(this.KEY_LENGTH).toString('hex');
        console.log('🔑 [EncryptionGCM] Nueva clave generada:');
        return key;
    }

    /**
     * Validar que una string sea un texto encriptado válido
     */
    static isValidEncryptedFormat(text: string): boolean {
        const parts = text.split(':');
        if (parts.length !== 3) {
            return false;
        }

        const [iv, authTag, encrypted] = parts;
        
        // Validar longitudes esperadas (en hex)
        return (
            iv.length === this.IV_LENGTH * 2 &&        // 16 bytes = 32 hex chars
            authTag.length === this.AUTH_TAG_LENGTH * 2 && // 16 bytes = 32 hex chars
            encrypted.length > 0
        );
    }
}