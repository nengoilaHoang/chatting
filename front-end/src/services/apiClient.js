import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const callApi = async ({ url, method = 'GET', data, params, headers }) => {
    try {
        const response = await apiClient.request({
            url,
            method,
            data,
            params,
            headers,
        });

        const payload = response?.data ?? {};
        if (payload?.success === false) {
            throw new Error(payload?.message ?? 'Yêu cầu thất bại. Vui lòng thử lại.');
        }
        return payload;
    } catch (error) {
        const message = error?.response?.data?.message ?? error.message ?? 'Không thể kết nối đến máy chủ.';
        throw new Error(message);
    }
};
