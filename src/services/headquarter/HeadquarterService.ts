import { sequelize } from '../../config/database';
import { HeadquarterRepository } from '../../repositories/headquarters/HeadquarterRepository';

// Interfaz adaptada al JSON del requerimiento
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

  // ─── GET /headquarters ────────────────────────────────────────────────────
  async getHeadquartersWithKnowledge(): Promise<IHeadquarterCard[]> {
    // 1. Obtener conteos de la Card General
    const generalCounts = await this.repo.getGeneralKnowledgeCounts();

    const generalCard: IHeadquarterCard = {
      idHeadquarter: null, // Para que el frontend sepa que es la general
      name: 'Conocimiento General',
      categories: generalCounts.categories,
      docs: generalCounts.docs,
    };

    // 2. Obtener lista de sedes ordenadas DESC
    const headquarters = await this.repo.getAllHeadquartersWithCounts();

    // 3. Mapear para cumplir con las llaves exactas del requerimiento
    const headquarterCards: IHeadquarterCard[] = headquarters.map((hq: any) => ({
      idHeadquarter: hq.id,
      name: hq.name,
      categories: hq.categories, 
      docs: Number(hq.docs),
      state: hq.state,
    }));

    // 4. Retornar uniendo ambas partes (General primero)
    return [generalCard, ...headquarterCards];
  }

  // ─── PUT /headquarter/:id/change-state ────────────────────────────────────
  async switchState(id: number, updatedBy: number) {
    // ✅ 1. Iniciamos la transacción aquí, que es la capa de negocio
    return await sequelize.transaction(async (transaction) => {
      
      // ✅ 2. Buscamos si existe (y le pasamos la transacción)
      const headquarter = await this.repo.getHeadquarterById(id, transaction);

      if (!headquarter) {
        throw new Error('Sede no encontrada'); // Esto lo atrapará el controlador
      }

      // ✅ 3. Pasamos el objeto completo al repositorio para que solo actualice
      return await this.repo.switchState(headquarter, updatedBy, transaction);
    });
  }
}