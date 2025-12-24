import db from '../ultil/pgConnection.js';
import chatBoxModel from '../models/chatBox.model.js';

export default class chatBoxDao {
    constructor() {
        this.tableName = 'chat_boxes';
        this.chatMember = 'chat_members';
    }
    async createChatBox(chatBox) {
        const [insertedChatBox] = await db(this.tableName)
            .insert({
                name: chatBox.name,
                type: chatBox.type
            })
            .returning(['id', 'name', 'type', 'created_at', 'updated_at']);

        return new chatBoxModel({
            id: insertedChatBox.id,
            name: insertedChatBox.name,
            type: insertedChatBox.type,
            createdAt: insertedChatBox.created_at,
            updatedAt: insertedChatBox.updated_at
        });
    }
    async deleteChatBox(chatBoxId) {
        return await db(this.tableName).where({ id: chatBoxId }).del();
    }
    async createChatMember(chatBoxId, userId, role) {
        return await db(this.chatMember).insert({
            chat_box_id: chatBoxId,
            account_id: userId,
            role
        });
    }
    async deleteChatMember(chatBoxId, userId) {
        return await db(this.chatMember)
            .where({ chat_box_id: chatBoxId, account_id: userId })
            .del();
    }
    async editRoleChatMember(chatBoxId, userId, newRole) {
        return await db(this.chatMember)
            .where({ chat_box_id: chatBoxId, account_id: userId })
            .update({ role: newRole });
    }
    async updateLastViewedAt(chatBoxId, userId) {
        return await db(this.chatMember)
            .where({ chat_box_id: chatBoxId, account_id: userId })
            .update({ last_viewed_at: db.fn.now() });
    }
    _buildSummaryQuery(queryBuilder, userId) {
        return queryBuilder.select([
            'cb.id',
            'cb.name',
            'cb.type',
            'cb.created_at',
            'cb.updated_at',
            db.raw(`
                CASE 
                    WHEN cb.type = 'private' THEN (
                        SELECT COALESCE(a.display_name, a.email)
                        FROM ${this.chatMember} as cm_partner
                        JOIN accounts as a ON cm_partner.account_id = a.id
                        WHERE cm_partner.chat_box_id = cb.id 
                        AND cm_partner.account_id != ?
                        LIMIT 1
                    )
                    ELSE cb.name 
                END as resolved_name
            `, [userId]),
            db.raw(`
                CASE 
                    WHEN cb.type = 'private' THEN (
                        SELECT a.id
                        FROM ${this.chatMember} as cm_partner
                        JOIN accounts as a ON cm_partner.account_id = a.id
                        WHERE cm_partner.chat_box_id = cb.id
                        AND cm_partner.account_id != ?
                        LIMIT 1
                    )
                    ELSE NULL
                END as partner_id
            `, [userId]),
            db.raw(`
                CASE 
                    WHEN cb.type = 'private' THEN (
                        SELECT a.email
                        FROM ${this.chatMember} as cm_partner
                        JOIN accounts as a ON cm_partner.account_id = a.id
                        WHERE cm_partner.chat_box_id = cb.id
                        AND cm_partner.account_id != ?
                        LIMIT 1
                    )
                    ELSE NULL
                END as partner_email
            `, [userId]),
            db.raw(`
                CASE 
                    WHEN cb.type = 'private' THEN (
                        SELECT a.display_name
                        FROM ${this.chatMember} as cm_partner
                        JOIN accounts as a ON cm_partner.account_id = a.id
                        WHERE cm_partner.chat_box_id = cb.id
                        AND cm_partner.account_id != ?
                        LIMIT 1
                    )
                    ELSE NULL
                END as partner_display_name
            `, [userId]),
            db.raw(`
                CASE 
                    WHEN cb.type = 'private' THEN (
                        SELECT a.avatar_url
                        FROM ${this.chatMember} as cm_partner
                        JOIN accounts as a ON cm_partner.account_id = a.id
                        WHERE cm_partner.chat_box_id = cb.id
                        AND cm_partner.account_id != ?
                        LIMIT 1
                    )
                    ELSE NULL
                END as partner_avatar
            `, [userId])
        ]);
    }

    _mapChatBoxRow(row) {
        return new chatBoxModel({
            id: row.id,
            name: row.resolved_name || row.name || 'Conversation',
            type: row.type,
            avatar: row.partner_avatar,
            partnerAvatar: row.partner_avatar,
            partnerId: row.partner_id,
            partnerEmail: row.partner_email,
            partnerDisplayName: row.partner_display_name,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        });
    }

    async getAllChatBox(userId) {
        const chatBoxesData = await this._buildSummaryQuery(
            db(`${this.tableName} as cb`)
                .join(`${this.chatMember} as cm`, 'cm.chat_box_id', 'cb.id')
                .where('cm.account_id', userId),
            userId
        )
            .orderBy('cb.updated_at', 'desc');

        return chatBoxesData.map((chatBoxData) => this._mapChatBoxRow(chatBoxData));
    }

    async getChatBoxSummaryForUser(chatBoxId, userId) {
        const chatBoxData = await this._buildSummaryQuery(
            db(`${this.tableName} as cb`).where('cb.id', chatBoxId),
            userId
        ).first();

        return chatBoxData ? this._mapChatBoxRow(chatBoxData) : null;
    }

    async findPrivateChatBoxBetween(userAId, userBId) {
        const existingChat = await db(`${this.chatMember} as cm1`)
            .join(`${this.chatMember} as cm2`, 'cm1.chat_box_id', 'cm2.chat_box_id')
            .join(`${this.tableName} as cb`, 'cb.id', 'cm1.chat_box_id')
            .where('cm1.account_id', userAId)
            .where('cm2.account_id', userBId)
            .where('cb.type', 'private')
            .select('cb.id')
            .first();

        if (!existingChat) {
            return null;
        }

        return this.getChatBoxSummaryForUser(existingChat.id, userAId);
    }

    async getMemberIds(chatBoxId) {
        return db(this.chatMember)
            .where({ chat_box_id: chatBoxId })
            .pluck('account_id');
    }
}