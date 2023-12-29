import { Collection, CollectionLike } from '../collections';
import { CapacityMixin, ContainerOptions, hashIterableUnordered, OverflowException } from '../utils';

export interface Count {
  count: number;
}

export type MultiSetLike<E> = CollectionLike<E> | MultiSet<E>;

export interface MultiSetInitializer<E> {
  initial?: MultiSetLike<E>;
}

export abstract class MultiSet<E> extends Collection<E> {
  constructor(options?: number | ContainerOptions) {
    super(options);
  }

  abstract count(item: E): number;

  addCount(item: E, count: number): number {
    if (this.remaining() < count) throw new OverflowException();
    return this.offerCount(item, count);
  }

  abstract offerCount(item: E, count: number): number;
  abstract removeCount(item: E, count: number): number;

  abstract setCount(item: E, count: number): number;

  add(item: E) {
    return this.addCount(item, 1) >= 1;
  }

  offer(item: E) {
    return this.offerCount(item, 1) > 0;
  }

  removeItem(item: E): boolean {
    return this.removeCount(item, 1) > 0;
  }

  abstract entries(): IterableIterator<[E, number]>;

  hashCode() {
    return hashIterableUnordered(this.entries());
  }

  equals(other: unknown) {
    if (this === other) return true;
    if (!(other instanceof MultiSet)) return false;
    if (this.size() != other.size()) return false;
    for (const [e, count] of this.entries()) {
      if (other.count(e) !== count) return false;
    }
    return true;
  }
}

export const BoundedMultiSet = CapacityMixin(MultiSet);

export function buildMultiSet<
  E,
  MS extends MultiSet<E>,
  Options extends ContainerOptions = ContainerOptions,
  Initializer extends MultiSetInitializer<E> = MultiSetInitializer<E>,
>(factory: new (...args: any[]) => MS, initializer?: number | (Options & Initializer)): MS {
  if (initializer == null || typeof initializer === 'number') return new factory(initializer);
  const initialElements = initializer.initial;

  let options: any = undefined;
  if (initialElements && 'buildOptions' in initialElements && typeof initialElements.buildOptions === 'function') {
    options = { ...(initialElements.buildOptions() as ContainerOptions), ...initializer };
  } else {
    options = { ...initializer };
  }

  delete options.initial;
  const result = new factory(options);
  if (initialElements instanceof MultiSet) {
    for (const [e, count] of initialElements.entries()) {
      result.setCount(e, count);
    }
  } else if (initialElements) {
    result.offerFully(initialElements);
  }

  return result;
}
