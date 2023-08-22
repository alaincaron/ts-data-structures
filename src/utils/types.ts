export type Predicate<E> = (item: E) => boolean;
export type BinaryPredicate<E1, E2 = E1> = (item1: E1, item2: E2) => boolean;
export type Comparator<E> = (a: E, b: E) => number;
export type HashFunction<E> = (e: E) => number;
export type EqualFunction<E> = BinaryPredicate<E>;
export type Reducer<A, B> = (acc: B, a: A) => B;

export const equalPredicate = (e1: unknown, e2: unknown) => e1 === e2;

export type IteratorLike<E> = ((i: number) => E) | Iterator<E> | Iterable<E>;

export interface ArrayLike<E> {
  length: number;
  seed: IteratorLike<E>;
}
