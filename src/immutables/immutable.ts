import { Comparator, Comparators } from 'ts-fluent-iterators';
import { EmptyList } from './emptyList';
import { EmptyMultiSet } from './emptyMultiSet';
import { EmptySet } from './emptySet';
import { ImmutableCollection } from './immutableCollection';
import { ImmutableList } from './immutableList';
import { ImmutableMultiSet } from './immutableMultiSet';
import { ImmutableNavigableSet } from './immutableNavigableSet';
import { ImmutableSet } from './immutableSet';
import { ImmutableSortedMultiSet } from './immutableSortedMultiSet';
import { ImmutableSortedSet } from './immutableSortedSet';
import { SingletonList } from './singletonList';
import { SingletonMultiSet } from './singletonMultiSet';
import { SingletonSet } from './singletonSet';
import { Collection, CollectionLike, isCollection } from '../collections';
import { collectionIsReadOnly } from '../collections/helpers';
import { AdapterArrayList, List } from '../lists';
import { isReadOnlyList } from '../lists/helpers';
import {
  ArrayMultiSet,
  AvlTreeMultiSet,
  isReadOnlyMultiSet,
  LinkedHashMultiSet,
  MultiSet,
  MutableMultiSet,
} from '../multisets';
import { SortedMultiSet } from '../multisets';
import { ArraySet, AvlTreeSet, ISet, isReadonlySet, LinkedHashSet, NavigableSet, SortedSet } from '../sets';

const THRESHOLD = 25;

export class Immutable {
  private constructor() {}

  static emptyList<E>(): List<E> {
    return EmptyList.instance();
  }

  static singletonList<E>(item: E): List<E> {
    return new SingletonList(item);
  }

  static asReadOnlyCollection<E>(items: Collection<E>): Collection<E> {
    if (collectionIsReadOnly(items)) return items;
    return new ImmutableCollection<E>(items);
  }

  static listOf<E>(...items: E[]): List<E> {
    return Immutable.createListFromArray(items, null);
  }

  static sortedListOf<E>(comparator: Comparator<E>, ...items: E[]): List<E> {
    return Immutable.createListFromArray(items, comparator);
  }

  private static createListFromArray<E>(items: E[], comparator: Comparator<E> | null): List<E> {
    switch (items.length) {
      case 0:
        return Immutable.emptyList();
      case 1:
        return Immutable.singletonList(items[0]);
      default: {
        const delegate = AdapterArrayList.create({ initial: items });
        if (comparator) delegate.sort(comparator);
        return new ImmutableList(delegate);
      }
    }
  }

  static toList<E>(items: CollectionLike<E>): List<E> {
    return this.createListFromCollection(items, null);
  }

  static toSortedList<E>(items: CollectionLike<E>, comparator: Comparator<E> = Comparators.natural): List<E> {
    return Immutable.createListFromCollection(items, comparator);
  }

  private static createListFromCollection<E>(items: CollectionLike<E>, comparator: Comparator<E> | null): List<E> {
    if (!comparator && isReadOnlyList<E>(items)) return items;
    const len = Array.isArray(items) ? items.length : isCollection(items) ? items.size() : -1;
    switch (len) {
      case 0:
        return Immutable.emptyList();
      case 1:
        return Immutable.singletonList<E>((items as Iterable<E>)[Symbol.iterator]().next().value);
      default: {
        const delegate = new AdapterArrayList<E>();
        delegate.addFully(items);
        if (comparator) delegate.sort(comparator);
        return new ImmutableList(delegate);
      }
    }
  }

  static asReadOnlyList<E>(items: List<E> | E[]): List<E> {
    if (isReadOnlyList<E>(items)) return items;
    if (Array.isArray(items)) return Immutable.createListFromArray(items, null);
    return new ImmutableList(items);
  }

  static emptySet<E>(): NavigableSet<E> {
    return EmptySet.instance();
  }

  static singletonSet<E>(item: E): SortedSet<E> {
    return new SingletonSet(item);
  }

  static setOf<E>(...items: E[]): ISet<E> {
    switch (items.length) {
      case 0:
        return Immutable.emptySet();
      case 1:
        return Immutable.singletonSet<E>(items[0]);
      default: {
        const delegate = LinkedHashSet.create({ initial: items });
        return Immutable.asReadOnlySet(delegate.size() > THRESHOLD ? delegate : ArraySet.create({ initial: delegate }));
      }
    }
  }

  static sortedSetOf<E>(comparator: Comparator<E>, ...items: E[]): SortedSet<E> {
    switch (items.length) {
      case 0:
        return Immutable.emptySet();
      case 1:
        return Immutable.singletonSet<E>(items[0]);
      default: {
        return new ImmutableSortedSet(AvlTreeSet.create({ comparator, initial: items }));
      }
    }
  }

