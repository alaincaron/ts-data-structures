/**
 * Options for building Container objects (`IMap` or `Collection`).
 */
export interface ContainerOptions {
  /**
   * The maximum number of elements that the Container may contain.
   */
  capacity?: number;
}

export type CollectionOptions = ContainerOptions | number;

/**
 * A `Container` is an object that can contain objects.
 */
export interface Container {
  /**
   * Build the options to create a `Container` with the same options as this `Container`
   */
  buildOptions(): ContainerOptions;
}

export type Constructor<T = object, A extends unknown[] = any[]> = new (...args: A) => T;
export type AbstractConstructor<T = object, A extends unknown[] = any[]> = abstract new (...args: A) => T;
export type ParameterTail<T extends readonly unknown[]> = T extends [unknown, ...infer U] ? U : never;
export type PrependParameter<Type, Arguments extends unknown[]> = Arguments extends []
  ? [Type]
  : [Arguments[0] & Type, ...ParameterTail<Arguments>];
