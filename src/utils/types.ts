export type Predicate<E> = (item: E) => boolean;
export type BinaryPredicate<E1, E2 = E1> = (item1: E1, item2: E2) => boolean;
export type Comparator<E> = (a: E, b: E) => number;
export type HashFunction<E> = (e: E) => number;
export type EqualFunction<E> = BinaryPredicate<E>;

export const equalPredicate = (e1: unknown, e2: unknown) => e1 === e2;
