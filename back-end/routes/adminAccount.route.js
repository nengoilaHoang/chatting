import adminAccountController from "../controllers/adminAccount.controller.js";
import express from "express";

export default class adminAccountRoute {
    constructor() {
        this.router = express.Router();
        this.adminAccountController = new adminAccountController();
        this.configureRoutes();
    }
    configureRoutes() {
        this.router.post("/login", this.adminAccountController.loginAdmin);
    }
}