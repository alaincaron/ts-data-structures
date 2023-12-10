import { FluentIterator, iterator } from 'ts-fluent-iterators';
import { buildMap } from './abstract_map';
import { BoundedNavigableMap } from './abstract_navigable_map';
import { MapEntry } from './map';
import { SortedMapOptions } from './sorted_map';
import { MapInitializer } from './types';
import { DoubleLinkedList } from '../utils';

export interface SkipListNode<K, V> extends MapEntry<K, V> {
  up: SkipListNode<K, V> | undefined;
  down: SkipListNode<K, V> | undefined;
  level: number;
}

export interface SkipListMapOptions<K> extends SortedMapOptions<K> {
  probability?: number;
}

export class SkipListMap<K, V> extends BoundedNavigableMap<K, V> {
  private _layers: DoubleLinkedList<SkipListNode<K, V>>[];
  private _size: number = 0;
  private probability: number;

  constructor(options?: number | SkipListMapOptions<K>) {
    super(options);
    this._layers = [new DoubleLinkedList()];
    this.probability = (options as any)?.probability ?? 0.5;
  }

  static create<K, V>(initializer?: number | SkipListMapOptions<K> | MapInitializer<K, V>): SkipListMap<K, V> {
    return buildMap<K, V, SkipListMap<K, V>, SkipListMapOptions<K>>(SkipListMap, initializer);
  }

  private createNode(key: K, value: V, level: number): SkipListNode<K, V> {
    return { key, value, up: undefined, down: undefined, level };
  }

  clear() {
    this._layers = [new DoubleLinkedList()];
    this._size = 0;
  }

  size() {
    return this._size;
  }

  put(key: K, value: V): V | undefined {
    const node = this.findNode(key);
    if (node && this.comparator(node.key, key) === 0) {
      return this.updateValueDown(node, value);
    }

    if (this.handleOverflow(key, value)) return undefined;

    let currentLevel = 0;
    let newNode = this.createNode(key, value, currentLevel);
    this.horizontalInsert(currentLevel, node, newNode);

    const nbLayers = this._layers.length;
    while (this.shouldPropagateUp()) {
      const newUpNode = this.createNode(key, value, currentLevel + 1);
      this.addNodeToNextLevel(currentLevel, newNode, newUpNode);
      this.verticalLink(newUpNode, newNode);
      if (nbLayers < this._layers.length) break;
      newNode = newUpNode;
      ++currentLevel;
    }

    ++this._size;
    return undefined;
  }

  firstEntry() {
    return this._layers[0].first();
  }

  lastEntry() {
    return this._layers[0].last();
  }

  lowerEntry(key: K) {
    let node = this.findNode(key);
    if (!node || this.comparator(node.key, key) < 0) return node;
    while (node.down) node = node.down;
    return this._layers[0].before(node);
  }

  higherEntry(key: K) {
    let node = this.findNode(key) ?? this._layers[0].first();

    if (!node) return node;

    const c = this.comparator(node.key, key);
    if (c > 0) return node;
    if (c === 0) {
      while (node.down) node = node.down;
    }
    return this._layers[0].after(node);
  }

  ceilingEntry(key: K) {
    let node = this.findNode(key);

    if (!node) {
      node = this._layers[0].first();
      if (!node) return node;
      return this.comparator(node.key, key) >= 0 ? node : undefined;
    }

    while (node.down) node = node.down;

    if (this.comparator(node.key, key) === 0) return node;

    return this._layers[0].after(node);
  }

  floorEntry(key: K) {
    return this.findNode(key);
  }

  pollLastEntry() {
    const e = this._layers[0].last();
    if (!e) return undefined;
    this.removeEntryUpward(e);
    return e;
  }

  pollFirstEntry() {
    const e = this._layers[0].first();
    if (!e) return undefined;
    this.removeEntryUpward(e);
    return e;
  }

  remove(key: K) {
    const e = this.getEntry(key);
    if (!e) return undefined;
    this.removeEntryDownward(e);
    return e.value;
  }

