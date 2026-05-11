import { CustomerTypeRepository } from "../../repositories/configuration/CustomerTypeRepository";
import { sequelize } from "../../config/database";
import {CreateCustomerTypePayload, UpdateCustomerTypeStatePayload, UpdateCustomerTypePayload} from "../../validators/configuration/CustomerTypeValidator";


export class CustomerTypeService {
    private repo: CustomerTypeRepository;

    constructor(repository: CustomerTypeRepository) {
        this.repo = repository;
    }

    async getAllCustomerTypes() {
        return await this.repo.getAllCustomerTypes();
    }

    async createCustomerType(data: CreateCustomerTypePayload, createdBy: number) {
        const existingCustomerType = await this.repo.getCustomerTypeByName(data.name);
        if (existingCustomerType) {
            throw new Error("El tipo de cliente ya existe");
        }

        return await sequelize.transaction(async (transaction) => {
            return await this.repo.createCustomerType(data, createdBy, transaction);
        });
    }

    async updateCustomerType(id: number, data: UpdateCustomerTypePayload) {
        const existingCustomerType = await this.repo.getCustomerTypeByName(data.name, id);
        if (existingCustomerType) {
            throw new Error("El tipo de cliente ya existe");
        }

        return await sequelize.transaction(async (transaction) => {
            const affectedRows = await this.repo.updateCustomerType(
                id,
                {
                    name: data.name,
                    description: data.description,
                    color: data.color,
                },
                transaction,
            );

            if (affectedRows === 0) {
                throw new Error("No ha sido encontrado");
            }
            return true;
        });
    }

    async deleteCustomerType(id: number) {
        return await sequelize.transaction(async (transaction) => {
            const count = await this.repo.countCustomersByType(id, transaction);

            if (count > 0) {
                throw new Error("Este tipo de cliente esta en uso");
            }

            const rowDelete = await this.repo.deleteCustomerType(id, transaction);

            if (rowDelete === 0) {
                throw new Error("No ha sido encontrado");
            }

            return true;
        });
    }

    async updateCustomerTypeState(id: number, state: UpdateCustomerTypeStatePayload["state"]) {
        return await sequelize.transaction(async (transaction) => {
            if (state === 0) {
                const count = await this.repo.countCustomersByType(id, transaction);

                if (count > 0) {
                    throw new Error("Este tipo de cliente esta en uso");
                }
            }

            const affectedRows = await this.repo.updateCustomerTypeState(id, state, transaction);

            if (affectedRows === 0) {
                throw new Error("No ha sido encontrado");
            }

            return true;
        });
    }

    async getActiveCustomerTypes() {
        return await this.repo.getActiveCustomerTypes();
    }
}
