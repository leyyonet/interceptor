import {FuncLike} from "@leyyo/core";

export interface OverriderItem {
    overrider: FuncLike;
    overridable: FuncLike;
    overridden: Array<string>;
    append: Array<string>;
}

export type OverriderAfterLambda<T extends string | symbol = string> = (map: Record<T, unknown>) => void;

export interface OverriderPlugin {
    $overriderAfter?: OverriderAfterLambda;
}