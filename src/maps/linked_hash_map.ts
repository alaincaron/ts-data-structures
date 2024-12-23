import { buildMap } from './abstract_map';
import { AccessType, HashEntry, HashMap, HashMapOptions } from './hash_map';
import { MapInitializer, MutableMapEntry } from './mutable_map';
import { DoubleLinkedList, OverflowException, WithCapacity } from '../utils';

export enum Ordering {
  INSERTION = 1,
  MODIFICATION,
  ACCESS,
}

export enum OverflowStrategy {
  REMOVE_LEAST_RECENT = 1,
  REMOVE_MOST_RECENT,
  DISCARD,
  THROW,
}

export interface LinkedHashMapOptions extends HashMapOptions {
  ordering?: Ordering;
  overflowStrategy?: OverflowStrategy;
}

export class LinkedHashMap<K, V> extends HashMap<K, V> {
  private readonly ordering: Ordering;
  private readonly overflowStrategy: OverflowStrategy;
  private readonly linkedList: DoubleLinkedList<HashEntry<K, V>>;

  constructor(options?: LinkedHashMapOptions) {
    super(options);
    this.ordering = options?.ordering ?? Ordering.INSERTION;
    this.overflowStrategy = options?.overflowStrategy ?? OverflowStrategy.THROW;
    this.linkedList = new DoubleLinkedList();
  }

  static create<K, V>(initializer?: WithCapacity<LinkedHashMapOptions & MapInitializer<K, V>>): LinkedHashMap<K, V> {
    return buildMap<K, V, LinkedHashMap<K, V>, LinkedHashMapOptions>(LinkedHashMap, initializer);
  }

  protected recordAccess(e: HashEntry<K, V>, accessType: AccessType) {
    switch (accessType) {
      case AccessType.INSERT:
        this.linkedList.addLast(e);
        break;
      case AccessType.MODIFY:
        if (this.ordering === Ordering.ACCESS || this.ordering === Ordering.MODIFICATION) {
          this.linkedList.remove(e);
          this.linkedList.addLast(e);
        }
        break;
      case AccessType.GET:
        if (this.ordering === Ordering.ACCESS) {
          this.linkedList.remove(e);
          this.linkedList.addLast(e);
        }
        break;
      case AccessType.REMOVE:
        this.linkedList.remove(e);
        break;
      default:
        throw new Error(`Unexpected access type: ${accessType}`);
    }
  }

  mostRecent() {
    return this.linkedList.last() as unknown as MutableMapEntry<K, V>;
  }

  leastRecent() {
    return this.linkedList.first() as unknown as MutableMapEntry<K, V>;
  }

  protected override overflowHandler(_key: K, _value: V): boolean {
    switch (this.overflowStrategy) {
      case OverflowStrategy.REMOVE_LEAST_RECENT:
        this.removeLeastRecent();
        return false;
      case OverflowStrategy.REMOVE_MOST_RECENT:
        this.removeMostRecent();
        return false;
      case OverflowStrategy.DISCARD:
        return true;
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

  clear(): LinkedHashMap<K, V> {
    super.clear();
    this.linkedList.clear();
    return this;
  }

  protected *entryGenerator() {
    for (const e of this.linkedList.entries()) yield e as unknown as MutableMapEntry<K, V>;
  }

  buildOptions() {
    return {
      ...super.buildOptions(),
      ordering: this.ordering,
      overflowStrategy: this.overflowStrategy,
    };
  }

  clone(): LinkedHashMap<K, V> {
    return LinkedHashMap.create({ initial: this });
  }
}
