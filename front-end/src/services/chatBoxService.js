import { callApi } from './apiClient';

export const chatBoxService = {
    getAll(userId) {
        return callApi({
            url: '/api/chatboxes/all',
            method: 'GET',
            params: { userId },
        });
    },
    startDirectChat(senderId, receiverId) {
        return callApi({
            url: '/api/chatboxes/new-chat',
            method: 'POST',
            data: { senderId, receiverId },
        });
    },
};

export default chatBoxService;
