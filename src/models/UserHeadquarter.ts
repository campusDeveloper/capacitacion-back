import { Table, Column, Model, DataType, ForeignKey, AutoIncrement, PrimaryKey, AllowNull } from 'sequelize-typescript';
import { User } from './User';
import { Headquarter } from './Headquarter';


@Table({
  tableName: 'usersheadquarters',
  timestamps: false
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
    @AllowNull(false)
    @Column({type: DataType.INTEGER.UNSIGNED})
    IdHeadquarter!: number;

    @AllowNull(true)
    @Column(DataType.MEDIUMINT.UNSIGNED)
    createdBy?: number

    @AllowNull(false)
    @Column(DataType.DATE)
    createdAt!: Date
}

