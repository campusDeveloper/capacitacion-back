import { Table, Column, Model, DataType, ForeignKey, AutoIncrement, PrimaryKey, AllowNull, BelongsTo } from 'sequelize-typescript';
import { User } from './User';
import { Headquarter } from './Headquarter';


@Table({
  tableName: 'usersHeadquarters',
  timestamps: false
})

export class UserHeadquarter extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.MEDIUMINT.UNSIGNED)
    declare id: number 

    @AllowNull(false)  
    @Column({type: DataType.TINYINT, defaultValue: 0})
    main!: number

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column({type: DataType.MEDIUMINT.UNSIGNED})
    idUser!: number;

    @ForeignKey(() => Headquarter)
    @AllowNull(false)
    @Column({type: DataType.TINYINT.UNSIGNED})
    idHeadquarter!: number;

    @AllowNull(true)
    @Column(DataType.MEDIUMINT.UNSIGNED)
    createdBy?: number

    @AllowNull(false)
    @Column({type: DataType.DATE, defaultValue: DataType.NOW})
    createdAt!: Date

    @BelongsTo(() => User, 'idUser')
    user!: User;

    @BelongsTo(() => Headquarter, 'idHeadquarter')
    headquarter!: Headquarter;
}

