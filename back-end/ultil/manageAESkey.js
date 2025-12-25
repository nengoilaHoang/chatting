import aesService from '../services/aesService.js';

class aesKey{
    constructor(userId) {
        this.userId = userId;
        this.aesKey = aesService.generateKey();
    }
}

class aesKeyManager {
    constructor() {
        this.aesKeys = new Map();
    }
    addAesKey(userId) {
        const key = new aesKey(userId);
        this.aesKeys.set(userId, key);
    }
    getAesKey(userId) {
        const key = this.aesKeys.get(userId);
        return key ? key.aesKey : null;
    }
    hasAesKey(userId) {
        return this.aesKeys.has(userId);
    }
    removeAesKey(userId) {
        this.aesKeys.delete(userId);
    }
    listAesKeys() {
        console.log(this.aesKeys);
    }
}

export const aesKeyMgr = new aesKeyManager();