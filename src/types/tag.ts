export type Tag = {
    id: number;
    name: string;
};

export function parseTag(data: any): Tag {
    return {
        id: data.id,
        name: data.name
    };
}

export function parseTagList(data: any): Tag[] {
    return data.map(parseTag);
}

export function generateMockTag(): Tag[] {
    return [
        {
            id: 1,
            name: 'Tag 1'
        },
        {
            id: 2,
            name: 'Tag 2'
        },
        {
            id: 3,
            name: 'Tag 3'
        },
        {
            id: 4,
            name: 'Tag 4'
        },
        {
            id: 5,
            name: 'Tag 5'
        }
    ];
}
