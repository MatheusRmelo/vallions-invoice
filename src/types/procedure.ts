import { GridFilterInputBooleanProps } from "@mui/x-data-grid";

// models/Procedimento.ts
export type Procedure = {
    id: number;
    description: string;
    codeCbhpm: string;

    institute: string[];
    modality: string[];
    status: boolean;
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

export function getMockProcedures(): Procedure[] {
    return [
        {
            id: 1,
            description: 'Procedimento 1',
            codeCbhpm: '123456',
            institute: ['Instituição 1'],
            modality: ['CT'],
            status: true
        },
        {
            id: 2,
            description: 'Procedimento 2',
            codeCbhpm: '123457',
            institute: ['Instituição 2'],
            modality: ['CT', 'CR'],
            status: false
        },
        {
            id: 3,
            description: 'Procedimento 3',
            codeCbhpm: '123458',
            institute: ['Instituição 3'],
            modality: ['DO'],
            status: true
        },
        {
            id: 4,
            description: 'Procedimento 4',
            codeCbhpm: '123459',
            institute: ['Instituição 4'],
            modality: ['CT'],
            status: true
        },
        {
            id: 5,
            description: 'Procedimento 5',
            codeCbhpm: '123460',
            institute: ['Instituição 5'],
            modality: ['CT', 'CR', 'DO'],
            status: true
        }
    ];
}
