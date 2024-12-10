export type Institute = {
    id: string;
    name: string;
};

export const parseInstitute = (data: any): Institute => {
    return {
        id: data.id,
        name: data.name
    };
};

export function getMockInstitutes(): Institute[] {
    return [
        {
            id: '1',
            name: 'Mock Institute 1'
        },
        {
            id: '2',
            name: 'Mock Institute 2'
        }
    ];
}
