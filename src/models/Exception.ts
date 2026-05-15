import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull
} from "sequelize-typescript";

@Table({
  tableName: "exceptions",
  timestamps: true,
})
export class Exception extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.TINYINT.UNSIGNED)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  name!: string;
}