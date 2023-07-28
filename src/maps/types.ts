import { IMap } from './map';
import { EqualFunction } from '../utils';

export interface MapComparators<K, V> {
  equalK?: EqualFunction<K>;
  equalV?: EqualFunction<V>;
}

export interface MapOptions<K, V> extends MapComparators<K, V> {
  capacity?: number;
}

export type MapInitializer<K, V> = Map<K, V> | IMap<K, V> | Iterable<[K, V]>;
