import messageService from "../services/message.service.js";

export default class messageController {
    constructor() {
        this.messageService = new messageService();
    }
    async sendMessage(req, res) {
        const { chatBoxId, senderId, content } = req.body;
        try {
            const result = await this.messageService.sendMessage(chatBoxId, senderId, content);
            if (result && !result.success) {
                res.status(400).json(result);
            } else {
                res.status(201).json({ success: true, message: "Message sent successfully" });
            }
        }catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}