import { callApi } from './apiClient';

export const accountService = {
    searchAccounts(keyword, excludeAccountId) {
        return callApi({
            url: '/api/accounts/search',
            method: 'GET',
            params: {
                keyword,
                excludeAccountId,
            },
        });
    },
};

export default accountService;
