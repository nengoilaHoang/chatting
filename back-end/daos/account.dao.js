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
        return await db(this.tableName).insert({
            email:  account.email,
            password: await bcrypt.hash(account.password, parseInt(process.env.BCRYPT_SALT_ROUNDS)),
            display_name: account.displayName,
            avatar_url: account.avatar
        });
    }
    async getAccountByEmail(email) {
        const accountData = await db(this.tableName).where({ email: email }).first();
        return accountData ? new accountModel({     
            id: accountData.id,
            email: accountData.email,
            password: accountData.password,
            displayName: accountData.display_name,
            avatar: accountData.avatar_url
        }) : null;        
    }

    async searchAccountName(accountName) {}
}