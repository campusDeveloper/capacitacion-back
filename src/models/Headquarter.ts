import {
  AllowNull,
  AutoIncrement,
  Column,
  Comment,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { HeadquarterKnowledge } from './HeadquarterKnowledge';

@Table({
  tableName: 'headquarters',
  timestamps: true,
})
export class Headquarter extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.TINYINT.UNSIGNED)
  declare id: number;

  @AllowNull(false)
  @Column(DataType.STRING(60))
  name!: string;

  @AllowNull(false)
  @Column(DataType.STRING(60))
  code!: string;

  @AllowNull(false)
  @Comment('0=Inactivo 1=Activo')
  @Column(DataType.TINYINT.UNSIGNED)
  state!: number;

  @AllowNull(false)
  @Column(DataType.STRING(80))
  address!: string;

  @AllowNull(false)
  @Column(DataType.STRING(20))
  phone!: string;

  @AllowNull(false)
  @Column(DataType.STRING(60))
  email!: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  city!: string;

  @AllowNull(true)
  @Column(DataType.MEDIUMINT.UNSIGNED)
  createdBy?: number;

  @AllowNull(true)
  @Column(DataType.MEDIUMINT.UNSIGNED)
  updatedBy?: number;

  @AllowNull(false)
  @Column(DataType.DATE)
  createdAt!: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
  updatedAt!: Date;

  @HasMany(() => HeadquarterKnowledge, 'idHeadquarter')
  knowledge!: HeadquarterKnowledge[];
}
