export type Modality = {
    id: string;
    name: string;
};

export const parseModality = (data: any): Modality => {
    return {
        id: data.id,
        name: data.name
    };
};

export function getMockModalities(): Modality[] {
    return [
        {
            id: '1',
            name: 'CT'
        },
        {
            id: '2',
            name: 'CR'
        },
        {
            id: '3',
            name: 'DO'
        },
    ];
}
