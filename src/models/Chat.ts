import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, HasMany, BelongsTo } from "sequelize-typescript";
import { Opportunity } from "./Opportunity";
import { ChatMessage } from "./ChatMessage";

@Table({
  tableName: "chats",
  timestamps: false,
})
export class Chat extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Opportunity)
  @Column(DataType.INTEGER)
  idOpportunity!: number;

  @Column(DataType.DATE)
  lastConnection!: Date;

  @BelongsTo(() => Opportunity)
  opportunity!: Opportunity;

  @HasMany(() => ChatMessage)
  messages!: ChatMessage[];
}