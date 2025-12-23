import chatBoxService from "../services/chatBox.service.js";

export default class chatBoxController {
    constructor() {
        this.chatBoxService = new chatBoxService();
    }
    async chatNewAccount(req, res) {
        const { senderId, receiverId } = req.body;
        try {
            const result = await this.chatBoxService.chatNewAccount(senderId, receiverId);
            if (result.success) {
                res.status(201).json(result);
            } else {
                res.status(400).json(result);
            }
        }catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async createGroupChat(req, res) {
        const { creatorId, chatBoxName, userIds } = req.body;
        try {
            const result = await this.chatBoxService.createGroupChat(creatorId, chatBoxName, userIds);
            if (result.success) {
                res.status(201).json(result);
            } else {
                res.status(400).json(result);
            }
        }catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async getAllChatBox(req, res) {
        const {userId} = req.body;
        try {
            const result = await this.chatBoxService.getAllChatBox(userId);
            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(400).json(result);
            }
        }catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}