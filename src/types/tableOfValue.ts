export type TableOfValue = {
    id: number;
    description: string;
    institute: string[];
    // validityStart: string;
    // validityEnd: string;
    // codeProcedure: string;
    // value: number | null;
    status: number;
};

export function parseTableOfValue(data: any): TableOfValue {
    return {
        id: data.id,
        description: data.description,
        institute: data.institute,
        // active: data.active,
        // validityStart: data.validityStart,
        // validityEnd: data.validityEnd,
        // codeProcedure: data.codeProcedure,
        // value: data.value,
        status: data.status
    };
}

export function parseTableOfValues(data: any): TableOfValue[] {
    return data.map(parseTableOfValue);
}
