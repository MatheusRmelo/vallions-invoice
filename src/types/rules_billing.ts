import { Unity, parseUnity } from './unity';

export type RuleBilling = {
    id: number | null;
    rulesDescription: string;
    unity: Unity;
    unity_fk?: number;
    status: number;
};

export function parseRuleBilling(data: any): RuleBilling {
    return {
        id: data.id,
        rulesDescription: data.description,
        unity_fk: data.branch_fk,
        unity: parseUnity(data.name),
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
