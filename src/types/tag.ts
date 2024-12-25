export type Tag = {
    id: number;
    name: string;
    institution_fk: string;
    status: boolean;
    created_at: string;
    updated_at: string;
};

export function parseTag(data: any): Tag {
    return {
        id: data.id,
        name: data.name,
        institution_fk: data.institution_fk,
        status: data.status,
        created_at: data.created_at,
        updated_at: data.updated_at
    };
}

export function parseTagList(data: any): Tag[] {
    return data.map(parseTag);
}
