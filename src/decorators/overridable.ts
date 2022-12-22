import {leyyo} from "@leyyo/core";
import {lyOverrider} from "../core";
import {LY_INT_FQN} from "../internal";

export function Overridable(): any {
    return (clazz, property: string, descriptor) => {
        const described = leyyo.reflector.described(_deco, clazz, property, descriptor);
        _deco.assign(described);
    }
}
leyyo.fqn.decorator(Overridable, ...LY_INT_FQN);
const _deco = leyyo.decorator.add(Overridable, {field: true, method: true});
lyOverrider.ly.$setOverridable(Overridable);