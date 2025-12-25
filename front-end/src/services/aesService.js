import CryptoJS from 'crypto-js';

const aesService = {
    encrypt: (text) => {
        try {
            const key = localStorage.getItem('aesKey');
            if (!text || !key) return null;
            // 1. Parse Key từ Hex sang WordArray (Giống Buffer.from bên Node)
            const keyParsed = CryptoJS.enc.Hex.parse(key);
            // 2. Mã hóa AES-256-ECB
            const encrypted = CryptoJS.AES.encrypt(text, keyParsed, {
                mode: CryptoJS.mode.ECB, // Khớp với BE
                padding: CryptoJS.pad.Pkcs7 // Node.js mặc định dùng padding này
            });
            // 3. Chuyển kết quả sang Hex (BE đang trả về Hex)
            // Lưu ý: Phải lấy ciphertext rồi mới toString Hex
            return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
        } catch (error) {
            console.error("Lỗi mã hóa FE:", error);
            return null;
        }
    },
    decrypt: (encryptedHex) => {
        try {
            const key = localStorage.getItem('aesKey');
            if (!encryptedHex || !key) return null;
            const keyParsed = CryptoJS.enc.Hex.parse(key);
            // 1. Vì BE gửi Hex, FE phải parse Hex trước khi giải mã
            const encryptedWA = CryptoJS.enc.Hex.parse(encryptedHex);
            // 2. Tạo params object cho CryptoJS
            const cipherParams = CryptoJS.lib.CipherParams.create({
                ciphertext: encryptedWA
            });
            // 3. Giải mã
            const decrypted = CryptoJS.AES.decrypt(cipherParams, keyParsed, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            // 4. Chuyển về text
            return decrypted.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            console.error("Lỗi giải mã FE:", error);
            return null;
        }
    }
};

export default aesService;