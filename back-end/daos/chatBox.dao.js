import db from '../ultil/pgConnection.js';
import chatBoxModel from '../models/chatBox.model.js';

export default class chatBoxDao {
    constructor() {
        this.tableName = 'chat_boxes';
        this.chatMember = 'chat_members';
    }
    async createChatBox(chatBox) {
        return await db(this.tableName).insert({
            name: chatBox.name,
            type: chatBox.type
        });
    }
    async createChatMember(chatBoxId, userId, role) {
        return await db(this.chatMember).insert({
            chat_box_id: chatBoxId,
            user_id: userId,
            role: role
        });
    }
    async deleteChatMember(chatBoxId, userId) {
        return await db(this.chatMember)
            .where({ chat_box_id: chatBoxId, user_id: userId })
            .del();
    }
    async editRoleChatMember(chatBoxId, userId, newRole) {
        return await db(this.chatMember)
            .where({ chat_box_id: chatBoxId, user_id: userId })
            .update({ role: newRole });
    }
    async updateLastViewedAt(chatBoxId, userId) {
        return await db(this.chatMember)
            .where({ chat_box_id: chatBoxId, user_id: userId })
            .update({ last_viewed_at: db.fn.now() });
    }
    async getAllChatBox(userId) {
        const chatBoxesData = await db(this.chatMember)
            .where({ user_id: userId })
            .join(this.tableName, `${this.chatMember}.chat_box_id`, '=', `${this.tableName}.id`)
            .select(
                `${this.tableName}.id`,
                `${this.tableName}.name`,
                `${this.tableName}.type`,
                `${this.tableName}.created_at`,
                `${this.tableName}.updated_at`
            )
            .orderBy(`${this.tableName}.updated_at`, 'desc');
        return chatBoxesData.map(chatBoxData => new chatBoxModel({
            id: chatBoxData.id,
            name: chatBoxData.name,
            type: chatBoxData.type,
            createdAt: chatBoxData.created_at,
            updatedAt: chatBoxData.updated_at
        }));
    }
}