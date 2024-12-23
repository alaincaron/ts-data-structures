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

export interface Container {
  size(): number;

  /**
   * Returns the capacity of this {@link Container}, i.e. the maximum
   * number of elements it can contain.
   *
   * @returns The capacity of this {@link Container}
   */
  capacity(): number;

  /**
   * Returns `true` if this {@link Container} is empty, i.e., its size is `0`.
   * @returns `true` if this {@link Container} is empty, `false` otherwise.
   */
  isEmpty(): boolean;

  /**
   * Returns `true` if this {@link Container} is full, i.e. its size is greater than or equal to is capacity.*
   * @returns `true` if this {@link Container} is full, false otherwise.
   */
  isFull(): boolean;

  /**
   * Returns the number of elements that can be added to this
   * {@link Container} without exceeding its `capacity`.
   *
   * @returns the number of elements that can be added to this {@link Container} without exceeding its `capacity`.
   */
  remaining(): number;

  toJSON(): string;
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

  abstract toJSON(): string;
}

export interface ContainerInitializer<ContainerLike extends object> {
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

type NumberProvider = number | (() => number);
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
