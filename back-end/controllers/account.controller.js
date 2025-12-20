import accountService from "../services/account.service.js";
import accountModel from "../models/account.model.js";

export default class accountController {
    constructor() {
        this.accountService = new accountService();
    }
    registerAccount = async (req, res) => {
        const {email, password, displayName} = req.body;
        const account = new accountModel({email, password, displayName});
        const result = await this.accountService.registerAccount(account);
        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
        } 
    }
    loginAccount = async (req, res) => {
        const { email, password } = req.body;
        const result = await this.accountService.loginAccount(email, password);
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    }
}