import messageDao from '../daos/message.dao.js';
import messageModel from '../models/message.model.js';
import chatBoxService from './chatBox.service.js';

export default class messageService {
    constructor() {
        this.messageDao = new messageDao();
        this.chatBoxService = new chatBoxService();
    }
    async sendMessage({ chatBoxId, senderId, receiverId, content }) {
        if (!senderId || !content) {
            return { success: false, message: "senderId and content are required" };
        }

        let resolvedChatBoxId = chatBoxId;
        let chatBoxPayload = null;

        if (!resolvedChatBoxId) {
            if (!receiverId) {
                return { success: false, message: "receiverId is required when chatBoxId is missing" };
            }
            const chatResult = await this.chatBoxService.chatNewAccount(senderId, receiverId);
            if (!chatResult.success) {
                return chatResult;
            }
            resolvedChatBoxId = chatResult.chatBox?.id;
            chatBoxPayload = chatResult.chatBox;
        }

        try {
            const message = await this.messageDao.createMessage(new messageModel({
                chatBoxId: resolvedChatBoxId,
                senderId,
                content
            }));

            const memberIds = await this.chatBoxService.chatBoxDao.getMemberIds(resolvedChatBoxId);
            const memberSummaries = {};
            for (const memberId of memberIds) {
                memberSummaries[memberId] = await this.chatBoxService.chatBoxDao.getChatBoxSummaryForUser(resolvedChatBoxId, memberId);
            }

            return { success: true, chatBoxId: resolvedChatBoxId, chatBox: chatBoxPayload, message, memberIds, memberSummaries };
        }catch (error) {
            return { success: false, message: "Error sending message: " + error.message };
        }
    }

    async getMessages(chatBoxId, limit = 20, offset = 0, userId) {
        if (!chatBoxId) {
            return { success: false, message: "chatBoxId is required" };
        }

        try {
            const messages = await this.messageDao.getMessagesByChatBoxId(chatBoxId, limit, offset, userId);
            return { success: true, messages };
        } catch (error) {
            return { success: false, message: "Error retrieving messages: " + error.message };
        }
    }
}