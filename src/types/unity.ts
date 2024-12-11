export type Unity = {
    id: number;
    name: string;
};

export function parseUnity(data: any): Unity {
    return {
        id: data.id,
        name: data.name
    };
}

export function parseUnityList(data: any[]): Unity[] {
    return data.map(parseUnity);
}

export function generateMockUnity(): Unity {
    return {
        id: 1,
        name: 'Unity'
    };
}
