import { Collection, CollectionLike } from '../collections';
import {
  CapacityMixin,
  Constructor,
  ContainerOptions,
  extractOptions,
  hashIterableUnordered,
  OverflowException,
  WithCapacity,
} from '../utils';

export type MultiSetLike<E> = CollectionLike<E> | MultiSet<E>;

export interface MultiSetInitializer<E> {
  initial?: MultiSetLike<E>;
}

export abstract class MultiSet<E> extends Collection<E> {
  abstract count(item: E): number;
  abstract clear(): MultiSet<E>;

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

  abstract clone(): MultiSet<E>;
}

export function buildMultiSet<
  E,
  MS extends MultiSet<E>,
  Options extends object = object,
  Initializer extends MultiSetInitializer<E> = MultiSetInitializer<E>,
>(factory: Constructor<MS>, initializer?: WithCapacity<Options & Initializer>): MS {
  const { options, initialElements } = extractOptions<MultiSetLike<E>>(initializer);
  const result = boundMultiSet(factory, options);
  if (initialElements instanceof MultiSet) {
    for (const [e, count] of initialElements.entries()) {
      result.setCount(e, count);
    }
  } else if (initialElements) {
    result.addFully(initialElements);
  }

  return result;
}

function boundMultiSet<E, MS extends MultiSet<E>>(ctor: Constructor<MS>, options?: ContainerOptions) {
  if (options && 'capacity' in options) {
    const boundedCtor: any = CapacityMixin(ctor);
    const tmp = new boundedCtor(options);
    return tmp as unknown as MS;
  }
  return new ctor(options);
}
