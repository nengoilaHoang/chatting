import adminAccountService from "../services/adminAccount.service";

export default class adminAccountController {
    constructor() {
        this.adminAccountService = new adminAccountService();
    }
    async loginAdmin(req, res) {
        const { email, password } = req.body;
        try {
            const adminAccount = await this.adminAccountService.loginAdmin(email, password);
            res.status(200).json({ success: true, adminAccount: adminAccount });
        }catch (error) {
            res.status(401).json({ success: false, message: error.message });
        }
    }
}