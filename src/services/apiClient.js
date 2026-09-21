import axios from 'axios';

export class ApiError extends Error {
    constructor(message, status, data, cause) {
        super(message, { cause });

        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!configuredApiBaseUrl) {
    throw new Error('VITE_API_BASE_URL is not configured.');
}

const apiBaseUrl = configuredApiBaseUrl.replace(/\/$/, '');
const apiClient = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true,
    headers: {
        Accept: 'application/json',
    },
});

export async function apiRequest(path, options = {}) {
    const { body, headers, ...requestOptions } = options;

    try {
        const response = await apiClient.request({
            ...requestOptions,
            url: path,
            data: body,
            headers: {
                ...(body ? { 'Content-Type': 'application/json' } : {}),
                ...headers,
            },
        });

        if (response.status === 204) {
            return null;
        }

        return response.data;
    } catch (error) {
        const axiosError = axios.isAxiosError(error) ? error : null;
        const errorBody = axiosError?.response?.data;
        const errorMessage = errorBody?.title ?? errorBody?.detail ?? errorBody?.message ??
            (error instanceof Error ? error.message : 'Request failed.');

        throw new ApiError(errorMessage, axiosError?.response?.status, errorBody, error);
    }
}
