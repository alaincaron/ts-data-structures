import { ParameterTail } from './constructor';

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
 * A `Container` is an object that can contain objects.
 */
export abstract class Container {
  /**
   * Returns the number of items in this {@link Container}.
   * @returns the number of items in this {@link Container}.
   */
  abstract size(): number;

  /**
   * Returns the capacity of this {@link Container}, i.e. the maximum
   * number of elements it can contains.
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

export interface ContainerInitializer<ContainerLike extends object> {
  initial?: ContainerLike;
}

export type AddCapacity<T extends unknown[]> = T extends []
  ? [number | ContainerOptions]
  : [T[0] & ContainerOptions, ...ParameterTail<T>];

export type WithCapacity<Type extends object> = ContainerOptions & Type;
