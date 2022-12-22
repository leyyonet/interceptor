import {FuncLike, leyyo} from "@leyyo/core";
import {lyOverrider} from "../core";
import {LY_INT_FQN} from "../internal";

export function Overrider(overridable: FuncLike): ClassDecorator {
    return (clazz) => {
        const described = leyyo.reflector.described(_deco, clazz);
        overridable = leyyo.scalar.DEV(this, 'overridable', overridable, ['function'], {target: described.description});
        _deco.assign(described, overridable);
    }
}
leyyo.fqn.decorator(Overrider, ...LY_INT_FQN);
const _deco = leyyo.decorator.add(Overrider, {clazz: true});
lyOverrider.ly.$setOverrider(Overrider);