import { sequelize } from '../../config/database';
import { HeadquarterRepository } from '../../repositories/headquarters/HeadquarterRepository';
import { uploadFile } from '../../utils/storage';
import { UploadedFile } from 'express-fileupload';

// Interfaz adaptada al JSON del requerimiento (Tarea A)
export interface IHeadquarterCard {
  idHeadquarter: number | null;
  name: string;
  categories: number | string;
  docs: number;
  state?: number;
}

export class HeadquarterService {
  private repo: HeadquarterRepository;

  constructor(repository: HeadquarterRepository) {
    this.repo = repository;
  }

  // ─── TAREA A: LISTADO GENERAL DE SEDES ───────────────────────────────────
 
  async getHeadquartersWithKnowledge(): Promise<IHeadquarterCard[]> {
    const generalCounts = await this.repo.getGeneralKnowledgeCounts();

    const generalCard: IHeadquarterCard = {
      idHeadquarter: null,
      name: 'Conocimiento General',
      categories: generalCounts.categories,
      docs: generalCounts.docs,
    };

    const headquarters = await this.repo.getAllHeadquartersWithCounts();

    const headquarterCards: IHeadquarterCard[] = headquarters.map((hq: any) => ({
      idHeadquarter: hq.id,
      name: hq.name,
      categories: hq.categories,
      docs: Number(hq.docs),
      state: hq.state,
    }));

    return [generalCard, ...headquarterCards];
  }

  async switchState(id: number, updatedBy: number) {
    return await sequelize.transaction(async (transaction) => {
      const headquarter = await this.repo.getHeadquarterById(id, transaction);

      if (!headquarter) {
        const error = new Error('Sede no encontrada');
        (error as any).status = 404;
        throw error;
      }

      return await this.repo.switchState(headquarter, updatedBy, transaction);
    });
  }

  // ─── TAREA B: DETALLE DE CONOCIMIENTO (CATEGORÍAS Y DOCS) ────────────────
  
  // ─── 1. OBTENER LISTADO ANIDADO 
  async getHeadquarterDetailList(idParam: number | 'general') {
    // Definimos el ID real a buscar y el nombre de la sede
    const idHeadquarter = idParam === 'general' ? null : idParam;
    let nameHeadquarter = 'Conocimiento General';

    if (idHeadquarter !== null) {
      const hq = await this.repo.getHeadquarterById(idHeadquarter as number);
      if (!hq) {
        const error = new Error('La sede especificada no existe');
        (error as any).status = 404;
        throw error;
      }
      nameHeadquarter = hq.name;
    }

    const knowledgeList = await this.repo.getKnowledgeWithDocs(idHeadquarter);

    const mappedCategories = knowledgeList.map((k: any) => ({
      IdKnowledge: k.id,
      Title: k.title,
      Description: k.description,
      State: k.state,
      Docs: (k.docs || []).map((doc: any) => ({
        IdDoc: doc.id,
        Name: doc.name,
        State: doc.state,
        File: doc.file,
        CreatedAt: doc.createdAt,
      })),
    }));

    return {
      idHeadquarter: idHeadquarter,
      NameHeadquarter: nameHeadquarter,
      Categories: mappedCategories,
    };
  }

  // ─── 2. GESTIÓN DE CATEGORÍAS (KNOWLEDGE)
  async switchKnowledgeState(idKnowledge: number) {
    return await sequelize.transaction(async (transaction) => {
      const knowledge = await this.repo.getKnowledgeById(idKnowledge, transaction);
      if (!knowledge) {
        const error = new Error('Categoría no encontrada');
        (error as any).status = 404;
        throw error;
      }
      return await this.repo.switchKnowledgeState(knowledge, transaction);
    });
  }

  async deleteKnowledge(idKnowledge: number) {
    return await sequelize.transaction(async (transaction) => {
      const knowledge = await this.repo.getKnowledgeById(idKnowledge, transaction);
      if (!knowledge) {
        const error = new Error('Categoría no encontrada');
        (error as any).status = 404;
        throw error;
      }
      await this.repo.deleteKnowledge(knowledge, transaction);
      return true; // Retornamos true como pide el requerimiento "data": TRUE
    });
  }

  // ─── 3. GESTIÓN DE DOCUMENTOS (DOCS)
  async switchDocState(idDoc: number) {
    return await sequelize.transaction(async (transaction) => {
      const doc = await this.repo.getDocById(idDoc, transaction);
      if (!doc) {
        const error = new Error('Documento no encontrado');
        (error as any).status = 404;
        throw error;
      }
      return await this.repo.switchDocState(doc, transaction);
    });
  }

  async deleteDoc(idDoc: number) {
    return await sequelize.transaction(async (transaction) => {
      const doc = await this.repo.getDocById(idDoc, transaction);
      if (!doc) {
        const error = new Error('Documento no encontrado');
        (error as any).status = 404;
        throw error;
      }
      await this.repo.deleteDoc(doc, transaction);
      return true; // Retornamos true
    });
  }

  // ─── 4. CREAR Y EDITAR CATEGORÍAS (KNOWLEDGE) ──────────────────────────
  
  async createKnowledge(data: { idHeadquarter?: number | null; title: string; description?: string }, createdBy: number) {
    return await sequelize.transaction(async (transaction) => {
      // Validar que la sede exista (si no es General)
      if (data.idHeadquarter) {
        const hq = await this.repo.getHeadquarterById(data.idHeadquarter, transaction);
        if (!hq) {
          const error = new Error('La sede asignada no existe');
          (error as any).status = 404;
          throw error;
        }
      }

     return await this.repo.createKnowledge({
        ...data,
        idHeadquarter: data.idHeadquarter || null,
        state: 1,
        createdBy,
        createdAt: new Date() // 👈 ¡Agrega esta línea!
      }, transaction);
    });
  }

  async updateKnowledge(idKnowledge: number, data: { title: string; description?: string }) {
    return await sequelize.transaction(async (transaction) => {
      const knowledge = await this.repo.getKnowledgeById(idKnowledge, transaction);
      if (!knowledge) {
        const error = new Error('Categoría no encontrada');
        (error as any).status = 404;
        throw error;
      }
      return await this.repo.updateKnowledge(knowledge, data, transaction);
    });
  }

  // ─── 5. AGREGAR DOCUMENTO CON SUBIDA A AWS S3 ──────────────────────────

  async createDoc(idKnowledge: number, name: string, file: UploadedFile, createdBy: number) {
    return await sequelize.transaction(async (transaction) => {
      // 1. Validar que la categoría exista
      const knowledge = await this.repo.getKnowledgeById(idKnowledge, transaction);
      if (!knowledge) {
        const error = new Error('La categoría asignada no existe');
        (error as any).status = 404;
        throw error;
      }

      // 2. Subir el archivo a AWS S3 usando tu utilidad storage.ts
      const uploadResult = await uploadFile(file, 'knowledge_docs');

      // 3. Guardar el registro en la base de datos con la URL del archivo
      return await this.repo.createDoc({
        idKnowledge,
        name,
        file: uploadResult.url, // Guardamos la URL pública generada por S3
        state: 1, // Por defecto activo
        createdBy,
        createdAt: new Date() // 👈 ¡Agrega esta línea!
      }, transaction);
    });
  }
}