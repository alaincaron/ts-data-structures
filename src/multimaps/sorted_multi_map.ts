import { MapBasedMultiMapOptions } from './map_based_multi_map';
import { SortedMapOptions } from '../maps';

export type SortedMultiMapOptions<K, V> = SortedMapOptions<K> & MapBasedMultiMapOptions<V>;
