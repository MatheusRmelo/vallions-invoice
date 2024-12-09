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
