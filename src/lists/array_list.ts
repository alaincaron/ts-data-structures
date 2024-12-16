import { Comparator } from 'ts-fluent-iterators';
import { BaseArrayList } from './base_array_list';
import { ListIterator } from './list_interface';
import { buildCollection, CollectionInitializer } from '../collections';
import { equalsIterable, WithCapacity } from '../utils';

export class ArrayList<E> extends BaseArrayList<E> {
  constructor() {
    super([]);
  }

  clone(): ArrayList<E> {
    return ArrayList.create({ initial: this });
  }

  static create<E>(initializer?: WithCapacity<CollectionInitializer<E>>): ArrayList<E> {
    return buildCollection<E, ArrayList<E>>(ArrayList, initializer);
  }
}

export interface AdapterArrayListOptions<E> {
  delegate?: Array<E>;
}

export class AdapterArrayList<E> extends BaseArrayList<E> {
  constructor(options?: AdapterArrayListOptions<E>) {
    super(options?.delegate ?? []);
  }

  delegate() {
    return this.elements;
  }

  clone(): AdapterArrayList<E> {
    return AdapterArrayList.create({ initial: this });
  }

  static create<E>(
    initializer?: WithCapacity<AdapterArrayListOptions<E> | CollectionInitializer<E>>
  ): AdapterArrayList<E> {
    return buildCollection<E, AdapterArrayList<E>>(AdapterArrayList, initializer);
  }
}

declare global {
  // eslint-disable-next-line
  interface Array<T> {
    asList(): AdapterArrayList<T>;
    listIterator(skip?: number, count?: number): ListIterator<T>;
    reverseListIterator(skip?: number, count?: number): ListIterator<T>;
    equals(other: unknown): boolean;
    isOrdered(): boolean;
    isOrdered<T>(arg2: number | Comparator<T> | undefined): boolean;
    isOrdered<T>(left: number, arg3: number | Comparator<T> | undefined): boolean;
    isOrdered<T>(left: number, right: number, random: Comparator<T> | undefined): boolean;
    isOrdered<T>(arg2?: number | Comparator<T>, arg3?: number | Comparator<T>, arg4?: Comparator<T>): boolean;
    isStrictlyOrdered(): boolean;
    isStrictlyOrdered<T>(arg2: number | Comparator<T> | undefined): boolean;
    isStrictlyOrdered<T>(left: number, arg3: number | Comparator<T> | undefined): boolean;
    isStrictlyOrdered<T>(left: number, right: number, random: Comparator<T> | undefined): boolean;
    isStrictlyOrdered<T>(arg2?: number | Comparator<T>, arg3?: number | Comparator<T>, arg4?: Comparator<T>): boolean;
  }
}

Array.prototype.asList = function () {
  return AdapterArrayList.create({ delegate: this });
};

Array.prototype.equals = function (other: unknown) {
  if (this === other) return true;
  if (other instanceof Array) return equalsIterable(this, other);
  return false;
};

Array.prototype.listIterator = function (skip?: number, count?: number) {
  return this.asList().listIterator(skip, count);
};

Array.prototype.reverseListIterator = function (skip?: number, count?: number) {
  return this.asList().reverseListIterator(skip, count);
};

Array.prototype.isOrdered = function <T>(
  arg2?: number | Comparator<T>,
  arg3?: number | Comparator<T>,
  arg4?: Comparator<T>
) {
  return this.asList().isOrdered(arg2 as number, arg3 as number, arg4 as Comparator<T>);
};

Array.prototype.isStrictlyOrdered = function <T>(
  arg2?: number | Comparator<T>,
  arg3?: number | Comparator<T>,
  arg4?: Comparator<T>
) {
  return this.asList().isStrictlyOrdered(arg2 as number, arg3 as number, arg4 as Comparator<T>);
};
