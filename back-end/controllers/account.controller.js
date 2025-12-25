import accountService from "../services/account.service.js";
import accountModel from "../models/account.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {aesKeyMgr} from "../ultil/manageAESkey.js";
dotenv.config();

export default class accountController {
    constructor() {
        this.accountService = new accountService();
    }
    setAccessTokenCookie = (res, account) => {
        if (!account?.id) {
            return null;
        }

        const payload = { id: account.id, email: account.email, displayName: account.displayName };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });
        return accessToken;
    }
    registerAccount = async (req, res) => {
        const {email, password, displayName} = req.body;
        try {
            const account = new accountModel({email, password, displayName});
            const result = await this.accountService.registerAccount(account);
            if (result.success) {
                aesKeyMgr.addAesKey(result.account.id);
                const token = this.setAccessTokenCookie(res, result.account);
                res.status(201).json({ ...result, token, aesKey: aesKeyMgr.getAesKey(result.account.id) });
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    loginAccount = async (req, res) => {
        const { email, password } = req.body;
        try {
            const result = await this.accountService.loginAccount(email, password);
            if (result.success) {
                const token = this.setAccessTokenCookie(res, result.account);
                aesKeyMgr.addAesKey(result.account.id);
                res.status(200).json({ ...result, token, aesKey: aesKeyMgr.getAesKey(result.account.id) });
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    logout = async (req, res) => {
        res.clearCookie("accessToken");
        const userId = req.locals.userId;
        aesKeyMgr.removeAesKey(userId);
        res.status(200).json({ success: true, message: "Logged out successfully" });
    }
    searchAccounts = async (req, res) => {
        const { keyword, excludeAccountId } = req.query;
        try {
            const result = await this.accountService.searchAccountsByEmail(keyword, excludeAccountId);
            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}