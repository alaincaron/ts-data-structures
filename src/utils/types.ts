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
export interface Container {
  /**
   * The number of items in the `Container`
   */
  size(): number;

  /**
   * The maximum number of items the `Container` may contain.
   */
  capacity(): number;

  /**
   * Returns `true` if the `Container` is empty.
   */
  isEmpty(): boolean;

  /**
   * Returns `true` if the `Container` is full.
   */
  isFull(): boolean;

  /**
   * Returns the number of items that can be added to this `Container`
   */
  remaining(): number;

  /**
   * Build the options to create a `Container` with the same options as this `Container`
   */
  buildOptions(): ContainerOptions;
}

export type Constructor<T = object> = new (...args: any[]) => T;
export type AbstractConstructor<T = object> = abstract new (...args: any[]) => T;
