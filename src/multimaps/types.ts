import { MultiMap } from './multi_map';
import { MapLike } from '../maps';
import { ContainerOptions } from '../utils';

export type MultiMapLike<K, V> = MapLike<K, V> | MultiMap<K, V>;

export interface MultiMapInitializer<K, V> {
  initial?: MultiMapLike<K, V>;
}

export interface MultiMapOptions extends ContainerOptions {}
