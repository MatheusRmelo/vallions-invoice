export type Unity = {
    name: string;
    cd_unidade?: string;
    cd_cliente?: string;
    cd_instituicao?: string;
};

export function parseUnity(data: any): Unity {
    return {
        name: data.nome_unidade,
        cd_unidade: data.cd_unidade,
        cd_cliente: data.cd_cliente,
        cd_instituicao: data.cd_instituicao
    };
}

export function parseUnityList(data: any[]): Unity[] {
    return data.map(parseUnity);
}

export function generateMockUnity(): Unity {
    return {
        name: 'Unity'
    };
}
