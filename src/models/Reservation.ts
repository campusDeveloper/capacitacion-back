import { 
    Table, Column, Model, DataType, PrimaryKey, AutoIncrement, 
    AllowNull, ForeignKey, BelongsTo, HasOne, HasMany 
} from 'sequelize-typescript';
import { Headquarter } from './Headquarter';
import { Customer } from './Customer';
import { Opportunity } from './Opportunity';
import { ReservationPayment } from './ReservationPayment';

@Table({
    tableName: 'reservations',
    timestamps: true
})
export class Reservation extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.MEDIUMINT.UNSIGNED)
    declare id: number;

    @AllowNull(false)
    @Column(DataType.STRING(50))
    number!: string;

    @AllowNull(true)
    @Column(DataType.DATE)
    checkInDate!: Date;

    @AllowNull(true)
    @Column(DataType.DATE)
    checkOutDate!: Date;

    @ForeignKey(() => Headquarter)
    @AllowNull(false)
    @Column(DataType.MEDIUMINT.UNSIGNED)
    idHeadquarter!: number;

    @AllowNull(true)
    @Column(DataType.STRING(50))
    roomType!: string;

    @ForeignKey(() => Customer)
    @AllowNull(true)
    @Column(DataType.MEDIUMINT.UNSIGNED)
    idCustomer!: number | null;

    @AllowNull(true)
    @Column(DataType.DECIMAL(10, 2))
    valueTotal!: number;

    @AllowNull(false)
    @Column(DataType.TINYINT)
    type!: number; // 2 = Pre-reserva

    @AllowNull(false)
    @Column(DataType.TINYINT)
    state!: number; // 1 = Activa, 2 = Vencida

    @BelongsTo(() => Headquarter)
    headquarter!: Headquarter;

    @BelongsTo(() => Customer)
    customer!: Customer;

    @HasOne(() => Opportunity, 'idReservation')
    opportunity!: Opportunity;

    @HasMany(() => ReservationPayment, 'idReservation')
    payments!: ReservationPayment[];
}