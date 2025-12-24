import db from '../ultil/pgConnection.js';
import messageModel from '../models/message.model.js';

export default class messageDao {
    constructor() {
        this.tableName = 'messages';
    }
    async createMessage(message) {
        const [insertedMessage] = await db(this.tableName)
            .insert({
                chat_box_id: message.chatBoxId,
                sender_id: message.senderId,
                content: message.content
            })
            .returning(['id', 'chat_box_id', 'sender_id', 'content', 'created_at']);

        return new messageModel({
            id: insertedMessage.id,
            chatBoxId: insertedMessage.chat_box_id,
            senderId: insertedMessage.sender_id,
            content: insertedMessage.content,
            createdAt: insertedMessage.created_at
        });
    }

    async getMessagesByChatBoxId(chatBoxId, limit = 20, offset = 0) {
        const messagesData = await db(this.tableName)
            .where({ chat_box_id: chatBoxId })
            .orderBy('created_at', 'asc')
            .limit(limit)
            .offset(offset);
        return messagesData.map(messageData => new messageModel({
            id: messageData.id,
            chatBoxId: messageData.chat_box_id,
            senderId: messageData.sender_id,
            content: messageData.content,
            createdAt: messageData.created_at
        }));
    }
}