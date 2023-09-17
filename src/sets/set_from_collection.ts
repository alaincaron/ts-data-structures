import {
  DecoratorCollection,
  Collection,
  CollectionLike,
  buildCollection,
  CollectionInitializer,
} from '../collections';
import { OverflowException, ContainerOptions } from '../utils';
import { ISet } from './set';
import { ArrayList } from '../lists';
import { getItemsToAdd } from './utils';

export class SetFromCollection<E = any> extends DecoratorCollection<E> implements ISet<E> {
  constructor(delegate: Collection<E>) {
    super(delegate);
  }

  // TODO try to get these in a Mixin... hwoever generics and mixin don't always work together
  toSet() {
    return this.iterator().collectToSet();
  }

  offer(item: E) {
    const d = this.delegate();
    if (d.contains(item)) return true;
    if (d.isFull()) return false;
    return d.add(item);
  }

  // TODO mixin
  add(item: E) {
    const d = this.delegate();
    if (d.contains(item)) return false;
    return d.add(item);
  }

  // TODO mixin
  offerPartially<E1 extends E>(items: Iterable<E1>): number {
    const initial_size = this.size();
    super.offerPartially(items);
    return this.size() - initial_size;
  }

  // TODO mixin
  offerFully<E1 extends E>(items: CollectionLike<E1>): number {
    const itemsToAdd = getItemsToAdd(this, items);
    if (this.remaining() < itemsToAdd.size) return 0;
    return this.offerPartially(itemsToAdd);
  }

  // TODO mixin
  addFully<E1 extends E>(items: CollectionLike<E1>): number {
    const itemsToAdd = getItemsToAdd(this, items);
    if (this.remaining() < itemsToAdd.size) throw new OverflowException();
    return this.addPartially(itemsToAdd);
  }

  clone(): SetFromCollection<E> {
    return new SetFromCollection(this.delegate().clone());
  }
}

export class ArraySet<E = any> extends SetFromCollection<E> {
  constructor(options?: number | ContainerOptions) {
    super(new ArrayList<E>(options));
  }

  static create<E>(initializer?: number | (ContainerOptions & CollectionInitializer<E>)): ArraySet<E> {
    return buildCollection<E, ArraySet<E>>(ArraySet, initializer);
  }

  clone(): ArraySet<E> {
    return ArraySet.create({ initial: this.delegate() });
  }
}
