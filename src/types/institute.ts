export type Institute = {
    id_institution: string;
    name: string;
};

export const parseInstitute = (data: any): Institute => {
    return {
        id_institution: data.id_institution,
        name: data.institution
    };
};
