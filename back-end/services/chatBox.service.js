import chatBoxDao from "../daos/chatBox.dao.js";
import chatBoxModel from "../models/chatBox.model.js";

export default class chatBoxService {
    constructor() {
        this.chatBoxDao = new chatBoxDao();
    }
    async chatNewAccount(senderId, receiverId) {
        if (!senderId || !receiverId) {
            return { success: false, message: "senderId and receiverId are required" };
        }
        if (senderId === receiverId) {
            return { success: false, message: "Cannot create chat with yourself" };
        }
        try {
            const existingChat = await this.chatBoxDao.findPrivateChatBoxBetween(senderId, receiverId);
            if (existingChat) {
                const memberIds = await this.chatBoxDao.getMemberIds(existingChat.id);
                existingChat.memberIds = memberIds;
                return { success: true, chatBox: existingChat, createdNew: false };
            }

            const chatBox = await this.chatBoxDao.createChatBox(new chatBoxModel({ name: null, type: 'private' }));
            await this.chatBoxDao.createChatMember(chatBox.id, senderId, 'member');
            await this.chatBoxDao.createChatMember(chatBox.id, receiverId, 'member');
            const summary = await this.chatBoxDao.getChatBoxSummaryForUser(chatBox.id, senderId);
            const memberIds = await this.chatBoxDao.getMemberIds(chatBox.id);
            if (summary) {
                summary.memberIds = memberIds;
            }
            return { success: true, chatBox: summary ?? chatBox, createdNew: true };
        }catch (error) {
            return { success: false, message: "Error creating chat box: " + error.message };
        }
    }
    async createGroupChat(creatorId, chatBoxName, userIds) {
        try {
            const chatBox = await this.chatBoxDao.createChatBox(new chatBoxModel({ name: chatBoxName, type: 'group' }));
            await this.chatBoxDao.createChatMember(chatBox.id, creatorId, 'owner');
            for (const userId of userIds) {
                await this.chatBoxDao.createChatMember(chatBox.id, userId, 'member');
            }
            const memberIds = await this.chatBoxDao.getMemberIds(chatBox.id);
            chatBox.memberIds = memberIds;
            return { success: true, chatBox };
        }catch (error) {
            return { success: false, message: "Error creating group chat: " + error.message };
        }
    }
    async getAllChatBox(userId) {
        try {
            const chatBoxes = await this.chatBoxDao.getAllChatBox(userId);
            return { success: true, chatBoxes: chatBoxes };
        }catch (error) {
            return { success: false, message: "Error retrieving chat boxes: " + error.message}
        }
    }
}