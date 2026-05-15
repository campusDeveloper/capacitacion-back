import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { User } from "./User";
import { Headquarter } from "./Headquarter";
import { OpportunityState } from "./OpportunityState";
import { Exception } from "./Exception";
import { Customer } from "./Customer";

@Table({
  tableName: "opportunities",
  timestamps: true,
})
export class Opportunity extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.MEDIUMINT.UNSIGNED)
  id!: number;


  @AllowNull(true)
  @Column(DataType.STRING(60))
  name!: string;


  @AllowNull(true)
  @Column(DataType.STRING(20))
  phone!: string;

  @AllowNull(true)
  @Column(DataType.MEDIUMINT.UNSIGNED)
  idReservation!: number | null;

  @AllowNull(true)
  @ForeignKey(() => Customer)
  @Column(DataType.MEDIUMINT.UNSIGNED)
  idCustomer!: number;

  @BelongsTo(() => Customer)
  Customer!: Customer;

  @AllowNull(true)
  @ForeignKey(() => Headquarter)
  @Column(DataType.TINYINT.UNSIGNED)
  idHeadquarter!: number;

  @BelongsTo(() => Headquarter)
  Headquarter!: Headquarter;

  @AllowNull(true)
  @Column(DataType.INTEGER.UNSIGNED)
  identification!: number;

  @AllowNull(true)
  @Column(DataType.TINYINT.UNSIGNED)
  affiliateCategory!: number;

  @AllowNull(true)
  @Column(DataType.TINYINT.UNSIGNED)
  guests!: number;

  @AllowNull(true)
  @Column(DataType.DATEONLY)
  checkInDate!: Date;

  @AllowNull(true)
  @Column(DataType.DATEONLY)
  checkOutDate!: Date;

  @AllowNull(true)
  @Column(DataType.STRING(40))
  roomType!: string;

  @AllowNull(true)
  @ForeignKey(() => OpportunityState)
  @Column(DataType.TINYINT.UNSIGNED)
  idOpportunityState!: number | null;

  @BelongsTo(() => OpportunityState)
  OpportunityState!: OpportunityState;

  @AllowNull(true)
  @Column(DataType.SMALLINT.UNSIGNED)
  idOpportunityTracking!: number;

  @AllowNull(true)
  @ForeignKey(() => Exception)
  @Column(DataType.TINYINT.UNSIGNED)
  idException!: number | null;

  @BelongsTo(() => Exception)
  Exception!: Exception;

  @AllowNull(true)
  @Column(DataType.TINYINT)
  alternativePayment!: number;

  @AllowNull(true)
  @Column(DataType.STRING(150))
  paymentNotVerified!: string;

  @AllowNull(true)
  @ForeignKey(() => User)
  @Column(DataType.MEDIUMINT.UNSIGNED)
  idUserAssigned!: number | null;

  @BelongsTo(() => User, { foreignKey: 'idUserAssigned', as: 'UserAssigned' })
  UserAssigned!: User;

  @AllowNull(true)
  @Column(DataType.MEDIUMINT.UNSIGNED)
  createdBy!: number;

  @AllowNull(true)
  @Column(DataType.MEDIUMINT.UNSIGNED)
  updatedBy!: number;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;
}