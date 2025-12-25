import crypto from 'crypto';
const ALGORITHM = 'aes-256-ecb'; 
const KEY_LENGTH = 32; 

const aesService = {
    /**
     * Tạo khóa Random (32 bytes = 256 bits)
     */
    generateKey: () => {
        return crypto.randomBytes(KEY_LENGTH).toString('hex');
    },

    /**
     * MÃ HÓA
     */
    encrypt: (text, keyHex) => {
        try {
            const key = Buffer.from(keyHex, 'hex');
            const cipher = crypto.createCipheriv(ALGORITHM, key, null);
            let encrypted = cipher.update(text, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            return encrypted;
        } catch (error) {
            console.error("Lỗi mã hóa:", error.message);
            return null;
        }
    },

    /**
     * GIẢI MÃ
     */
    decrypt: (encryptedText, keyHex) => {
        try {
            const key = Buffer.from(keyHex, 'hex');

            // Tham số thứ 3 để null
            const decipher = crypto.createDecipheriv(ALGORITHM, key, null);

            let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        } catch (error) {
            console.error("Lỗi giải mã:", error.message);
            return null;
        }
    }
};

export default aesService;