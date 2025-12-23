import accountModel from "../models/account.model.js";
import accountDao from "../daos/account.dao.js";
import bcrypt from 'bcrypt';
import dotenv from "dotenv";
dotenv.config();

export default class accountService {
    constructor() {
        this.accountDao = new accountDao();
    }
    async registerAccount(account) {
        if (!account.email || !account.password || !account.displayName) {
            return{ success: false, message: "Missing required fields" };
        }
        if (await this.accountDao.getAccountByEmail(account.email)!==null) {
            return { success: false, message: "Email already in use" };
        }
        try {
            await this.accountDao.createAccount(account);
            account.password = undefined;
            return { success: true, message: "Account registered successfully", account: account};   
        } catch (error) {
            return { success: false, message: "Error registering account: " + error.message };
        }
    }

    async loginAccount(email, password) {
        const account = await this.accountDao.getAccountByEmail(email);
        if (!account) {
            return { success: false, message: "Account not found" };
        }
        const passwordMatch = await bcrypt.compare(password, account.password);
        account.password = undefined;
        if (!passwordMatch) {
            return { success: false, message: "Incorrect password or email" };
        }
        return { success: true, message: "Login successful", account: account};
    }
}
