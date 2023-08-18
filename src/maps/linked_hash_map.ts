import { HashMap, HashEntry, HashMapOptions, AccessType } from './hash_map';
import { MapEntry } from './map';
import { DoubleLinkedList, Entry } from './double_linked_list';
import { OverflowException } from '../utils';
import { AbstractMap } from './abstract_map';
import { MapInitializer } from './types';

export enum Ordering {
  INSERTION = 1,
  MODIFICATION,
  ACCESS,
}

export enum OverflowStrategy {
  REMOVE_LEAST_RECENT = 1,
  REMOVE_MOST_RECENT,
  THROW,
}

export interface LinkedHashMapOptions<K, V> extends HashMapOptions<K, V> {
  ordering?: Ordering;
  overflowStrategy?: OverflowStrategy;
}

export class LinkedHashMap<K, V> extends HashMap<K, V> {
  private readonly ordering: Ordering;
  private readonly overflowStrategy: OverflowStrategy;
  private readonly linkedList: DoubleLinkedList;

  constructor(options?: number | LinkedHashMapOptions<K, V>) {
    super(options);
    this.ordering = (options as any)?.ordering ?? Ordering.INSERTION;
    this.overflowStrategy = (options as any)?.overflowStrategy ?? OverflowStrategy.THROW;
    this.linkedList = new DoubleLinkedList();
  }

  static from<K, V>(initializer: LinkedHashMapOptions<K, V> & MapInitializer<K, V>): LinkedHashMap<K, V> {
    return AbstractMap.buildMap<
      K,
      V,
      LinkedHashMapOptions<K, V> & MapInitializer<K, V>,
      LinkedHashMap<K, V>,
      LinkedHashMapOptions<K, V>
    >((options: LinkedHashMapOptions<K, V>) => new LinkedHashMap(options), initializer);
  }

  protected recordAccess(e: HashEntry<K, V>, accessType: AccessType) {
    const ee = e as unknown as Entry;

    switch (accessType) {
      case AccessType.INSERT:
        this.linkedList.addLast(ee);
        break;
      case AccessType.MODIFY:
        if (this.ordering === Ordering.ACCESS || this.ordering === Ordering.MODIFICATION) {
          this.linkedList.remove(ee);
          this.linkedList.addLast(ee);
        }
        break;
      case AccessType.GET:
        if (this.ordering === Ordering.ACCESS) {
          this.linkedList.remove(ee);
          this.linkedList.addLast(ee);
        }
        break;
      case AccessType.REMOVE:
        this.linkedList.remove(ee);
        break;
      default:
        throw new Error(`Unexpected access type: ${accessType}`);
    }
  }

  mostRecent() {
    return this.linkedList.mostRecent() as unknown as MapEntry<K, V>;
  }

  leastRecent() {
    return this.linkedList.leastRecent() as unknown as MapEntry<K, V>;
  }

  protected override overflowHandler(_key: K, _value: V) {
    switch (this.overflowStrategy) {
      case OverflowStrategy.REMOVE_LEAST_RECENT:
        this.removeLeastRecent();
        break;
      case OverflowStrategy.REMOVE_MOST_RECENT:
        this.removeMostRecent();
        break;
      default:
        throw new OverflowException();
    }
  }

  private removeMostRecent() {
    const e = this.mostRecent();
    if (!e) return undefined;
    return super.remove(e.key);
  }

  private removeLeastRecent() {
    const e = this.leastRecent();
    if (!e) return;
    return super.remove(e.key);
  }

  clear() {
    super.clear();
    this.linkedList.clear();
  }

  *entries(): IterableIterator<MapEntry<K, V>> {
    for (const e of this.linkedList.entries()) yield e as unknown as MapEntry<K, V>;
  }

  buildOptions(): LinkedHashMapOptions<K, V> {
    return {
      ...super.buildOptions(),
      ordering: this.ordering,
      overflowStrategy: this.overflowStrategy,
    };
  }

  clone(): LinkedHashMap<K, V> {
    return LinkedHashMap.from({ initial: this });
  }
}
