import db from '../ultil/pgConnection.js';
import accountModel from '../models/account.model.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();
export default class accountDao {
    constructor() {
        this.tableName = 'accounts';
    }
    async createAccount(account) {
        const [insertedAccount] = await db(this.tableName)
            .insert({
                email: account.email,
                password: await bcrypt.hash(account.password, parseInt(process.env.BCRYPT_SALT_ROUNDS)),
                display_name: account.displayName,
                avatar_url: account.avatar
            })
            .returning(['id', 'email', 'display_name', 'avatar_url']);

        return new accountModel({
            id: insertedAccount.id,
            email: insertedAccount.email,
            displayName: insertedAccount.display_name,
            avatar: insertedAccount.avatar_url
        });
    }
    async getAccountByEmail(email) {
        const accountData = await db(this.tableName).where({ email }).first();
        return accountData ? new accountModel({
            id: accountData.id,
            email: accountData.email,
            password: accountData.password,
            displayName: accountData.display_name,
            avatar: accountData.avatar_url
        }) : null;
    }

    async getAccountById(id) {
        const accountData = await db(this.tableName).where({ id }).first();
        return accountData ? new accountModel({
            id: accountData.id,
            email: accountData.email,
            password: accountData.password,
            displayName: accountData.display_name,
            avatar: accountData.avatar_url
        }) : null;
    }

    async searchAccountsByEmail(keyword, excludeAccountId) {
        if (!keyword) {
            return [];
        }

        const query = db(this.tableName)
            .select('id', 'email', { displayName: 'display_name' }, { avatarUrl: 'avatar_url' })
            .whereILike('email', `%${keyword}%`)
            .orderBy('email', 'asc')
            .limit(10);

        if (excludeAccountId) {
            query.whereNot('id', excludeAccountId);
        }

        const accounts = await query;
        return accounts.map((account) => new accountModel({
            id: account.id,
            email: account.email,
            displayName: account.displayName,
            avatar: account.avatarUrl
        }));
    }
}