import crypto from 'crypto';
import {aesKeyMgr} from '../ultil/manageAESkey.js';
const ALGORITHM = 'aes-256-ecb'; 
const KEY_LENGTH = 32; 

const aesService = {
    /**
     * Tạo khóa Random
     */
    generateKey: () => {
        return crypto.randomBytes(KEY_LENGTH).toString('hex');
    },

    /**
     * MÃ HÓA
     */
    encrypt: (text, keyHex) => {
        try {
            // 1. KIỂM TRA ĐẦU VÀO (Quan trọng)
            if (!text) {
                console.error("❌ Lỗi mã hóa: 'text' bị thiếu (undefined/null/empty)");
                return null;
            }
            if (!keyHex) {
                console.error("❌ Lỗi mã hóa: 'keyHex' bị thiếu (undefined/null)");
                return null;
            }

            // 2. Xử lý
            console.log("🔑 Sử dụng AES Key Hex:", aesKeyMgr.getAesKey(keyHex));
            const key = Buffer.from(aesKeyMgr.getAesKey(keyHex), 'hex'); // Lỗi thường xảy ra ở dòng này nếu keyHex undefined
            const cipher = crypto.createCipheriv(ALGORITHM, key, null);
            let encrypted = cipher.update(String(text), 'utf8', 'hex'); // Ép kiểu String(text) cho an toàn
            encrypted += cipher.final('hex');
            
            return encrypted;
        } catch (error) {
            console.error("🔥 Exception mã hóa:", error.message);
            return null;
        }
    },

    /**
     * GIẢI MÃ
     */
    decrypt: (encryptedText, keyHex) => {
        try {
            // 1. KIỂM TRA ĐẦU VÀO
            if (!encryptedText) {
                console.error("❌ Lỗi giải mã: 'encryptedText' bị thiếu");
                return null;
            }
            if (!keyHex) {
                console.error("❌ Lỗi giải mã: 'keyHex' bị thiếu");
                return null;
            }

            // 2. Xử lý
            const key = Buffer.from(aesKeyMgr.getAesKey(keyHex), 'hex');
            const decipher = crypto.createDecipheriv(ALGORITHM, key, null);

            let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            
            return decrypted;
        } catch (error) {
            console.error("🔥 Exception giải mã:", error.message);
            return null;
        }
    }
};

export default aesService;