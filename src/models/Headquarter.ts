import { Table, Column, Model, DataType, BelongsToMany, PrimaryKey, AllowNull, AutoIncrement, Comment } from 'sequelize-typescript';
import { User } from './User';
import { UserHeadquarter } from './UserHeadquarter';

@Table({
  tableName: 'headquarters',
  timestamps: true,
  underscored: true 
})

export class Headquarter extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column({type: DataType.INTEGER.UNSIGNED})
    id!: number;

    @AllowNull(false)
    @Column(DataType.STRING(60))
    name!: string


    @AllowNull(false)
    @Column(DataType.STRING(60))
    code!: string


    @AllowNull(false)
    @Comment("0 = Inactivo, 1 = Activo")
    @Column({type: DataType.TINYINT.UNSIGNED, defaultValue: 1})
    state!: number


    @AllowNull(false)
    @Column(DataType.STRING(80))
    address!: string


    @AllowNull(false)
    @Column(DataType.STRING(20))
    phone!: string


    @AllowNull(false)
    @Column(DataType.STRING(60))
    email!: string


    @AllowNull(false)
    @Column(DataType.STRING(50))
    city!: string


    @AllowNull(true)
    @Column(DataType.MEDIUMINT.UNSIGNED)
    createdBy?: number

    @AllowNull(true)
    @Column(DataType.MEDIUMINT.UNSIGNED)
    updatedBy?: number


    @AllowNull(false)
    @Column(DataType.DATE)
    createdAt!: Date

    @AllowNull(true)
    @Column(DataType.DATE)
    updatedAt!: Date

    @BelongsToMany(() => User, () => UserHeadquarter)
    users!: User[];


}