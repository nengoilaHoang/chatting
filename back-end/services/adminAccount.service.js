import adminAccountDao from "../daos/adminAccount.dao.js";
import adminAccountModel from "../models/adminAccount.model.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

export default class adminAccountService {
    constructor() {
        this.adminAccountDao = new adminAccountDao();
    }
    async loginAdmin(email, password) {
        const adminAccount = await this.adminAccountDao.getAdminByEmail(email);
        if (!adminAccount) {
            throw new Error('Admin account not found');
        }
        const isPasswordValid = await bcrypt.compare(password, adminAccount.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password or email');
        }
        const account = new adminAccountModel({
            id: adminAccount.id,
            email: adminAccount.email,
            password: undefined,
        })
        return {success: true, message: "Login successful", adminAccount: account};
    }
}