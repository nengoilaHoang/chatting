import express from 'express';
import accountController from '../controllers/account.controller.js';

export default class accountRoute {
    constructor(){
        this.router = express.Router();
        this.accountController = new accountController();
        this.configureRoutes();
    }
    configureRoutes() {
        this.router.post('/register', this.accountController.registerAccount);
        this.router.post('/login', this.accountController.loginAccount);
        this.router.post('/logout', this.accountController.logout);
        this.router.get('/search', this.accountController.searchAccounts);
    }
}