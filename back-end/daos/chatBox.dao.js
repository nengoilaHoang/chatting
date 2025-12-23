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
    async deleteChatBox(chatBoxId) {
        return await db(this.tableName).where({ id: chatBoxId }).del();
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
    // async getAllChatBox(userId) {
    //     const chatBoxesData = await db(this.chatMember)
    //         .where({ user_id: userId })
    //         .join(this.tableName, `${this.chatMember}.chat_box_id`, '=', `${this.tableName}.id`)
    //         .select(
    //             `${this.tableName}.id`,
    //             `${this.tableName}.name`,
    //             `${this.tableName}.type`,
    //             `${this.tableName}.created_at`,
    //             `${this.tableName}.updated_at`
    //         )
    //         .orderBy(`${this.tableName}.updated_at`, 'desc');
    //     return chatBoxesData.map(chatBoxData => new chatBoxModel({
    //         id: chatBoxData.id,
    //         name: chatBoxData.name,
    //         type: chatBoxData.type,
    //         createdAt: chatBoxData.created_at,
    //         updatedAt: chatBoxData.updated_at
    //     }));
    // }

    async getAllChatBox(userId) {
    const chatBoxesData = await db(`${this.tableName} as cb`)
        .join(`${this.chatMember} as cm`, 'cm.chat_box_id', 'cb.id')
        .where('cm.account_id', userId)
        .select([
            'cb.id',
            'cb.type',
            'cb.created_at',
            'cb.updated_at',
            db.raw(`
                CASE 
                    -- Nếu là chat riêng tư (private)
                    WHEN cb.type = 'private' THEN (
                        SELECT a.full_name  -- Thay 'full_name' bằng cột tên trong bảng accounts của bạn
                        FROM chat_members as cm_partner
                        JOIN accounts as a ON cm_partner.account_id = a.id
                        WHERE cm_partner.chat_box_id = cb.id 
                        AND cm_partner.account_id != ? -- Lấy người KHÔNG PHẢI là mình
                        LIMIT 1
                    )
                    -- Nếu là chat nhóm (group), lấy tên có sẵn
                    ELSE cb.name 
                END as name
            `, [userId])
        ])
        .orderBy('cb.updated_at', 'desc');
    return chatBoxesData.map(chatBoxData => new chatBoxModel({
        id: chatBoxData.id,
        name: chatBoxData.name || 'Unknown User',
        type: chatBoxData.type,
        createdAt: chatBoxData.created_at,
        updatedAt: chatBoxData.updated_at
    }));
}
}