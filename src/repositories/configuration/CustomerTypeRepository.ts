import { Transaction, Sequelize, Op } from "sequelize";
import { CustomerType } from "../../models/CustomerType";
import { Customer } from "../../models/Customer";

export class CustomerTypeRepository {
    async getAllCustomerTypes() {
        return await CustomerType.findAll({
            attributes: ['id', 'name', 'description', 'color', 'state',
                [Sequelize.fn('COUNT', Sequelize.col('customers.id')), 'uses']
            ],

            include: [{ model: Customer, attributes: [] }],
            group: ['CustomerType.id'],
            order: [['state', 'DESC']]
        });
    }

    async getCustomerTypeByName(name: string, excludeId?: number, transaction?: Transaction) {
        return await CustomerType.findOne({
            where: {
                name,
                ...(excludeId ? { id: { [Op.ne]: excludeId } } : {}),
            },
            transaction,
        });
    }

    async createCustomerType(
        data: { name: string; description: string; color: string },
        createdBy: number,
        transaction?: Transaction,
    ) {
        return await CustomerType.create(
            { ...data, 
                createdBy, },

            { transaction },
        );
    }

    async updateCustomerType(
        id: number,
        data: { name: string; description: string; color: string },
        transaction?: Transaction,
    ) {
        const [affectedRows] = await CustomerType.update(data, {
            where: { id },
            transaction,
        });

        return affectedRows;
    }

    async countCustomersByType(id: number, transaction?: Transaction) {
        return await Customer.count({
            where: {
                idCustomerType: id,
            },
            transaction,
        });
    }

    async deleteCustomerType(id: number, transaction?: Transaction) {
        return await CustomerType.destroy({
            where: { id },
            transaction,
        });
    }

    async updateCustomerTypeState(id: number, state: number, transaction?: Transaction) {
        const [affectedRows] = await CustomerType.update(
            { state },
            {
                where: { id },
                transaction,
            },
        );

        return affectedRows;
    }
}
