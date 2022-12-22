import {DeveloperException, FuncLike, leyyo} from "@leyyo/core";
import {OverriderItem} from "./index.type";
import {LY_INT_FQN} from "../internal";
import {$LyOverriderInternal, LyOverriderLike} from "./ly-overrider-like";

class LyOverrider implements LyOverriderLike, $LyOverriderInternal {

    protected LOG = leyyo.logger.assign(LyOverrider);
    protected _items: Array<OverriderItem>;
    protected _overrider: FuncLike;
    protected _overridable: FuncLike;

    constructor() {
        leyyo.fqn.clazz(LyOverrider, ...LY_INT_FQN);
        this._items = leyyo.storage.newArray(this, '_items');
        leyyo.lifecycle.starting.on('overrider', async () => await this._start(), leyyo.fqn.get(this._start));
    }
    protected async _start(): Promise<void> {
        if (!this._overrider) {
            throw new DeveloperException('overrider:decorator.not.sent', {decorator: 'overridable'}).with(this);
        }
        if (!this._overridable) {
            throw new DeveloperException('overrider:decorator.not.sent', {decorator: 'overridable'}).with(this);
        }
        const sourceDeco = leyyo.decorator.get(this._overrider);
        const targetDeco = leyyo.decorator.get(this._overridable);
        leyyo.reflector.classesBy(sourceDeco).forEach(sourceRef => {
            const sourceValue = sourceRef.getValue(sourceDeco) as {overridable: FuncLike};
            if (typeof sourceValue?.overridable !== 'function') {
                throw new DeveloperException('overrider:empty.overridable', {overrider: sourceRef.name}).with(this);
            }
            const targetRef = leyyo.reflector.getClass(sourceValue.overridable, false);
            if (!targetRef) {
                throw new DeveloperException('overrider:absent.overridable', {overrider: sourceRef.name, overridable: leyyo.fqn.get(sourceValue.overridable)}).with(this);
            }
            if (!targetRef.hasDecorator(targetDeco)) {
                throw new DeveloperException('overrider:overridable.not.overridable', {overrider: sourceRef.name, overridable: targetRef.name}).with(this);
            }
            const targetIns = leyyo.instance.get(targetRef.classFn);
            if (!targetIns) {
                throw new DeveloperException('overrider:absent.overridable.value', {overrider: sourceRef.name, overridable: targetRef.name}).with(this);
            }
            const item = {
                overrider: sourceRef.classFn,
                overridable: targetRef.classFn,
                overridden: [],
                append: [],
            } as OverriderItem;
            let targetValue = targetRef.getValue(targetDeco) as {properties: Array<string>};
            if (!targetValue || !targetValue.properties || !leyyo.scalar.isArray(targetValue.properties)) {
                targetValue = {properties: []};
            }
            sourceRef.listInstanceProperties({scope: 'owned'}).forEach(sourceProp => {
                const field = sourceProp.name;
                const targetProp = targetRef.getInstanceProperty(field);
                if (!targetProp) {
                    item.append.push(field);
                }
                else if (!targetValue.properties.includes(field)) {
                    throw new DeveloperException('overrider:forbidden.overridable.property', {overrider: sourceRef.name, overridable: targetRef.name, field}).with(this);
                } else {
                    item.overridden.push(field);
                    // todo
                }
            });
            if (item.overridden.length === 0) {
                this.LOG.warn('overrider:no.overridden.properties', {overrider: sourceRef.name, overridable: targetRef.name});
            } else {
                this._items.push(item);
            }
        });
    }
    get items(): Array<OverriderItem> {
        return this._items;
    }
    get ly(): $LyOverriderInternal & LyOverriderLike {
        return this;
    }
    $setOverrider(fn: FuncLike): void {
        if (this._overrider) {
            throw new DeveloperException('overrider:decorator.already.set', {decorator: 'overrider', prev: leyyo.fqn.get(this._overridable), next: leyyo.fqn.get(fn)}).with(this);
        }
        this._overrider = fn;
    }
    $setOverridable(fn: FuncLike): void {
        if (this._overridable) {
            throw new DeveloperException('overrider:decorator.already.set', {decorator: 'overridable', prev: leyyo.fqn.get(this._overridable), next: leyyo.fqn.get(fn)}).with(this);
        }
        this._overridable = fn;
    }
}
export const lyOverrider: LyOverriderLike = new LyOverrider();
leyyo.instance.add(LyOverrider, lyOverrider);
