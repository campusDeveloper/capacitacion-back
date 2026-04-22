import { table } from 'node:console'
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
import { Customer } from './Customer'

@Table ({
    tableName: 'customertypes',
    timestamps: true,
    updatedAt: false 
})

export class CustomerType extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.TINYINT.UNSIGNED)
    declare id: number 

    @AllowNull(false)
    @Column(DataType.STRING(70))
    name!: string

    @AllowNull(false)
    @Column(DataType.STRING(300))
    description!: string 

    @AllowNull(false)
    @Comment("0=Inactivo 1=Activo")
    @Column({type: DataType.TINYINT.UNSIGNED, defaultValue: 1})
    state!: number

    @AllowNull(false)
    @Column(DataType.STRING(10))
    color!: string
    
    @AllowNull(true)
    @Column(DataType.MEDIUMINT.UNSIGNED)
    createdBy?: number

    @AllowNull(false)
    @Column(DataType.DATE)
    createdAt!: Date

    @HasMany(() => Customer)
    customers!: Customer[]
}

