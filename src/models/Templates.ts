import {
    AllowNull,
    AutoIncrement,
    Column,
    Comment,
    DataType,
    Model,
    PrimaryKey,
    Table
} from 'sequelize-typescript'

@Table({
    tableName: 'templates',
    timestamps: true,
    updatedAt: false
})
export class Templates extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.MEDIUMINT.UNSIGNED)
    declare id: number

    @AllowNull(false)
    @Column(DataType.STRING(50))
    code!: string

    @AllowNull(false)
    @Column({ type: DataType.TINYINT.UNSIGNED, defaultValue: 1 })
    state!: number

    @AllowNull(false)
    @Column(DataType.STRING(200))
    description!: string

    @AllowNull(true)
    @Column(DataType.STRING(255))
    imageUrl?: string

    @AllowNull(false)
    @Comment('1=Telefono 2=Url')
    @Column({ type: DataType.TINYINT.UNSIGNED, defaultValue: 1 })
    buttonType!: number

    @AllowNull(true)
    @Column(DataType.STRING(100))
    buttonText?: string

    @AllowNull(false)
    @Comment('0=En revisión 1=Aprobado 2=Rechazado')
    @Column({ type: DataType.TINYINT.UNSIGNED, defaultValue: 0 })
    statusMeta!: number

    @AllowNull(false)
    @Column(DataType.DATE)
    createdAt!: Date
}
