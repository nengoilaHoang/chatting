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
            const createdAccount = await this.accountDao.createAccount(account);
            createdAccount.password = undefined;
            return { success: true, message: "Account registered successfully", account: createdAccount};   
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

    async searchAccountsByEmail(keyword, excludeAccountId) {
        if (!keyword || keyword.trim().length < 2) {
            return { success: false, message: "Keyword must be at least 2 characters" };
        }
        try {
            const accounts = await this.accountDao.searchAccountsByEmail(keyword.trim(), excludeAccountId);
            return { success: true, accounts };
        } catch (error) {
            return { success: false, message: "Error searching accounts: " + error.message };
        }
    }

    async searchAccountByEmail(accountEmail) {
        const account = await this.accountDao.getAccountByEmail(accountEmail);
        if (!account) {
            return { success: false, message: "Account not found" };
        }
        account.password = undefined;
        return { success: true, message: "Account found", account: account};
    }
}
