import { sequelize } from "../../config/database";
import { QueryTypes } from "sequelize";
import { Customer } from "../../models/Customer";
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

export class CustomerRepository {
    async getCustomersList(filters: {
        name?: string;
        date?: string;
        headquarter?: number;
    }) {

        const query = `
            SELECT 
                c.id AS idCustomer,
                c.name,
                c.phone,
                c.identification,
                c.affiliateCategory,
                c.idCustomerType,

                (
                    SELECT COUNT(*)
                    FROM customerComments cc
                    WHERE cc.idCustomer = c.id
                ) AS countComments,

                r.id AS reservationId,
                r.number,
                r.checkInDate,
                r.checkOutDate,
                r.roomType,
                r.valueTotal,
                r.valuePaid,
                r.idHeadquarter,

                h.name AS headquarter,

                (
                    SELECT COUNT(*)
                    FROM reservationGuests rg
                    WHERE rg.idReservation = r.id
                ) AS countGuests

            FROM customers c

            LEFT JOIN reservations r ON r.id = (
                SELECT r2.id
                FROM reservations r2
                WHERE r2.idCustomer = c.id
                    AND r2.type = 1
                    AND r2.state = 1
                ORDER BY r2.checkInDate DESC
                LIMIT 1
            )

            LEFT JOIN headquarters h ON h.id = r.idHeadquarter

            WHERE
                (:name IS NULL OR c.name LIKE CONCAT('%', :name, '%'))
                AND (
                    :date IS NULL 
                    OR (r.checkInDate IS NOT NULL AND r.checkInDate = :date)
                )
                AND (:headquarter IS NULL OR r.idHeadquarter = :headquarter)

            ORDER BY r.checkInDate IS NULL, r.checkInDate DESC;
        `;

        const rows = await sequelize.query<CustomerListItemRaw>(query, {
            type: QueryTypes.SELECT,
            replacements: {
                name: filters.name || null,
                date: filters.date || null,
                headquarter: filters.headquarter || null,
            },
        });

        return rows;
    }

    async getCustomerById(idCustomer: number): Promise<Customer | null> {
        return await Customer.findByPk(idCustomer);
    }

    async updateCustomerType(idCustomer: number, idType: number): Promise<boolean> {
        const [affectedRows] = await Customer.update(
            { idCustomerType: idType },
            {
                where: { id: idCustomer }
            }
        );

        return affectedRows > 0;
    }

    async getCustomerReservations(idCustomer: number) {
        const query = `
            SELECT
              r.id,
              r.number,
              r.checkInDate,
              r.checkOutDate,
              r.roomType,
              r.valueTotal AS value,
              h.name AS headquarter,

              (
                SELECT COUNT(*)
                FROM reservationGuests rg
                WHERE rg.idReservation = r.id
              ) AS countGuests

            FROM reservations r

            LEFT JOIN headquarters h ON h.id = r.idHeadquarter

            WHERE
              r.idCustomer = :idCustomer
              AND r.type = 1
              AND r.state = 1

            ORDER BY r.checkInDate DESC;
        `;

        const rows = await sequelize.query(query, {
            type: QueryTypes.SELECT,
            replacements: { idCustomer },
        });

        return rows;
    }

    async getCustomerMessagesHistory(idCustomer: number) {
        const query = `
            SELECT
              cm.id,
              cm.type,
              cm.content

            FROM chatMessages cm

            INNER JOIN chats c ON c.id = cm.idChat

            INNER JOIN opportunities o ON o.id = c.idOpportunity

            WHERE o.id = (
              SELECT o2.id
              FROM opportunities o2
              WHERE o2.idCustomer = :idCustomer
              ORDER BY o2.id DESC
              LIMIT 1
            )

            ORDER BY cm.id ASC;
        `;

        const rows = await sequelize.query(query, {
            type: QueryTypes.SELECT,
            replacements: { idCustomer },
        });

        return rows;
    }
}