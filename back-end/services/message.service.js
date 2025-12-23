import messageDao from '../daos/message.dao.js';
import messageModel from '../models/message.model.js';

export default class messageService {
    constructor() {
        this.messageDao = new messageDao();
    }
    async sendMessage(chatBoxId, senderId, content) {
        try {
            await this.messageDao.createMessage(new messageModel({
                chatBoxId: chatBoxId,
                senderId: senderId,
                content: content
            }));
        }catch (error) {
            return { success: false, message: "Error sending message: " + error.message };
        }
    }
}