import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Chat } from "./Chat";

@Table({
  tableName: "chatMessages",
  timestamps: false,
})
export class ChatMessage extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Chat)
  @Column(DataType.INTEGER)
  idChat!: number;

  @Column(DataType.INTEGER)
  type!: number;

  @Column(DataType.TEXT)
  content!: string;

  @BelongsTo(() => Chat)
  chat!: Chat;
}