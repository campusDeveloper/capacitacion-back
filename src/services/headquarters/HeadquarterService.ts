import { sequelize } from "../../config/database";
import { Transaction } from "sequelize";
import {
    ISelectHeadquarterResponse,
    IUpdateMainHeadquarterBody,
    IUpdateUserHeadquarterBody,
    IUserHeadquartersResponse,
} from "../../interfaces/headquarters/Headquarter";
import { HeadquarterRepository } from "../../repositories/headquarters/HeadquarterRepository";

export class HeadquarterService {
    constructor(private readonly repository: HeadquarterRepository) {}

    async getSelectHeadquarters(): Promise<ISelectHeadquarterResponse[]> {
        const headquarters = await this.repository.getActiveHeadquarters();

        return headquarters.map((headquarter) => ({
            idHeadquarter: headquarter.id,
            name: headquarter.name,
        }));
    }

    async getUserHeadquarters(idUser: number): Promise<IUserHeadquartersResponse> {
        this.validatePositiveInteger(idUser, "idUser");

        const records = await this.repository.getUserHeadquarters(idUser);
        const mainRecord = records.find((record) => record.main === 1);

        return {
            mainHeadquarter: mainRecord?.idHeadquarter ?? null,
            headquarters: records
                .filter((record) => record.main === 0)
                .map((record) => record.idHeadquarter),
        };
    }

    async updateMainHeadquarter(idUser: number, body: IUpdateMainHeadquarterBody): Promise<IUserHeadquartersResponse> {
        this.validatePositiveInteger(idUser, "idUser");
        this.validatePositiveInteger(body.idHeadquarter, "idHeadquarter");

        return await sequelize.transaction(async (transaction) => {
            await this.validateUserExists(idUser, transaction);
            await this.validateHeadquarterExists(body.idHeadquarter, transaction);

            const relation = await this.repository.getUserHeadquarter(idUser, body.idHeadquarter, transaction);

            await this.repository.clearMainHeadquarter(idUser, transaction);

            if (relation) {
                await this.repository.updateUserHeadquarterMain(idUser, body.idHeadquarter, 1, transaction);
                return await this.getUserHeadquartersByTransaction(idUser, transaction);
            }

            await this.repository.createUserHeadquarter(
                { idUser, idHeadquarter: body.idHeadquarter, main: 1 },
                transaction,
            );

            return await this.getUserHeadquartersByTransaction(idUser, transaction);
        });
    }

    async updateUserHeadquarter(idUser: number, body: IUpdateUserHeadquarterBody): Promise<IUserHeadquartersResponse> {
        this.validatePositiveInteger(idUser, "idUser");
        this.validatePositiveInteger(body.idHeadquarter, "idHeadquarter");

        if (body.value !== 0 && body.value !== 1) {
            throw new Error("El valor debe ser 0 o 1");
        }

        return await sequelize.transaction(async (transaction) => {
            await this.validateUserExists(idUser, transaction);
            await this.validateHeadquarterExists(body.idHeadquarter, transaction);

            const relation = await this.repository.getUserHeadquarter(idUser, body.idHeadquarter, transaction);

            if (body.value === 1) {
                if (!relation) {
                    await this.repository.createUserHeadquarter(
                        { idUser, idHeadquarter: body.idHeadquarter, main: 0 },
                        transaction,
                    );
                }

                return await this.getUserHeadquartersByTransaction(idUser, transaction);
            }

            if (relation?.main === 1) {
                throw new Error("No se puede eliminar la sede principal");
            }

            await this.repository.deleteSecondaryHeadquarter(idUser, body.idHeadquarter, transaction);
            return await this.getUserHeadquartersByTransaction(idUser, transaction);
        });
    }

    private async validateUserExists(idUser: number, transaction?: Transaction): Promise<void> {
        const user = await this.repository.getUserById(idUser, transaction);

        if (!user) {
            throw new Error("Usuario no encontrado");
        }
    }

    private async validateHeadquarterExists(idHeadquarter: number, transaction?: Transaction): Promise<void> {
        const headquarter = await this.repository.getHeadquarterById(idHeadquarter, transaction);

        if (!headquarter) {
            throw new Error("Sede no encontrada");
        }
    }

    private validatePositiveInteger(value: number, field: string): void {
        if (!Number.isInteger(value) || value <= 0) {
            throw new Error(`El campo ${field} debe ser un numero entero positivo`);
        }
    }

    private async getUserHeadquartersByTransaction(
        idUser: number,
        transaction: Transaction,
    ): Promise<IUserHeadquartersResponse> {
        const records = await this.repository.getUserHeadquarters(idUser, transaction);
        const mainRecord = records.find((record) => record.main === 1);

        return {
            mainHeadquarter: mainRecord?.idHeadquarter ?? null,
            headquarters: records
                .filter((record) => record.main === 0)
                .map((record) => record.idHeadquarter),
        };
    }
}
