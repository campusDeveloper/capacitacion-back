import { Sequelize } from "sequelize-typescript";
import { CustomerType } from "../../models/CustomerType"
import { Customer } from "../../models/Customer";


export class CustomerTypeService {
    async getAllCustomerTypes() {
        const tiposCliente = await CustomerType.findAll({
            attributes: ['id', 'name', 'description', 'color', 'state', 
                [Sequelize.fn('COUNT', Sequelize.col('customers.id')), 'uses']
            ],

            include: [{model: Customer, attributes: []}],
            group: ['CustomerType.id'],
            order: [['state', 'DESC']]
        });
        
        return tiposCliente;
    }
} 