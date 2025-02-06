import axios, { AxiosError, AxiosInstance } from 'axios';
import { APIResponse } from '../types/apiresponse';

function useAPI() {
    const token = '741|ptmfZDOhuOCKmPZvyg5sVUUj8mfLAwH1gC5UOg36';
    const client: AxiosInstance = axios.create({
        baseURL: 'https://dev.apolo.vallions.com.br:8484', withCredentials: true,
    });

    const get = async (path: string): Promise<APIResponse> => {
        try {
            var result = await client.get(path, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            return {
                message: result.data.message,
                ok: true,
                result: result.data
            };
        } catch (err: any) {
            return {
                message: err?.response?.data?.message ?? err.toString(),
                ok: false,
                result: null
            };
        }
    };

    const post = async (path: string, data: any): Promise<APIResponse> => {
        try {
            var result = await client.post(path, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return {
                message: result.data.message,
                ok: true,
                result: result.data
            };
        } catch (err: any) {
            return {
                message: err?.response?.data?.message ?? err.toString(),
                ok: false,
                result: null
            };
        }
    };

    const put = async (path: string, data: any): Promise<APIResponse> => {
        try {
            var result = await client.put(path, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return {
                message: result.data.message,
                ok: true,
                result: result.data
            };
        } catch (err: any) {
            return {
                message: err?.response?.data?.message ?? err.toString(),
                ok: false,
                result: null
            };
        }
    };

    const del = async (path: string): Promise<APIResponse> => {
        try {
            var result = await client.delete(path, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return {
                message: result.data.message,
                ok: true,
                result: result.data
            };
        } catch (err: any) {
            return {
                message: err?.response?.data?.message ?? err.toString(),
                ok: false,
                result: null
            };
        }
    };

    return {
        get,
        post,
        put,
        del,
    };
}

export default useAPI;
