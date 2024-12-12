import { TableOfValue } from 'types/tableOfValue';
import { Tag } from 'types/tag';

export type RuleType = {
    tag: Tag | undefined;
    type: string;
    value: string;
    tableOfValues: TableOfValue | undefined;
};

export type RuleAdittion = {
    levelPriority: string;
    tableOfValues: TableOfValue | undefined;
    type: string;
    value: string;
};
