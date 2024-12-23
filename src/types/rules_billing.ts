export type RuleBilling = {
    id: number | null;
    rulesDescription: string;
    institution: string;
    unity: string;
    status: string;
};

export function parseRuleBilling(data: any): RuleBilling {
    return {
        id: data.id,
        rulesDescription: data.rulesDescription,
        institution: data.institution,
        unity: data.unity,
        status: data.status
    };
}

export function parseRuleBillingList(data: any): RuleBilling[] {
    return data.map(parseRuleBilling);
}

export function toJSONRuleBilling(data: RuleBilling): any {
    return {
        description: data.rulesDescription,
        institution_fk: data.institution,
        branch_fk: data.unity,
        status: data.status
    };
}

export function generateMockRuleBilling(): RuleBilling[] {
    return [
        {
            id: 1,
            rulesDescription: 'Regra 1',
            institution: 'Instituição 1',
            unity: 'Unidade 1',
            status: '1'
        },
        {
            id: 2,
            rulesDescription: 'Regra 2',
            institution: 'Instituição 2',
            unity: 'Unidade 2',
            status: '0'
        },
        {
            id: 3,
            rulesDescription: 'Regra 3',
            institution: 'Instituição 3',
            unity: 'Unidade 3',
            status: '1'
        },
        {
            id: 4,
            rulesDescription: 'Regra 4',
            institution: 'Instituição 4',
            unity: 'Unidade 4',
            status: '0'
        },
        {
            id: 5,
            rulesDescription: 'Regra 5',
            institution: 'Instituição 5',
            unity: 'Unidade 5',
            status: '1'
        }
    ];
}
