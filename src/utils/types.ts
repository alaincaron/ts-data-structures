export type HashFunction<E> = (e: E) => number;

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
