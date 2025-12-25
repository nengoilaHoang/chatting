import messageController from "../controllers/message.controller.js";
import express from "express";
import authenticate from "../middlewares/authenticate.js";

export default class messageRoute {
    constructor() {
        this.router = express.Router();
        this.messageController = new messageController();
        this.configureRoutes();
    }
    configureRoutes() {
        this.router.post("/send", authenticate,this.messageController.sendMessage);
        this.router.get("/:chatBoxId", authenticate,this.messageController.getMessages);
    }
}