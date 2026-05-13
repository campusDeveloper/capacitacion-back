import { Reservation } from '../../models/Reservation';
import { Headquarter } from '../../models/Headquarter';
import { Customer } from '../../models/Customer';
import { Opportunity } from '../../models/Opportunity';
import { ReservationPayment } from '../../models/ReservationPayment';

export class PreReservationRepository {
    private includes = [
        { model: Headquarter, attributes: ['name'] },
        { model: Customer, attributes: ['name', 'phone', 'affiliateCategory'] },
        { model: Opportunity, attributes: ['id', 'name', 'phone', 'affiliateCategory'] },
        // El separate: true es la clave mágica para no romper el HasMany con Limits/Orders
        { model: ReservationPayment, separate: true, attributes: ['status'], order: [['id', 'DESC']] as any, limit: 1 }
    ];

    async getActives() {
        return await Reservation.findAll({
            where: { type: 2, state: 1 },
            include: this.includes
        });
    }

    async getExpired(limit: number, offset: number) {
        return await Reservation.findAndCountAll({
            where: { type: 2, state: 2 },
            include: this.includes,
            limit,
            offset,
            distinct: true
        });
    }
}