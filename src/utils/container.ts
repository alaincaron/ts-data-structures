import { ParameterTail } from 'ts-fluent-iterators';

/**
 * Options for building Container objects (`IMap` or `Collection`).
 */
export interface ContainerOptions {
  /**
   * The maximum number of elements that the Container may contain.
   */
  capacity?: number;
}

/**
 * A Container is a fundamental interface that represents any data structure that can hold elements.
 * It provides basic operations to query the state of the container such as its size, capacity,
 * and whether it is empty or full.
 *
 * This interface is implemented by both Collections and Maps in the library.
 */
export interface Container {
  /**
   * Returns the number of elements in this container.
   * @returns The current number of elements in the container
   */
  size(): number;

  /**
   * Returns the capacity of this container, i.e. the maximum
   * number of elements it can contain.
   *
   * @returns The capacity of this container
   */
  capacity(): number;

  /**
   * Returns `true` if this container is empty, i.e., its size is `0`.
   * @returns `true` if this container is empty, `false` otherwise.
   */
  isEmpty(): boolean;

  /**
   * Returns `true` if this container is full, i.e. its size is greater than or equal to its capacity.
   * @returns `true` if this container is full, false otherwise.
   */
  isFull(): boolean;

  /**
   * Returns the number of elements that can be added to this
   * container without exceeding its `capacity`.
   *
   * @returns The number of additional elements that can be added
   */
  remaining(): number;
}

/**
 * A `Container` is an object that can contain objects.
 */
export abstract class AbstractContainer implements Container {
  /**
   * Returns the number of items in this {@link Container}.
   * @returns the number of items in this {@link Container}.
   */
  abstract size(): number;

  /**
   * Returns the capacity of this {@link Container}, i.e. the maximum
   * number of elements it can contain.
   *
   * @returns The capacity of this {@link Container}
   */
  capacity(): number {
    return Infinity;
  }

  /**
   * Returns `true` if this {@link Container} is empty, i.e., its size is `0`.
   * @returns `true` if this {@link Container} is empty, `false` otherwise.
   */
  isEmpty(): boolean {
    return this.size() === 0;
  }

  /**
   * Returns `true` if this {@link Container} is full, i.e. its size is greater than or equal to is capacity.*
   * @returns `true` if this {@link Container} is full, false otherwise.
   */
  isFull(): boolean {
    return this.size() >= this.capacity();
  }

  /**
   * Returns the number of elements that can be added to this
   * {@link Container} without exceeding its `capacity`.
   *
   * @returns the number of elements that can be added to this {@link Container} without exceeding its `capacity`.
   */
  remaining(): number {
    return this.capacity() - this.size();
  }
}

/**
 * Interface for initializing a container with initial elements.
 * This is used by container factory methods to create new instances
 * with predefined content.
 */
export interface ContainerInitializer<ContainerLike extends object> {
  /**
   * Optional initial elements to populate the container with.
   * Can be an array, another container, or any object implementing
   * the ContainerLike interface.
   */
  initial?: ContainerLike;
}

export type AddCapacity<T extends unknown[]> = T extends []
  ? [number | ContainerOptions]
  : [T[0] & ContainerOptions, ...ParameterTail<T>];

export type WithCapacity<Type extends object> = ContainerOptions & Type;

export function extractOptions<
  ContainerType extends object,
  Options extends object = object,
  Initializer extends ContainerInitializer<ContainerType> = ContainerInitializer<ContainerType>,
>(initializer?: WithCapacity<Options & Initializer>) {
  if (!initializer?.initial) {
    return { options: initializer as Options };
  } else {
    const initialElements = initializer.initial;
    const options = { ...buildOptions(initialElements), ...initializer };
    delete options.initial;
    if ('capacity' in options && !Number.isFinite(options.capacity)) delete options.capacity;
    return { options, initialElements };
  }
}

export function buildOptions(obj?: object) {
  if (obj && 'buildOptions' in obj && typeof obj.buildOptions === 'function') {
    return obj.buildOptions();
  }
  return {};
}

/**
 * Type alias for values that can provide a number, either directly or via a function
 */
export type NumberProvider = number | (() => number);

/**
 * Interface for objects that can provide a numeric length or size.
 * This is used to abstract over different ways of getting an object's size,
 * such as arrays (length) and collections (size).
 */
export type LengthProvider = { length: NumberProvider } | { size: NumberProvider };

export function getSize(items: LengthProvider) {
  if ('size' in items) {
    return typeof items.size === 'function' ? items.size() : items.size;
  }
  if ('length' in items) {
    return typeof items.length === 'function' ? items.length() : items.length;
  }
  throw new Error('Unable to extract number of items');
}
