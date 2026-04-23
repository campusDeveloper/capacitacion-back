import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Default,
  HasMany,
  BelongsTo,
  ForeignKey,
  CreatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "opportunityTracking",
  timestamps: true,
  updatedAt: false,
})
export class OpportunityTracking extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.SMALLINT.UNSIGNED)
  id!: number;

  @AllowNull(true)
  @ForeignKey(() => OpportunityTracking)
  @Column({ type: DataType.SMALLINT.UNSIGNED, field: "idOpportunityTracking" })
  idOpportunityTracking!: number | null;

  @AllowNull(false)
  @Column(DataType.STRING(40))
  name!: string;

  @AllowNull(false)
  @Column(DataType.STRING(10))
  color!: string;

  @AllowNull(false)
  @Default(1)
  @Column(DataType.TINYINT.UNSIGNED)
  state!: number;

  @AllowNull(true)
  @Column(DataType.MEDIUMINT.UNSIGNED)
  createdBy!: number | null;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @HasMany(() => OpportunityTracking, {
    foreignKey: "idOpportunityTracking",
    as: "children",
  })
  children!: OpportunityTracking[];

  @BelongsTo(() => OpportunityTracking, {
    foreignKey: "idOpportunityTracking",
    as: "parent",
  })
  parent!: OpportunityTracking;
}