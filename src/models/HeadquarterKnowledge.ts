import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  Comment,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Headquarter } from './Headquarter';
import { Doc } from './Doc';
 
@Table({
  tableName: 'headquarterKnowledge',
  timestamps: false,
})

export class HeadquarterKnowledge extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.MEDIUMINT.UNSIGNED)
  declare id: number;

  @AllowNull(false)
  @Column(DataType.STRING(60))
  title!: string;
 
  @AllowNull(true)
  @Column(DataType.STRING(150))
  description?: string;
 
  @AllowNull(false)
  @Comment('0=Inactivo 1=Activo')
  @Column({ type: DataType.TINYINT.UNSIGNED, defaultValue: 0 })
  state!: number;
 
  @AllowNull(true)
  @Comment('Null = General')
  @ForeignKey(() => Headquarter)
  @Column(DataType.TINYINT.UNSIGNED)
  idHeadquarter?: number | null;
 
  @AllowNull(true)
  @Column(DataType.MEDIUMINT.UNSIGNED)
  createdBy?: number;
 
  @AllowNull(false)
  @Column(DataType.DATE)
  createdAt!: Date;
 
  @BelongsTo(() => Headquarter, 'idHeadquarter')
  headquarter!: Headquarter;
 
  @HasMany(() => Doc, 'idKnowledge')
  docs!: Doc[];


}