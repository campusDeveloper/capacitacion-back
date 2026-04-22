
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
import { CustomerType } from './CustomerType'


@Table ({
    tableName: 'customers',
    timestamps: true
})

export class Customer extends Model {
    
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.MEDIUMINT.UNSIGNED)
    declare id: number 

    @AllowNull(false)
    @Column(DataType.STRING(60))
    name!: string

    @AllowNull(false)
    @Column(DataType.STRING(20))
    phone!: string

    @AllowNull(false)
    @Column(DataType.DATE)
    dateBirth!: Date

    @AllowNull(false)
    @Column(DataType.INTEGER.UNSIGNED)
    identification!: number

    @AllowNull(false)
    @Column(DataType.TINYINT.UNSIGNED)
    affiliateCategory!: number


    @ForeignKey(() => CustomerType)
    @AllowNull(false)
    @Column(DataType.TINYINT.UNSIGNED)
    idCustomerType!: number

    @AllowNull(true)
    @Column(DataType.MEDIUMINT.UNSIGNED)
    createdBy?: number

    @Index
    @AllowNull(true)
    @Column(DataType.MEDIUMINT.UNSIGNED)
    updatedBy?: number

    @AllowNull(false)
    @Column(DataType.DATE)
    createdAt!: Date

    @AllowNull(true)
    @Column(DataType.DATE)
    updatedAt!: Date
}