import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  Comment,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { HeadquarterKnowledge } from './HeadquarterKnowledge';

@Table({
  tableName: 'docs',
  timestamps: false,
})
export class Doc extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.MEDIUMINT.UNSIGNED)
  declare id: number;

  @AllowNull(false)
  @Column(DataType.STRING(60))
  name!: string;

  @AllowNull(false)
  @Column(DataType.STRING(120))
  file!: string;

  @AllowNull(false)
  @Comment('0=Inactivo 1=Activo')
  @Column({ type: DataType.TINYINT.UNSIGNED, defaultValue: 1 })
  state!: number;

  @AllowNull(false)
  @ForeignKey(() => HeadquarterKnowledge)
  @Column(DataType.SMALLINT.UNSIGNED)
  idKnowledge!: number;

  @AllowNull(true)
  @Column(DataType.MEDIUMINT.UNSIGNED)
  createdBy?: number;

  @AllowNull(false)
  @Column(DataType.DATE)
  createdAt!: Date;

  @BelongsTo(() => HeadquarterKnowledge, 'idKnowledge')
  knowledge!: HeadquarterKnowledge;
}