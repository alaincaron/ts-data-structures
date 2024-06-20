import { BaseArrayList } from './base_array_list';
import { List } from './list';
import { buildCollection, CollectionInitializer } from '../collections';
import { WithCapacity } from '../utils';

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
    equals(other: unknown): boolean;
  }
}

Array.prototype.asList = function () {
  return AdapterArrayList.create({ delegate: this });
};

Array.prototype.equals = function (other: unknown) {
  if (this === other) return true;
  if (other instanceof List) {
    return this.asList().equals(other);
  }
  if (other instanceof Array) {
    return this.asList().equals(other.asList());
  }
  return false;
};
