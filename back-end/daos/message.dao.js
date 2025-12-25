import db from '../ultil/pgConnection.js';
import messageModel from '../models/message.model.js';
import aesService from '../services/aesService.js';

export default class messageDao {
    constructor() {
        this.tableName = 'messages';
    }
    async createMessage(message) {
        console.log("📥 [DAO] Content trước khi INSERT:", message.content);
        const [insertedMessage] = await db(this.tableName)
            .insert({
                chat_box_id: message.chatBoxId,
                sender_id: message.senderId,
                content: message.content
            })
            .returning(['id', 'chat_box_id', 'sender_id', 'content', 'created_at']);

        console.log("📤 [DAO] Content sau khi INSERT:", insertedMessage.content);
        return new messageModel({
            id: insertedMessage.id,
            chatBoxId: insertedMessage.chat_box_id,
            senderId: insertedMessage.sender_id,
            //content: insertedMessage.content,
            content: aesService.decrypt(insertedMessage.content, insertedMessage.sender_id),
            createdAt: insertedMessage.created_at
        });
    }

    async getMessagesByChatBoxId(chatBoxId, limit = 20, offset = 0, userId) {
        const messagesData = await db(this.tableName)
            .where({ chat_box_id: chatBoxId })
            .orderBy('created_at', 'asc')
            .limit(limit)
            .offset(offset);
        console.log("📥 [DAO] Content từ DB (message đầu tiên):", messagesData[0]?.content);
        return messagesData.map(messageData => new messageModel({
            id: messageData.id,
            chatBoxId: messageData.chat_box_id,
            senderId: messageData.sender_id,
            content: messageData.content,
            //content: aesService.decrypt(messageData.content, userId),
            createdAt: messageData.created_at
        }));
    }
}