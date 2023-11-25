import { HashMap, HashEntry, HashMapOptions, AccessType } from './hash_map';
import { MapEntry } from './map';
import { OverflowException, DoubleLinkedList } from '../utils';
import { buildMap } from './abstract_map';
import { MapInitializer } from './types';

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

export class LinkedHashMap<K = any, V = any> extends HashMap<K, V> {
  private readonly ordering: Ordering;
  private readonly overflowStrategy: OverflowStrategy;
  private readonly linkedList: DoubleLinkedList;

  constructor(options?: number | LinkedHashMapOptions) {
    super(options);
    this.ordering = (options as any)?.ordering ?? Ordering.INSERTION;
    this.overflowStrategy = (options as any)?.overflowStrategy ?? OverflowStrategy.THROW;
    this.linkedList = new DoubleLinkedList();
  }

  static create<K, V>(initializer?: number | (LinkedHashMapOptions & MapInitializer<K, V>)): LinkedHashMap<K, V> {
    return buildMap<K, V, LinkedHashMap<K, V>, LinkedHashMapOptions>(LinkedHashMap, initializer);
  }

  protected recordAccess(e: HashEntry<K, V>, accessType: AccessType) {
    const ee = e as unknown as DoubleLinkedList.Entry;

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
    return this.linkedList.last() as unknown as MapEntry<K, V>;
  }

  leastRecent() {
    return this.linkedList.first() as unknown as MapEntry<K, V>;
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

  clear() {
    super.clear();
    this.linkedList.clear();
  }

  protected *entryGenerator() {
    for (const e of this.linkedList.entries()) yield e as unknown as MapEntry<K, V>;
  }

  buildOptions(): LinkedHashMapOptions {
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