  static navigableSetOf<E>(comparator: Comparator<E>, ...items: E[]): NavigableSet<E> {
    switch (items.length) {
      case 0:
        return Immutable.emptySet();
      default: {
        return new ImmutableNavigableSet(AvlTreeSet.create({ comparator, initial: items }));
      }
    }
  }

  static toSet<E>(items: CollectionLike<E>): ISet<E> {
    if (isReadonlySet<E>(items)) return items;
    const delegate: ISet<E> = LinkedHashSet.create({ initial: items });
    switch (delegate.size()) {
      case 0:
        return Immutable.emptySet();
      case 1:
        return Immutable.singletonSet(delegate.iterator().first()!);
      default:
        return new ImmutableSet(delegate.size() > THRESHOLD ? delegate : ArraySet.create({ initial: delegate }));
    }
  }

  static toSortedSet<E>(items: CollectionLike<E>, comparator: Comparator<E> = Comparators.natural): SortedSet<E> {
    if (isReadonlySet<E>(items) && 'first' in items) return items as SortedSet<E>;
    const delegate = AvlTreeSet.create({ comparator, initial: items });
    switch (delegate.size()) {
      case 0:
        return Immutable.emptySet();
      case 1:
        return Immutable.singletonSet(delegate.first()!);
      default:
        return new ImmutableSortedSet(delegate);
    }
  }

  static toNavigableSet<E>(items: CollectionLike<E>, comparator: Comparator<E> = Comparators.natural): NavigableSet<E> {
    if (isReadonlySet<E>(items) && 'floor' in items) return items as NavigableSet<E>;
    const delegate = AvlTreeSet.create({ comparator, initial: items });
    switch (delegate.size()) {
      case 0:
        return Immutable.emptySet();
      default:
        return new ImmutableNavigableSet(delegate);
    }
  }

  static asReadOnlySet<E>(items: ISet<E>): ISet<E> {
    if (collectionIsReadOnly(items)) return items;
    return new ImmutableSet<E>(items);
  }

  static asReadOnlySortedSet<E>(items: SortedSet<E>): SortedSet<E> {
    if (collectionIsReadOnly(items)) return items;
    return new ImmutableSortedSet(items);
  }

  static asReadOnlyNavigableSet<E>(items: NavigableSet<E>): NavigableSet<E> {
    if (collectionIsReadOnly(items)) return items;
    return new ImmutableNavigableSet(items);
  }

  static emptyMultiSet<E>(): SortedMultiSet<E> {
    return EmptyMultiSet.instance();
  }

  static singletonMultiSet<E>(item: E): SortedMultiSet<E> {
    return new SingletonMultiSet(item);
  }

  static multiSetOf<E>(...items: E[]): MultiSet<E> {
    const delegate = LinkedHashMultiSet.create({ initial: items });
    switch (delegate.size()) {
      case 0:
        return Immutable.emptyMultiSet();
      case 1:
        return Immutable.singletonMultiSet(delegate.keyIterator().first()!);
      default:
        return new ImmutableMultiSet(
          delegate.size() > THRESHOLD ? delegate : ArrayMultiSet.create({ initial: delegate })
        );
    }
  }

  static sortedMultiSetOf<E>(comparator: Comparator<E>, ...items: E[]): SortedMultiSet<E> {
    const delegate = AvlTreeMultiSet.create({ comparator, initial: items });
    switch (delegate.size()) {
      case 0:
        return Immutable.emptyMultiSet();
      case 1:
        return Immutable.singletonMultiSet(delegate.keyIterator().first()!);
      default:
        return new ImmutableSortedMultiSet<E>(delegate);
    }
  }

  static toMultiSet<E>(items: CollectionLike<E>): MultiSet<E> {
    if (isReadOnlyMultiSet<E>(items)) return items;
    const delegate = LinkedHashMultiSet.create({ initial: items });
    switch (delegate.size()) {
      case 0:
        return Immutable.emptyMultiSet();
      case 1:
        return Immutable.singletonMultiSet(delegate.iterator().first()!);
      default:
        return new ImmutableMultiSet(
          delegate.size() > THRESHOLD ? delegate : ArrayMultiSet.create({ initial: delegate })
        );
    }
  }

  static toSortedMultiSet<E>(
    items: CollectionLike<E>,
    comparator: Comparator<E> = Comparators.natural
  ): SortedMultiSet<E> {
    if (isReadOnlyMultiSet<E>(items) && 'first' in items) return items as SortedMultiSet<E>;
    const delegate = AvlTreeMultiSet.create({ comparator, initial: items });
    switch (delegate.size()) {
      case 0:
        return Immutable.emptyMultiSet();
      case 1:
        return Immutable.singletonMultiSet(delegate.first()!);
      default:
        return new ImmutableSortedMultiSet(delegate);
    }
  }

  static asReadOnlyMultiSet<E>(items: MutableMultiSet<E>): MultiSet<E> {
    if (isReadOnlyMultiSet<E>(items)) return items;
    return new ImmutableMultiSet(items);
  }
}
