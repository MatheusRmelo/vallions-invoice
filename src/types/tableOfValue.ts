import { Institute, parseInstitute, getMockInstitutes } from './institute';

export type TableOfValue = {
    id: number;
    description: string;
    institute: Institute;
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
        institute: parseInstitute(data.institute),
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
export function getMockTableOfValues(): TableOfValue[] {
    return [
        {
            id: 1,
            description: 'Mock Description 1',
            institute: getMockInstitutes()[0],
            status: 1
        },
        {
            id: 2,
            description: 'Mock Description 2',
            institute: getMockInstitutes()[1],
            status: 2
        }
    ];
}
