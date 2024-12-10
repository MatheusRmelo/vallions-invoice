export type CostsProcedures = {
    id: number;
    validatyStart: string;
    validatyEnd: string;
    codProcedure: string;
    descriptionProcedure: string;
    valueProcedure: number;
};

export function parseCostsProcedure(data: any): CostsProcedures {
    return {
        id: data.id,
        validatyStart: data.validatyStart,
        validatyEnd: data.validatyEnd,
        codProcedure: data.codProcedure,
        descriptionProcedure: data.descriptionProcedure,
        valueProcedure: data.valueProcedure
    };
}

export function parseCostsProcedures(data: any): CostsProcedures[] {
    return data.map(parseCostsProcedures);
}

export function getProcedureCostsMock(): CostsProcedures[] {
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
