import chatBoxDao from "../daos/chatBox.dao";
import chatBoxModel from "../models/chatBox.model.js";
import userModel from "../models/user.model.js";

export default class chatBoxService {
    constructor() {
        this.chatBoxDao = new chatBoxDao();
    }
    async chatNewAccount(senderId, receiverId) {
        try {
            const chatBox = await this.chatBoxDao.createChatBox(new chatBoxModel({ name: null, type: 'private' }));
            await this.chatBoxDao.createChatMember(chatBox.id, senderId, 'member');
            await this.chatBoxDao.createChatMember(chatBox.id, receiverId, 'member');
            return { success: true, message: "Chat box created successfully"};
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