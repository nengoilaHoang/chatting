import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import adminAccountDao from "../daos/adminAccount.dao";

export default async function isAdmin(req, res, next) {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }
    const account = req.body;
    const verifiedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
    if (verifiedToken && verifiedToken.id === account.id) {
        const adminAccountDaoInstance = new adminAccountDao();
        const adminAccount = await adminAccountDaoInstance.getAdminByEmail(verifiedToken.email);
        if (adminAccount) {
            next();
        } else {
            res.status(403).json({ success: false, message: "Forbidden: Admins only" });
        }
    } else {
        res.status(401).json({ success: false, message: "Unauthorized" });
    }
}