import { callApi } from './apiClient';

export const messageService = {
    getByChatBox(chatBoxId, params) {
        return callApi({
            url: `/api/messages/${chatBoxId}`,
            method: 'GET',
            params,
        });
    },
    sendMessage(payload) {
        return callApi({
            url: '/api/messages/send',
            method: 'POST',
            data: payload,
        });
    },
};

export default messageService;
