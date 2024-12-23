export type TableOfValue = {
    id: number;
    description: string;
    institution_fk: string;
    // validityStart: string;
    // validityEnd: string;
    // codeProcedure: string;
    // value: number | null;
    status: boolean;
    nickname: string | null;
};

export function parseTableOfValue(data: any): TableOfValue {
    return {
        id: data.id,
        description: data.description,
        institution_fk: data.institution_fk,
        status: data.status == null ? false : data.status == "0" ? false : true,
        nickname: data.nickname,
    };
}

export function parseTableOfValues(data: any): TableOfValue[] {
    return data.map(parseTableOfValue);
}

