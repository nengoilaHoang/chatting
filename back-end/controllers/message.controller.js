import messageService from "../services/message.service.js";

export default class messageController {
    constructor() {
        this.messageService = new messageService();
    }
    sendMessage = async (req, res) => {
        const { chatBoxId, senderId, receiverId, content } = req.body;
        try {
            const result = await this.messageService.sendMessage({ chatBoxId, senderId, receiverId, content });
            if (!result.success) {
                return res.status(400).json(result);
            }

            const io = req.app.get('io');
            if (io && Array.isArray(result.memberIds)) {
                const payload = {
                    chatBoxId: result.chatBoxId,
                    chatBox: result.chatBox,
                    message: result.message,
                };

                io.to(`chat:${result.chatBoxId}`).emit('new_message', payload);

                result.memberIds.forEach((memberId) => {
                    const personalizedChat = result.memberSummaries?.[memberId] ?? result.chatBox ?? null;
                    io.to(`user:${memberId}`).emit('new_message', {
                        chatBoxId: result.chatBoxId,
                        chatBox: personalizedChat,
                        message: result.message,
                    });
                });
            }

            res.status(result.chatBox?.id && !chatBoxId ? 201 : 200).json(result);
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    getMessages = async (req, res) => {
        const { chatBoxId } = req.params;
        const { limit, offset } = req.query;
        try {
            const result = await this.messageService.getMessages(chatBoxId, Number(limit) || 50, Number(offset) || 0);
            if (!result.success) {
                return res.status(400).json(result);
            }
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}