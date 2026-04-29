import bcrypt from 'bcrypt'
import {
    AllowNull,
    AutoIncrement,
    Column,
    DataType,
    ForeignKey,
    Index,
    Model,
    PrimaryKey,
    Table,
    HasMany, Comment, BelongsToMany
} from 'sequelize-typescript'

import { Headquarter } from './Headquarter';
import { UserHeadquarter } from './UserHeadquarter';


@Table({
    tableName: 'users',
    timestamps: true
})

export class User extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.MEDIUMINT.UNSIGNED)
    declare id: number

    @AllowNull(false)
    @Comment("1=Admin 2=Comercial")
    @Column({ type: DataType.TINYINT.UNSIGNED, defaultValue: 1 })
    type!: number

    @AllowNull(false)
    @Column(DataType.STRING(60))
    name!: string

    @AllowNull(false)
    @Comment("0=Inactivo 1=Activo")
    @Column({ type: DataType.TINYINT.UNSIGNED, defaultValue: 1 })
    state!: number

    @AllowNull(false)
    @Column(DataType.STRING(100))
    email!: string

    @AllowNull(false)
    @Column(DataType.STRING(120))
    password!: string
    @Index

    @AllowNull(false)
    @Comment("0 =No 1 =Si")
    @Column({ type: DataType.TINYINT.UNSIGNED, defaultValue: 1 })
    specialAgent!: number

    @AllowNull(false)
    @Comment("0 =No 1 =Si")
    @Column({ type: DataType.TINYINT.UNSIGNED, defaultValue: 1 })
    paymentAgent!: number

    @AllowNull(true)
    @Column(DataType.MEDIUMINT.UNSIGNED)
    createdBy?: number

    @Index
    @AllowNull(true)
    @Column(DataType.MEDIUMINT.UNSIGNED)
    updatedBy?: number

    @AllowNull(false)
    @Column({type: DataType.DATE, defaultValue: DataType.NOW})
    createdAt!: Date;

    @AllowNull(false)
    @Column({type: DataType.DATE, defaultValue: DataType.NOW})
    updatedAt!: Date;


    @BelongsToMany(() => Headquarter, () => UserHeadquarter)
    headquarters!: Headquarter[];

}
