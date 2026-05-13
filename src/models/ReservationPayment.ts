import { 
    Table, Column, Model, DataType, PrimaryKey, AutoIncrement, 
    AllowNull, ForeignKey, BelongsTo 
} from 'sequelize-typescript';
import { Reservation } from './Reservation';

@Table({
    tableName: 'reservationPayments',
    timestamps: true
})
export class ReservationPayment extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.MEDIUMINT.UNSIGNED)
    declare id: number;

    @ForeignKey(() => Reservation)
    @AllowNull(false)
    @Column(DataType.MEDIUMINT.UNSIGNED)
    idReservation!: number;

    @AllowNull(false)
    @Column(DataType.TINYINT)
    status!: number;

    @BelongsTo(() => Reservation)
    reservation!: Reservation;
}