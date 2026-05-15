import { ChatRepository } from "../../repositories/chats/ChatRepository";

export class ChatService {
    static async getOpportunityMessages(idOpportunity: number) {
        const chatData = await ChatRepository.getMessagesByOpportunity(idOpportunity);

        if (!chatData || !chatData.messages) {
            return [];
        }

        return chatData.messages.map((msg: any) => ({
            Id: msg.id,
            Type: msg.type,
            Content: msg.content
        }));
    }
}