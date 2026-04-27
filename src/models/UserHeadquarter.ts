import { Table, Column, Model, DataType, ForeignKey, AutoIncrement, PrimaryKey, AllowNull } from 'sequelize-typescript';
import { User } from './User';
import { Headquarter } from './Headquarter';


@Table({
  tableName: 'users_headquarters',
  timestamps: true,
  underscored: true
})

export class UserHeadquarter extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.MEDIUMINT.UNSIGNED)
    declare id: number 

    @AllowNull(false)  
    @Column({type: DataType.TINYINT.UNSIGNED, defaultValue: 1})
    main!: number

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column({type: DataType.MEDIUMINT.UNSIGNED})
    idUser!: number;

    @ForeignKey(() => Headquarter)
    @Column({type: DataType.TINYINT.UNSIGNED})
    IdHeadquarter!: number;

    @AllowNull(true)
    @Column(DataType.MEDIUMINT.UNSIGNED)
    createdBy?: number

    @AllowNull(false)
    @Column(DataType.DATE)
    createdAt!: Date
}