  entryIterator() {
    return new FluentIterator(this._layers[0].entries());
  }

  reverseEntryIterator() {
    return new FluentIterator(this._layers[0].entriesReversed());
  }

  clone(): SkipListMap<K, V> {
    return SkipListMap.create({ initial: this });
  }

  private removeEmptyLayers() {
    for (let i = this._layers.length - 1; i > 0; --i) {
      const linkedList = this._layers[i];
      if (!linkedList.isEmpty()) break;
      this._layers.pop();
    }
  }

  private removeEntryUpward(entry: SkipListNode<K, V>) {
    let e: SkipListNode<K, V> | undefined = entry;
    while (e) {
      this._layers[e.level].remove(e);
      e = e.up;
    }
    this.removeEmptyLayers();
    --this._size;
  }

  private removeEntryDownward(entry: SkipListNode<K, V>) {
    let e: SkipListNode<K, V> | undefined = entry;
    while (e) {
      this._layers[e.level].remove(e);
      e = e.down;
    }
    this.removeEmptyLayers();
    --this._size;
  }

  protected getEntry(key: K): SkipListNode<K, V> | undefined {
    const n = this.findNode(key);
    return n && this.comparator(n.key, key) === 0 ? n : undefined;
  }

  private addNodeToNextLevel(level: number, node: SkipListNode<K, V>, upNode: SkipListNode<K, V>) {
    const linkedList = this._layers[level];
    if (linkedList.isFirst(node)) {
      if (++level >= this._layers.length) {
        this._layers.push(new DoubleLinkedList<SkipListNode<K, V>>());
      }
      this.horizontalInsert(level, undefined, upNode);
      return;
    }

    for (;;) {
      if (node.up) break;
      const before = linkedList.before(node);
      if (!before) break;
      node = before;
    }
    ++level;
    if (!node.up && level >= this._layers.length) {
      this._layers.push(new DoubleLinkedList<SkipListNode<K, V>>());
    }
    this.horizontalInsert(level, node.up, upNode);
  }

  private findNode(key: K): SkipListNode<K, V> | undefined {
    let idx = this._layers.length - 1;
    let node: SkipListNode<K, V> | undefined;

    for (;;) {
      const linkedList = this._layers[idx];
      node = linkedList.first();
      if (!node) {
        return node;
      }
      const c = this.comparator(node.key, key);
      if (c === 0) {
        return node;
      }
      if (c > 0) {
        if (idx === 0) {
          return undefined;
        }
        --idx;
        continue;
      }
      break;
    }

    for (;;) {
      const linkedList = this._layers[idx];
      let next = linkedList.after(node);
      while (next && this.comparator(next.key, key) <= 0) {
        node = next;
        next = linkedList.after(node);
      }
      if (this.comparator(node.key, key) === 0) {
        break;
      }

      if (!node.down) break;
      --idx;
      node = node.down;
    }

    return node;
  }

  layers() {
    const result = [];
    for (const layer of this._layers) {
      result.push(
        iterator(layer.entries())
          .map(x => x.key)
          .collect()
      );
    }
    return result;
  }

  private updateValueDown(node: SkipListNode<K, V>, value: V) {
    if (node.value === value) return value;
    const oldValue = node.value;
    for (;;) {
      node.value = value;
      if (!node.down) break;
      node = node.down;
    }
    return oldValue;
  }

  private shouldPropagateUp() {
    return Math.random() < this.probability;
  }

  private horizontalInsert(level: number, node: SkipListNode<K, V> | undefined, newNode: SkipListNode<K, V>) {
    const linkedList = this._layers[level];
    if (node) {
      linkedList.addAfter(newNode, node);
    } else {
      linkedList.addFirst(newNode);
    }
  }

  private verticalLink(upNode: SkipListNode<K, V>, downNode: SkipListNode<K, V>) {
    upNode.down = downNode;
    downNode.up = upNode;
  }
}
