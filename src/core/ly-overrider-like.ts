import {FuncLike} from "@leyyo/core";
import {OverriderItem} from "./index.type";

export interface $LyOverriderInternal {
    $setOverrider(fn: FuncLike): void;
    $setOverridable(fn: FuncLike): void;
}
export interface LyOverriderLike {
    get items(): Array<OverriderItem>;
    get ly(): $LyOverriderInternal & LyOverriderLike;

}