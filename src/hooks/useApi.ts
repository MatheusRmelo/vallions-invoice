import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

type UseApiReturn<T> = {
    data: T | null;
    error: string | null;
};

export type UseApiparams<T> = {
    url: string;
    method: 'get' | 'post' | 'put' | 'delete';
    requestData?: any;
    options?: AxiosRequestConfig;
    parser?: (data: any) => T;
};

export function useApi<T>({ url, method, requestData, options, parser }: UseApiparams<T>): UseApiReturn<T> {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(
        async (method: 'get' | 'post' | 'put' | 'delete', requestData?: any) => {
            setError(null);
            const controller = new AbortController();
            try {
                const response: AxiosResponse<any> = await axios({
                    url,
                    method,
                    data: requestData,
                    ...options,
                    signal: controller.signal
                });
                const parsedData = parser ? parser(response.data) : response.data;
                setData(parsedData);
            } catch (err) {
                if (axios.isCancel(err)) {
                    console.log('Request canceled', err.message);
                } else {
                    setError(err instanceof Error ? err.message : 'An unknown error occurred');
                }
            } finally {
            }
            return () => {
                controller.abort();
            };
        },
        [url, options, parser]
    );

    const get = useCallback(() => fetchData('get'), [fetchData]);
    const post = useCallback((data: any) => fetchData('post', data), [fetchData]);
    const put = useCallback((data: any) => fetchData('put', data), [fetchData]);
    const del = useCallback(() => fetchData('delete'), [fetchData]);

    useEffect(() => {
        if (method === 'post') {
            post(requestData);
        } else if (method === 'put') {
            put(requestData);
        } else if (method === 'delete') {
            del();
        } else {
            get();
        }
    }, [method, post, put, del, get, requestData]);

    return { data, error };
}
