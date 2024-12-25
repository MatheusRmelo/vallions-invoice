import { TableOfValue } from 'types/tableOfValue';
import { Tag } from 'types/tag';

export type RuleType = {
    id: number | undefined;
    tag: Tag | undefined;
    type: string;
    value: string;
    tableOfValues: TableOfValue | undefined;
};

export type RuleAdittion = {
    id: number | undefined;
    levelPriority: string;
    tableOfValues: TableOfValue | undefined;
    type: string;
    value: string;
};
