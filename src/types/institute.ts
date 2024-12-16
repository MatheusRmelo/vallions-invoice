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
            name: 'Instituição 1'
        },
        {
            id: '2',
            name: 'Instituição 2'
        },
        {
            id: '3',
            name: 'Instituição 3'
        },
        {
            id: '4',
            name: 'Instituição 4'
        },
        {
            id: '5',
            name: 'Instituição 5'
        }
    ];
}
