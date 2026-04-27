import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

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
  @Column(DataType.SMALLINT.UNSIGNED)
  idOpportunityTracking!: number | null;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;
}