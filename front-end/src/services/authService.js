import { callApi } from './apiClient';

export const authService = {
    login(credentials) {
        return callApi({
            url: '/api/accounts/login',
            method: 'POST',
            data: credentials,
        });
    },
    register(payload) {
        return callApi({
            url: '/api/accounts/register',
            method: 'POST',
            data: payload,
        });
    },
    logout() {
        return callApi({
            url: '/api/accounts/logout',
            method: 'POST',
        });
    },
    adminLogin(credentials) {
        return callApi({
            url: '/api/admins/login',
            method: 'POST',
            data: credentials,
        });
    },
};

export default authService;
