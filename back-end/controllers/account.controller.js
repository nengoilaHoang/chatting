import accountService from "../services/account.service.js";
import accountModel from "../models/account.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default class accountController {
    constructor() {
        this.accountService = new accountService();
    }
    registerAccount = async (req, res) => {
        const {email, password, displayName} = req.body;
        const account = new accountModel({email, password, displayName});
        const result = await this.accountService.registerAccount(account);
        const accessToken = jwt.sign({id: result.id, email: result.email, displayName: result.displayName}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.cookie('accessToken', accessToken, {
            httpOnly: true,  // chống XSS
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict', // Chống CSRF
            maxAge: 24 * 60 * 60 * 1000// 1 day
        });
        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
        } 
    }
    loginAccount = async (req, res) => {
        const { email, password } = req.body;
        const result = await this.accountService.loginAccount(email, password);
        const accessToken = jwt.sign({id: result.id, email: result.email, displayName: result.displayName}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.cookie('accessToken', accessToken, {
            httpOnly: true,  // chống XSS
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict', // Chống CSRF
            maxAge: 24 * 60 * 60 * 1000// 1 day
        });
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    }
    logout = async (req, res) => {
        res.clearCookie("accessToken");
        res.status(200).json({ success: true, message: "Logged out successfully" });
    }
}