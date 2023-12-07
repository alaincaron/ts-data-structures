import { buildMap } from './abstract_map';
import { BinaryNode, BoundedTreeMap } from './abstract_tree_map';
import { SortedMapOptions } from './sorted_map';
import { MapInitializer } from './types';

export interface SplayNode<K, V> extends BinaryNode<K, V> {
  left: SplayNode<K, V> | undefined;
  right: SplayNode<K, V> | undefined;
}

function createNode<K, V>(key: K, value: V): SplayNode<K, V> {
  return { key, value, left: undefined, right: undefined };
}

function rotateWithLeftChild<K, V>(node: SplayNode<K, V>) {
  const child = node.left!;
  node.left = child.right!;
  child.right = node;
  return child;
}

function rotateWithRightChild<K, V>(node: SplayNode<K, V>) {
  const child = node.right!;
  node.right = child.left!;
  child.left = node;
  return child;
}

export class SplayTreeMap<K, V> extends BoundedTreeMap<K, V> {
  private root: SplayNode<K, V> | undefined;
  private _size: number = 0;

  constructor(options?: number | SortedMapOptions<K>) {
    super(options);
  }

  static create<K, V>(initializer?: number | SortedMapOptions<K> | MapInitializer<K, V>): SplayTreeMap<K, V> {
    return buildMap<K, V, SplayTreeMap<K, V>, SortedMapOptions<K>>(SplayTreeMap, initializer);
  }

  protected getRoot() {
    return this.root;
  }

  clear() {
    this.root = undefined;
    this._size = 0;
  }

  size() {
    return this._size;
  }

  getEntry(key: K): SplayNode<K, V> | undefined {
    let root = this.getRoot();
    if (!root) return root;

    root = this.splay(key);

    if (this.comparator(key, root.key)) return undefined;
    return root;
  }

  put(key: K, value: V) {
    const old = this.doPut(key, value);
    if (!old) {
      ++this._size;
      return undefined;
    } else {
      const oldValue = old.value;
      old.value = value;
      return oldValue;
    }
  }

  private splay(key: K) {
    const root = this.getRoot();
    if (!root) throw new Error('Invalid empty tree');

    const header = createNode(undefined, undefined) as SplayNode<K, V>;
    let rightTree = header;
    let t = root;
    let leftTree = header;

    try {
      for (;;) {
        const c = this.comparator(key, t.key);
        if (c < 0) {
          if (!t.left) break;
          const c1 = this.comparator(key, t.left.key);
          if (c1 < 0) {
            t = rotateWithLeftChild(t);
            if (!t.left) break;
          }
          rightTree.left = t;
          rightTree = t;
          t = t.left;
        } else if (c > 0) {
          if (!t.right) break;
          const c1 = this.comparator(key, t.right.key);
          if (c1 > 0) {
            t = rotateWithRightChild(t);
            if (!t.right) break;
          }
          leftTree.right = t;
          leftTree = t;
          t = t.right;
        } else {
          break;
        }
      }
    } finally {
      leftTree.right = t.left;
      rightTree.left = t.right;
      t.left = header.right;
      t.right = header.left;
      this.root = t;
    }
    return this.root!;
  }

  private doPut(key: K, value: V) {
    let root = this.getRoot();

    if (!root) {
      if (this.handleOverflow(key, value)) return undefined;

      // insert root node
      this.root = createNode(key, value);
      return undefined;
    }

    root = this.splay(key);

    const c = this.comparator(key, root.key);
    if (!c) return root;

    if (this.handleOverflow(key, value)) return undefined;
    const newRoot = createNode(key, value);

    if (c < 0) {
      newRoot.left = root.left;
      newRoot.right = root;
      root.left = undefined;
    } else {
      newRoot.right = root.right;
      newRoot.left = root;
      root.right = undefined;
    }
    this.root = newRoot;
    return undefined;
  }

  protected removeEntry(key: K): SplayNode<K, V> | undefined {
    let root = this.getRoot();
    if (!root) return root;

    root = this.splay(key);
    if (this.comparator(key, root.key) != 0) {
      return undefined;
    }

    // Now delete the root
    const oldRoot = root;
    this.deleteRoot();
    oldRoot.left = oldRoot.right = undefined;
    return oldRoot;
  }

  private deleteRoot() {
    const oldRoot = this.root!;
    if (!oldRoot.left) {
      this.root = oldRoot.right;
    } else {
      const key = oldRoot.key;
      const rightChild = oldRoot.right;
      this.root = oldRoot.left;
      const newRoot = this.splay(key);
      newRoot.right = rightChild;
    }
    --this._size;
  }

  lastEntry() {
    const e = super.lastEntry();
    if (e) this.splay(e.key);
    return e;
  }

  pollLastEntry() {
    const e = this.lastEntry();
    if (e) this.deleteRoot();
    return e;
  }

  firstEntry() {
    const e = super.firstEntry();
    if (e) this.splay(e.key);
    return e;
  }

  pollFirstEntry() {
    const e = this.firstEntry();
    if (e) this.deleteRoot();
    return e;
  }

  lowerEntry(key: K) {
    const root = this.getRoot();
    if (!root) return root;
    this.splay(key);
    return super.lowerEntry(key);
  }

  floorEntry(key: K) {
    const root = this.getRoot();
    if (!root) return root;
    this.splay(key);
    return super.floorEntry(key);
  }

  ceilingEntry(key: K) {
    const root = this.getRoot();
    if (!root) return root;
    this.splay(key);
    return super.ceilingEntry(key);
  }

  higherEntry(key: K) {
    const root = this.getRoot();
    if (!root) return root;
    this.splay(key);
    return super.higherEntry(key);
  }

  clone(): SplayTreeMap<K, V> {
    return SplayTreeMap.create({ initial: this });
  }
}
