import adminAccountService from "../services/adminAccount.service.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default class adminAccountController {
    constructor() {
        this.adminAccountService = new adminAccountService();
    }
    loginAdmin = async (req, res) => {
        const { email, password } = req.body;
        try {
            const adminAccount = await this.adminAccountService.loginAdmin(email, password);
            const accessToken = jwt.sign({id: adminAccount.id, email: adminAccount.email}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
            res.cookie('accessToken', accessToken, {
                httpOnly: true,  // chống XSS
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict', // Chống CSRF
                maxAge: 24 * 60 * 60 * 1000// 1 day
            });
            res.status(200).json({ success: true, adminAccount: adminAccount });
        }catch (error) {
            res.status(401).json({ success: false, message: error.message });
        }
    }
}