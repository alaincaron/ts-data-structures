import { Constructor, FluentIterator } from 'ts-fluent-iterators';
import { MultiSet, MultiSetEntry } from './multiset';
import { MutableMultiSet } from './mutable_multiset';
import { AbstractCollection, CollectionLike, isCollection } from '../collections';
import { Immutable, ImmutableMultiSet } from '../immutables';
import {
  CapacityMixin,
  ContainerOptions,
  extractOptions,
  hashIterableUnordered,
  Objects,
  OverflowException,
  WithCapacity,
} from '../utils';

export interface MultiSetInitializer<E> {
  initial?: CollectionLike<E>;
}

export abstract class AbstractMultiSet<E> extends AbstractCollection<E> implements MutableMultiSet<E> {
  abstract count(item: E): number;

  abstract clear(): AbstractMultiSet<E>;

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

  abstract entries(): IterableIterator<MultiSetEntry<E>>;

  asReadOnly(): MultiSet<E> {
    return Immutable.asReadOnlyMultiSet(this);
  }

  toReadOnly() {
    return Immutable.toMultiSet(this);
  }

  hashCode() {
    return hashIterableUnordered(this.entries());
  }

  equals(other: unknown) {
    if (this === other) return true;
    if (!isMultiSet<E>(other)) return false;
    if (this.size() != other.size()) return false;
    for (const { key, count } of this.entries()) {
      if (other.count(key) !== count) return false;
    }
    return true;
  }

  abstract clone(): AbstractMultiSet<E>;

  abstract entryIterator(): FluentIterator<MultiSetEntry<E>>;

  abstract keyIterator(): FluentIterator<E>;

  abstract keys(): IterableIterator<E>;

  abstract nbKeys(): number;
}

export function isMultiSet<E>(obj: unknown): obj is MultiSet<E> {
  if (!isCollection(obj)) return false;
  if (obj instanceof AbstractMultiSet || obj instanceof ImmutableMultiSet) return true;
  if (!Objects.hasFunction(obj, 'count')) return false;
  return true;
}

export function isWritableMultiSet<E>(obj: unknown): obj is MutableMultiSet<E> {
  return isMultiSet(obj) && Objects.hasFunction(obj, 'offerCount');
}

export function isReadOnlyMultiSet<E>(obj: unknown): obj is MultiSet<E> {
  return isMultiSet(obj) && !Objects.hasFunction(obj, 'offerCount');
}

export function buildMultiSet<
  E,
  MS extends MutableMultiSet<E>,
  Options extends object = object,
  Initializer extends MultiSetInitializer<E> = MultiSetInitializer<E>,
>(factory: Constructor<MS>, initializer?: WithCapacity<Options & Initializer>): MS {
  const { options, initialElements } = extractOptions<CollectionLike<E>>(initializer);
  const result = boundMultiSet(factory, options);
  if (isMultiSet<E>(initialElements)) {
    for (const { key, count } of initialElements.entries()) {
      result.setCount(key, count);
    }
  } else if (initialElements) {
    result.addFully(initialElements);
  }

  return result;
}

function boundMultiSet<E, MS extends MutableMultiSet<E>>(ctor: Constructor<MS>, options?: ContainerOptions) {
  if (options && 'capacity' in options && Number.isFinite(options.capacity)) {
    const boundedCtor: any = CapacityMixin(ctor);
    const tmp = new boundedCtor(options);
    return tmp as unknown as MS;
  }
  return new ctor(options);
}
