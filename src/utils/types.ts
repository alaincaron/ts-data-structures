export type BinaryPredicate<E1, E2 = E1> = (item1: E1, item2: E2) => boolean;
export type HashFunction<E> = (e: E) => number;
export type EqualFunction<E> = BinaryPredicate<E>;

export interface RandomAccess<E> {
  getAt(idx: number): E;
  setAt(idx: number, value: E): E;
}

export interface ContainerOptions {
  capacity?: number;
}

export interface OptionsBuilder {
  buildOptions(): ContainerOptions;
}

export type Constructor<T = object> = new (...args: any[]) => T;
export type AbstractConstructor<T = object> = abstract new (...args: any[]) => T;
