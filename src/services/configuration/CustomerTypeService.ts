import { Sequelize } from "sequelize-typescript";
import { CustomerType } from "../../models/CustomerType"
import { Customer } from "../../models/Customer";


export class CustomerTypeService {
    async getAllCustomerTypes() {
        const tiposCliente = await CustomerType.findAll({
            attributes: ['id', 'name', 'description', 'color', 'state',
                [Sequelize.fn('COUNT', Sequelize.col('customers.id')), 'uses']
            ],

            include: [{ model: Customer, attributes: [] }],
            group: ['CustomerType.id'],
            order: [['state', 'DESC']]
        });

        return tiposCliente;
    }

    async createCustomerType(data: { name: string, description: string, color: string }) {
        const dataToSave = {
            name: data.name,
            description: data.description,
            color: data.color,
            createdBy: 1
        };

        await CustomerType.create(dataToSave);
        return true;
    }

    async updateCustomerType(id: number, data: { name: string, description: string, color: string }) {

        await CustomerType.update(
            data,
            {
                where: {
                    id: id
                }
            }
        );
        return true;
    }

    async deleteCustomerType(id: number) {

        const count = await Customer.count({
            where: {
                idCustomerType: id
            }
        });

        if (count > 0) {
            throw new Error("Este tipo de cliente esta en uso");
        }

        const rowDelete = await CustomerType.destroy({
            where: {
                id: id
            }
        });

        if (rowDelete === 0) {
            throw new Error("No ha sido encontraado");
        }

        return true;
    }

    async updateCustomerTypeState(id: number, state: number) {
        await CustomerType.update({ state: state },
            {
                where: {
                    id: id
                }
            }
        );
        return true;
    }
}
