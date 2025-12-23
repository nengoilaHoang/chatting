import messageController from "../controllers/message.controller.js";
import express from "express";

export default class messageRoute {
    constructor() {
        this.router = express.Router();
        this.messageController = new messageController();
        this.configureRoutes();
    }
    configureRoutes() {
        this.router.post("/send", this.messageController.sendMessage);
    }
}