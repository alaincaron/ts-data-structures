import { Comparator } from 'ts-fluent-iterators';
import { IMap, MapEntry } from './map';
import { ContainerOptions } from '../utils';

export interface SortedMapOptions<K> extends ContainerOptions {
  comparator?: Comparator<K>;
}

export interface SortedMap<K, V> extends IMap<K, V> {
  firstKey(): K | undefined;
  lastKey(): K | undefined;

  firstEntry(): MapEntry<K, V> | undefined;
  lastEntry(): MapEntry<K, V> | undefined;
}
