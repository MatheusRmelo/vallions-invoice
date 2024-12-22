// models/Procedimento.ts
export type Procedure = {
    id: number;
    name: string;
    institutions_fk: string;
    code: string;
    billing_procedures_fk: string;
    institution_fk: string;
    status: boolean;
    modalities: string[] | undefined;
};

export const parseProcedure = (data: any): Procedure => {
    return {
        id: data.id,
        name: data.name,
        code: data.code,
        institutions_fk: data.institutions_fk,
        billing_procedures_fk: data.billing_procedures_fk,
        institution_fk: data.institution_fk,
        status: data.status == null ? false : data.status === '0' ? false : true,
        modalities: undefined
    };
};
