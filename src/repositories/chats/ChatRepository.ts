import { Chat } from "../../models/Chat";
import { ChatMessage } from "../../models/ChatMessage";

export class ChatRepository {
    static async getMessagesByOpportunity(idOpportunity: number) {
        return await Chat.findOne({
            where: { idOpportunity: idOpportunity },
            include: [
                {
                    model: ChatMessage,
                    as: 'messages', 
                    attributes: ['id', 'type', 'content']
                }
            ],
            order: [[ { model: ChatMessage, as: 'messages' }, 'id', 'ASC']]
        });
    }
}