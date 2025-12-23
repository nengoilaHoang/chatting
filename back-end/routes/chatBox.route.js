import chatBoxController from "../controllers/chatBox.controller.js";
import express from "express";

export default class chatBoxRoute {
    constructor() {
        this.router = express.Router();
        this.chatBoxController = new chatBoxController();
        this.configureRoutes();
    }
    configureRoutes() {
        this.router.post("/new-chat", this.chatBoxController.chatNewAccount);
        this.router.post("/create-group", this.chatBoxController.createGroupChat);
        this.router.get("/all", this.chatBoxController.getAllChatBox);
    }
}