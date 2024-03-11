import { Predicate } from 'ts-fluent-iterators';
import { ISet } from './set';
import { getItemsToAdd } from './utils';
import { buildCollection, Collection, CollectionInitializer, CollectionLike } from '../collections';
import { ArrayList } from '../lists';
import { Constructor, ContainerOptions, OverflowException, WithCapacity } from '../utils';

export abstract class CollectionBasedSet<E> extends ISet<E> {
  private _delegate: Collection<E>;
  constructor(delegate: Collection<E>) {
    super();
    this._delegate = delegate;
  }

  protected delegate() {
    return this._delegate;
  }

  size(): number {
    return this._delegate.size();
  }

  capacity(): number {
    return this._delegate.capacity();
  }

  offer(item: E) {
    const d = this.delegate();
    if (d.contains(item)) return true;
    if (d.isFull()) return false;
    return d.add(item);
  }

  removeMatchingItem(predicate: Predicate<E>): E | undefined {
    return this._delegate.removeMatchingItem(predicate);
  }

  filter(predicate: Predicate<E>) {
    return this._delegate.filter(predicate);
  }

  clear(): void {
    this._delegate.clear();
  }

  [Symbol.iterator](): IterableIterator<E> {
    return this._delegate[Symbol.iterator]();
  }

  buildOptions() {
    return this._delegate.buildOptions();
  }

  add(item: E) {
    const d = this.delegate();
    if (d.contains(item)) return false;
    return d.add(item);
  }

  offerPartially<E1 extends E>(items: Iterable<E1>): number {
    const initial_size = this.size();
    super.offerPartially(items);
    return this.size() - initial_size;
  }

  offerFully<E1 extends E>(items: CollectionLike<E1>): number {
    const itemsToAdd = getItemsToAdd(this, items);
    if (this.remaining() < itemsToAdd.size) return 0;
    return this.offerPartially(itemsToAdd);
  }

  addFully<E1 extends E>(items: CollectionLike<E1>): number {
    const itemsToAdd = getItemsToAdd(this, items);
    if (this.remaining() < itemsToAdd.size) throw new OverflowException();
    return this.offerPartially(itemsToAdd);
  }

  abstract clone(): CollectionBasedSet<E>;

  protected static createSet<
    E,
    C extends Collection<E>,
    S extends CollectionBasedSet<E>,
    Options extends ContainerOptions = ContainerOptions,
    Initializer extends CollectionInitializer<E> = CollectionInitializer<E>,
  >(setFactory: Constructor<S>, colFactory: (options?: Options) => C, initializer?: Options & Initializer): S {
    let delegate: C;
    let initialElements;

    if (!initializer?.initial) {
      delegate = colFactory(initializer as Options);
      initialElements = undefined;
    } else {
      initialElements = initializer.initial;
      let options: any = {
        ...initializer,
      };

      if ('buildOptions' in initialElements && typeof initialElements.buildOptions === 'function') {
        options = { ...options, ...initialElements.buildOptions() };
      }
      delete options.initial;

      delegate = colFactory(options);
    }
    const result = new setFactory(delegate);
    if (initialElements) result.addFully(initialElements);
    return result;
  }

  protected cloneDelegate<C extends Collection<E>>(factory: Constructor<C>): C {
    return buildCollection<E, C>(factory, { initial: this.delegate() });
  }
}

export class ArraySet<E> extends CollectionBasedSet<E> {
  constructor(delegate?: ArrayList<E>) {
    super(delegate ?? new ArrayList<E>());
  }

  static create<E>(initializer?: WithCapacity<CollectionInitializer<E>>): ArraySet<E> {
    return CollectionBasedSet.createSet<E, ArrayList<E>, ArraySet<E>>(ArraySet, ArrayList.create, initializer);
  }

  clone(): ArraySet<E> {
    return new ArraySet(this.cloneDelegate<ArrayList<E>>(ArrayList));
  }
}
