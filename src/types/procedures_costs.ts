export type ProcedureCost = {
    id: number;
    validatyStart: string | null;
    validatyEnd: string | null;
    codProcedure: string;
    descriptionProcedure: string | null;
    valueProcedure: number;
};

export function parseProcedureCost(data: any): ProcedureCost {
    return {
        id: data.id,
        validatyStart: data.initial_effective_date,
        validatyEnd: data.final_effective_date,
        codProcedure: data.billing_procedures_fk,
        descriptionProcedure: data.billing_procedure?.name,
        valueProcedure: data.price
    };
}

export function parseProcedureCosts(data: any): ProcedureCost[] {
    return data.map(parseProcedureCost);
}

export function getProcedureCostsMock(): ProcedureCost[] {
    return [
        {
            id: 1,
            validatyStart: '01/01/2021',
            validatyEnd: '31/12/2021',
            codProcedure: '123456',
            descriptionProcedure: 'Procedure 1',
            valueProcedure: 100
        },
        {
            id: 2,
            validatyStart: '01/01/2021',
            validatyEnd: '31/12/2021',
            codProcedure: '123457',
            descriptionProcedure: 'Procedure 2',
            valueProcedure: 200
        }
    ];
}
