import db from '../ultil/pgConnection.js';
import adminAccountModel from '../models/adminAccount.model.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

export default class adminAccountDao {
    constructor() {
        this.tableName = 'admins';
    }
    async getAdminByEmail(email) {
        const adminData = await db(this.tableName).where({ email: email }).first();
        return adminData ? new adminAccountModel({     
            id: adminData.id,
            email: adminData.email,
            password: adminData.password
        }) : null;
    }
}