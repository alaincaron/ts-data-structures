import { emptyCollection } from './empty';
import { ImmutableCollection } from './immutableCollection';
import { ImmutableList } from './immutableList';
import { ImmutableMultiSet } from './immutableMultiSet';
import { ImmutableSet } from './immutableSet';
import { SingletonCollection } from './singleton';
import { Collection, CollectionLike, isCollection } from '../collections';
import { collectionIsReadOnly } from '../collections/helpers';
import { AdapterArrayList, List } from '../lists';
import { isReadOnlyList } from '../lists/helpers';
import { isReadOnlyMultiSet, LinkedHashMultiSet, MultiSet, MutableMultiSet } from '../multisets';
import { ArraySet, ISet, isReadonlySet, LinkedHashSet } from '../sets';

export class Immutable {
  private constructor() {}

  static emptyCollection<E>(): Collection<E> {
    return emptyCollection();
  }

  static emptyList<E>(): List<E> {
    return emptyCollection();
  }

  static singletonCollection<E>(item: E): Collection<E> {
    return new SingletonCollection(item);
  }

  static singletonList<E>(item: E): List<E> {
    return new SingletonCollection(item);
  }

  static asReadOnlyCollection<E>(items: Collection<E>): Collection<E> {
    if (collectionIsReadOnly(items)) return items;
    if (items.isEmpty()) return Immutable.emptyCollection();
    if (items.size() === 1) return Immutable.singletonCollection(items[Symbol.iterator]().next().value);
    return new ImmutableCollection<E>(items);
  }

  static listOf<E>(...items: E[]): List<E> {
    switch (items.length) {
      case 0:
        return Immutable.emptyList();
      case 1:
        return Immutable.singletonList(items[0]);
      default:
        return new ImmutableList(AdapterArrayList.create({ initial: items }));
    }
  }

  static toList<E>(items: CollectionLike<E>): List<E> {
    if (isReadOnlyList<E>(items)) return items;
    const len = Array.isArray(items) ? items.length : isCollection(items) ? items.size() : -1;
    switch (len) {
      case 0:
        return Immutable.emptyList();
      case 1:
        return Immutable.singletonList<E>((items as Iterable<E>)[Symbol.iterator]().next().value);
      default: {
        const delegate = new AdapterArrayList<E>();
        delegate.addFully(items);
        return new ImmutableList(delegate);
      }
    }
  }

  static asReadOnlyList<E>(items: List<E> | E[]): List<E> {
    if (isReadOnlyList<E>(items)) return items;
    if (Array.isArray(items)) return new ImmutableList(new AdapterArrayList({ delegate: items }));
    return new ImmutableList<E>(items);
  }

  static emptySet<E>(): ISet<E> {
    return emptyCollection();
  }

  static singletonSet<E>(item: E): ISet<E> {
    return new SingletonCollection(item);
  }

  static setOf<E>(...items: E[]) {
    switch (items.length) {
      case 0:
        return Immutable.emptySet();
      case 1:
        return Immutable.singletonSet<E>(items[0]);
      default: {
        const delegate = LinkedHashSet.create({ initial: items });
        return Immutable.asReadOnlySet(delegate.size() >= 10 ? delegate : ArraySet.create({ initial: delegate }));
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
        return new ImmutableSet(delegate.size() >= 10 ? delegate : ArraySet.create({ initial: delegate }));
    }
  }

  static asReadOnlySet<E>(items: ISet<E>): ISet<E> {
    if (collectionIsReadOnly(items)) return items;
    return new ImmutableSet<E>(items);
  }

  static emptyMultiSet<E>(): MultiSet<E> {
    return emptyCollection();
  }

  static singletonMultiSet<E>(item: E): MultiSet<E> {
    return new SingletonCollection(item);
  }

  static multiSetOf<E>(...items: E[]): MultiSet<E> {
    const delegate = LinkedHashMultiSet.create({ initial: items });
    return new ImmutableMultiSet(delegate);
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
        return new ImmutableMultiSet(delegate);
    }
  }

  static asReadOnlyMultiSet<E>(items: MutableMultiSet<E>): MultiSet<E> {
    if (isReadOnlyMultiSet<E>(items)) return items;
    return new ImmutableMultiSet<E>(items);
  }
}
