import { PreReservationRepository } from '../../repositories/reservations/PreReservationRepository';

export class PreReservationService {
    private repo = new PreReservationRepository();

    private formatData(res: any) {
        const sourceData = res.idCustomer === null ? res.opportunity : res.customer;
        
        // Blindaje contra errores de conversión de fechas
        const checkIn = res.checkInDate ? new Date(res.checkInDate).toISOString().split('T')[0] : '';
        const checkOut = res.checkOutDate ? new Date(res.checkOutDate).toISOString().split('T')[0] : '';

        return {
            idReservation: res.id,
            number: res.number,
            dateReservation: `${checkIn} - ${checkOut}`,
            headquarter: res.headquarter?.name || null,
            roomType: res.roomType,
            customer: sourceData?.name || null,
            statusPayment: (res.payments && res.payments.length > 0) ? res.payments[0].status : null,
            contact: sourceData?.phone || null,
            category: sourceData?.affiliateCategory || null,
            valueTotal: res.valueTotal,
            reminder: null,
            idOpportunity: res.idCustomer === null && res.opportunity ? res.opportunity.id : null
        };
    }

    async getActives() {
        const data = await this.repo.getActives();
        return data.map((item: any) => this.formatData(item));
    }

    async getExpired(page: number, limit: number) {
        const offset = (page - 1) * limit;
        const { rows, count } = await this.repo.getExpired(limit, offset);
        return {
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            limit,
            data: rows.map((item: any) => this.formatData(item))
        };
    }
}