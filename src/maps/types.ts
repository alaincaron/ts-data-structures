import { IMap } from './map';

export interface MapOptions {
  capacity?: number;
}

export type MapLike<K, V> = Map<K, V> | IMap<K, V> | Iterable<[K, V]>;

export interface MapInitializer<K, V> {
  initial?: MapLike<K, V>;
}
