import { BaseArrayList } from './base_array_list';
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

  toArray() {
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
