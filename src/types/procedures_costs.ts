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
