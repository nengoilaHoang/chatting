import db from '../ultil/pgConnection.js';
import messageModel from '../models/message.model.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

export default class messageDao {
    constructor() {
        this.tableName = 'messages';
    }
    async createMessage(message) {
        return await db(this.tableName).insert({
            chat_box_id: message.chatBoxId,
            sender_id: message.senderId,
            content: message.content
        });
    }

    async getMessagesByChatBoxId(chatBoxId, limit = 20, offset = 0) {
        const messagesData = await db(this.tableName)
            .where({ chat_box_id: chatBoxId })
            .orderBy('created_at', 'desc')
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