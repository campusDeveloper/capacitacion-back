import {
    AllowNull,
    AutoIncrement,
    Column,
    DataType,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
    Comment    
} from 'sequelize-typescript'
import { User } from './User'

@Table({
    tableName: 'opportunitystate',
    timestamps: true
})
export class OpportunityState extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.MEDIUMINT.UNSIGNED)
    declare id: number

    @AllowNull(false)
    @Column(DataType.STRING(60))
    name!: string

    @AllowNull(false)
    @Column(DataType.STRING(200))
    description!: string


    @AllowNull(false)
    @Comment("0=Inactivo 1=Activo")
    @Column({ type: DataType.TINYINT.UNSIGNED, defaultValue: 1 })
    state!: number

    @AllowNull(false)
    @Comment("Formato HEX")
    @Column(DataType.STRING(10))
    color!: string

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.MEDIUMINT.UNSIGNED)
    createdBy!: number

    @ForeignKey(() => User)
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
