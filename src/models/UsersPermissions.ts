import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table({ tableName: 'userspermissions', timestamps: true, updatedAt: false })
export class UsersPermissions extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.MEDIUMINT.UNSIGNED)
    id!: number;

    @Column(DataType.TINYINT)
    module!: number;

    @Column(DataType.MEDIUMINT.UNSIGNED)
    idUser!: number;

    @Column(DataType.MEDIUMINT.UNSIGNED)
    createdBy!: number;

    @Column(DataType.DATE)
    createdAt!: Date
}
