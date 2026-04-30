import { Transaction } from "sequelize";
import { Headquarter } from "../../models/Headquarter";
import { User } from "../../models/User";
import { UserHeadquarter } from "../../models/UserHeadquarter";

export class HeadquarterRepository {
    async getActiveHeadquarters(): Promise<Headquarter[]> {
        return await Headquarter.findAll({
            where: { state: 1 },
            attributes: ["id", "name"],
            order: [["name", "ASC"]],
        });
    }

    async getHeadquarterById(idHeadquarter: number, transaction?: Transaction): Promise<Headquarter | null> {
        return await Headquarter.findByPk(idHeadquarter, { transaction });
    }

    async getUserById(idUser: number, transaction?: Transaction): Promise<User | null> {
        return await User.findByPk(idUser, { transaction });
    }

    async getUserHeadquarters(idUser: number, transaction?: Transaction): Promise<UserHeadquarter[]> {
        return await UserHeadquarter.findAll({
            where: { idUser },
            attributes: ["id", "idUser", "idHeadquarter", "main"],
            order: [["main", "DESC"], ["idHeadquarter", "ASC"]],
            transaction,
        });
    }

    async getUserHeadquarter(
        idUser: number,
        idHeadquarter: number,
        transaction?: Transaction,
    ): Promise<UserHeadquarter | null> {
        return await UserHeadquarter.findOne({
            where: { idUser, idHeadquarter },
            transaction,
        });
    }

    async clearMainHeadquarter(idUser: number, transaction?: Transaction) {
        return await UserHeadquarter.update(
            { main: 0 },
            { where: { idUser, main: 1 }, transaction },
        );
    }

    async createUserHeadquarter(
        data: { idUser: number; idHeadquarter: number; main: number },
        transaction?: Transaction,
    ): Promise<UserHeadquarter> {
        return await UserHeadquarter.create(
            {
                idUser: data.idUser,
                idHeadquarter: data.idHeadquarter,
                main: data.main,
            },
            { transaction },
        );
    }

    async updateUserHeadquarterMain(
        idUser: number,
        idHeadquarter: number,
        main: number,
        transaction?: Transaction,
    ) {
        return await UserHeadquarter.update(
            { main },
            { where: { idUser, idHeadquarter }, transaction },
        );
    }

    async deleteSecondaryHeadquarter(idUser: number, idHeadquarter: number, transaction?: Transaction) {
        return await UserHeadquarter.destroy({
            where: { idUser, idHeadquarter, main: 0 },
            transaction,
        });
    }
}
