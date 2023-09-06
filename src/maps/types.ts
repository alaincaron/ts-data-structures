import { IMap } from './map';

export interface MapOptions {
  capacity?: number;
}

export interface MapInitializer<K, V> {
  initial?: Map<K, V> | IMap<K, V> | Iterable<[K, V]>;
}
