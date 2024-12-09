// models/Procedimento.ts
export type Procedure = {
    id: number;
    description: string;
    codeCbhpm: string;

    institute: string[];
    modality: string;
    status: string;
};

export const parseProcedure = (data: any): Procedure => {
    return {
        id: data.id,
        description: data.description,
        codeCbhpm: data.codeCbhpm,
        institute: data.institute,
        modality: data.modality,
        status: data.status
    };
};
