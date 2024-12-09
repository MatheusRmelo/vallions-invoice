// models/Procedimento.ts
export type Procedure = {
    id: number;
    descricao: string;
    codigoCbhpm: string;
    instituicao: string;
    modalidade: string;
    situacao: string;
};

export const parseProcedure = (data: any): Procedure => {
    return {
        id: data.id,
        descricao: data.descricao,
        codigoCbhpm: data.codigoCbhpm,
        instituicao: data.instituicao,
        modalidade: data.modalidade,
        situacao: data.situacao
    };
};
