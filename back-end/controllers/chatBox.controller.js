import chatBoxService from "../services/chatBox.service.js";

export default class chatBoxController {
    constructor() {
        this.chatBoxService = new chatBoxService();
    }
    chatNewAccount = async (req, res) => {
        const { senderId, receiverId } = req.body;
        if (!senderId || !receiverId) {
            return res.status(400).json({ success: false, message: "senderId and receiverId are required" });
        }
        try {
            const result = await this.chatBoxService.chatNewAccount(senderId, receiverId);
            if (result.success) {
                const statusCode = result.createdNew ? 201 : 200;
                res.status(statusCode).json(result);
            } else {
                res.status(400).json(result);
            }
        }catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    createGroupChat = async (req, res) => {
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
    getAllChatBox = async (req, res) => {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ success: false, message: "userId is required" });
        }
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