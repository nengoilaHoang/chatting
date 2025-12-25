import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function authenticate(req, res, next) {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }
    const account = req.body;
    const verifiedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
    if (verifiedToken && verifiedToken.id === account.id) {
        req.locals.userId = verifiedToken.id;
        next();
    } else {
        res.status(401).json({ success: false, message: "Unauthorized" });
    }
}