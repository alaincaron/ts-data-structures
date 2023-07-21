export type Predicate<E> = (item: E) => boolean;
export type Comparator<E> = (a: E, b: E) => number;
export type HashFunction<E> = (e: E) => number;
export type EqualFunction<E> = (e1: E, e2: E) => boolean;
