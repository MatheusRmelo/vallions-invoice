import axios, { AxiosInstance } from 'axios';
import { APIResponse } from '../types/apiresponse';

function useAPI() {
    const client: AxiosInstance = axios.create({
        baseURL: 'http://localhost:8000/api'
    });

    const get = async (path: string): Promise<APIResponse> => {
        try {
            var result = await client.get(path);
            return {
                message: result.data.message,
                ok: true,
                result: result.data.result
            };
        } catch (err: any) {
            return {
                message: err.toString(),
                ok: false,
                result: null
            };
        }
    };

    const post = async (path: string, data: any): Promise<APIResponse> => {
        try {
            var result = await client.post(path, data);
            return {
                message: result.data.message,
                ok: true,
                result: result.data.result
            };
        } catch (err: any) {
            return {
                message: err.toString(),
                ok: false,
                result: null
            };
        }
    };

    const put = async (path: string, data: any): Promise<APIResponse> => {
        try {
            var result = await client.put(path, data);
            return {
                message: result.data.message,
                ok: true,
                result: result.data.result
            };
        } catch (err: any) {
            return {
                message: err.toString(),
                ok: false,
                result: null
            };
        }
    };

    const del = async (path: string): Promise<APIResponse> => {
        try {
            var result = await client.delete(path);
            return {
                message: result.data.message,
                ok: true,
                result: result.data.result
            };
        } catch (err: any) {
            return {
                message: err.toString(),
                ok: false,
                result: null
            };
        }
    };

    return {
        get,
        post,
        put,
        del
    };
}

export default useAPI;
