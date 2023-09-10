export type BinaryPredicate<E1, E2 = E1> = (item1: E1, item2: E2) => boolean;
export type HashFunction<E> = (e: E) => number;
export type EqualFunction<E> = BinaryPredicate<E>;

export interface RandomAccess<E> {
  getAt(idx: number): E;
  setAt(idx: number, value: E): E;
}
