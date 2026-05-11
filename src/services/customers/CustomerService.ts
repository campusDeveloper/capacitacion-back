import { CustomerRepository } from "../../repositories/customers/CustomerRepository";
import { CustomerType } from "../../models/CustomerType";

interface CustomerListItemRaw {
    idCustomer: number;
    name: string;
    phone: string;
    identification: number;
    affiliateCategory: number;
    idCustomerType: number | null;
    countComments: number;
    reservationId: number | null;
    number: number | null;
    checkInDate: string | null;
    checkOutDate: string | null;
    roomType: string | null;
    valueTotal: number | null;
    valuePaid: number | null;
    headquarter: string | null;
    countGuests: number | null;
}

export class CustomerService {
    private repo: CustomerRepository;

    constructor() {
        this.repo = new CustomerRepository();
    }

    private mapAffiliateCategory(category: number): string {
        switch (category) {
            case 1: return "A";
            case 2: return "B";
            case 3: return "C";
            case 4: return "Particular";
            default: return "Desconocido";
        }
    }

    async getCustomersList(filters: {
        name?: string;
        date?: string;
        headquarter?: number;
    }) {
        const rows = await this.repo.getCustomersList(filters) ?? [];

        return rows.map((row: CustomerListItemRaw) => {
            const reservation = row.reservationId ? {
                number: row.number,
                checkInDate: row.checkInDate,
                checkOutDate: row.checkOutDate,
                headquarter: row.headquarter,
                roomType: row.roomType,
                countGuests: row.countGuests ?? 0,
                valueTotal: row.valueTotal,
                valuePaid: row.valuePaid,
            } : null;

            return {
                idCustomer: row.idCustomer,
                name: row.name,
                phone: row.phone,
                identification: row.identification,
                affiliateCategory: this.mapAffiliateCategory(row.affiliateCategory),
                idCustomerType: row.idCustomerType,
                countComments: row.countComments ?? 0,
                reservation,
            };
        });
    }

    async changeCustomerType(idCustomer: number, idType: number): Promise<boolean> {
        const customer = await this.repo.getCustomerById(idCustomer);
        if (!customer) {
            throw new Error("Cliente no encontrado");
        }

        const type = await CustomerType.findByPk(idType);
        if (!type) {
            throw new Error("Tipo de cliente no válido");
        }

        return await this.repo.updateCustomerType(idCustomer, idType);
    }

    async getCustomerReservations(idCustomer: number) {
        const customer = await this.repo.getCustomerById(idCustomer);
        if (!customer) {
            throw new Error("Cliente no encontrado");
        }

        return await this.repo.getCustomerReservations(idCustomer);
    }

    async getCustomerMessagesHistory(idCustomer: number) {
        const customer = await this.repo.getCustomerById(idCustomer);
        if (!customer) {
            throw new Error("Cliente no encontrado");
        }

        const messages = await this.repo.getCustomerMessagesHistory(idCustomer);
        return messages ?? [];
    }

    async getCustomerComments(idCustomer: number) {
        const customer = await this.repo.getCustomerById(idCustomer);
        if (!customer) {
            throw new Error("Cliente no encontrado");
        }

        return await this.repo.getCustomerComments(idCustomer);
    }

    async createCustomerComment(idCustomer: number, comment: string, userId: number) {
        if (!comment?.trim() || comment.length > 250) {
            throw new Error("Comentario inválido");
        }

        const customer = await this.repo.getCustomerById(idCustomer);
        if (!customer) {
            throw new Error("Cliente no encontrado");
        }

        await this.repo.createCustomerComment({
            idCustomer,
            comment,
            createdBy: userId,
        });

        return true;
    }
}