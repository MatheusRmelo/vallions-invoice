import { TableOfValue } from "types/tableOfValue";
import { Tag } from "types/tag";

export type RuleType = {
    tag: Tag | undefined,
    type: string,
    value: string,
    tableOfValues: TableOfValue | undefined,
}