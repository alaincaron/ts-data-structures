import { IMap } from './map';
import { EqualFunction } from '../utils';

export interface MapOptions<K, V> {
  equalK?: EqualFunction<K>;
  equalV?: EqualFunction<V>;
  capacity?: number;
}

export interface MapInitializer<K, V> {
  initial: Map<K, V> | IMap<K, V> | Iterable<[K, V]>;
}
