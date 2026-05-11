import {
    AllowNull,
    AutoIncrement,
    Column,
    DataType,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';

@Table({
    tableName: 'customerOpportunityComments',
    createdAt: 'createdAt',
    updatedAt: false,
})

export class CustomerOpportunityComment extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.MEDIUMINT.UNSIGNED)
    declare id: number;

    @AllowNull(true)
    @Column(DataType.TEXT)
    comment!: string;

    @AllowNull(false)
    @Column(DataType.MEDIUMINT.UNSIGNED)
    createdBy!: number;

    @AllowNull(true)
    @Column(DataType.MEDIUMINT.UNSIGNED)
    idCustomer?: number;

    @AllowNull(true)
    @Column(DataType.MEDIUMINT.UNSIGNED)
    idOpportunity?: number;
}