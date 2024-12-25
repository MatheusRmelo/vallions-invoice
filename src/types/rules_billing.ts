export type RuleBilling = {
    id: number | null;
    rulesDescription: string;
    unity: string;
    unity_fk?: number;
    status: number;
};

export function parseRuleBilling(data: any): RuleBilling {
    return {
        id: data.id,
        rulesDescription: data.description,
        unity_fk: data.branch_fk,
        unity: data.name,
        status: Number(data.status)
    };
}

export function parseRuleBillingList(data: any): RuleBilling[] {
    return data.map(parseRuleBilling);
}

export function toJSONRuleBilling(data: RuleBilling): any {
    return {
        description: data.rulesDescription,
        branch_fk: data.unity,
        status: data.status
    };
}
