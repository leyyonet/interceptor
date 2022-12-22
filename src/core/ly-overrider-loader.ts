import {leyyo, Loader, LyCoreLoader} from "@leyyo/core";
import {LY_INT_FQN, LY_INT_PACKAGE} from "../internal";
import {lyOverrider} from "./ly-overrider";
import {Overridable, Overrider} from "../decorators";


@Loader(LyCoreLoader, lyOverrider.constructor, Overrider, Overridable)
export class LyOverriderLoader {
    constructor() {
        leyyo.package.add(LY_INT_PACKAGE);
    }
}
leyyo.fqn.clazz(LyOverriderLoader, ...LY_INT_FQN);
leyyo.instance.add(LyOverriderLoader, new LyOverriderLoader());