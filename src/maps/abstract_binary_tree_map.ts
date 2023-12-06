import { Comparator, FluentIterator, Functions } from 'ts-fluent-iterators';
import { AbstractMap } from './abstract_map';
import { MapEntry } from './map';
import { SortedMap, SortedMapOptions } from './sorted_map';
import { ArrayStack } from '../stacks';
import { CapacityMixin } from '../utils';

export interface BinaryNode<K, V> extends MapEntry<K, V> {
  get left(): BinaryNode<K, V> | undefined;
  get right(): BinaryNode<K, V> | undefined;
}

export abstract class AbstractBinaryTreeMap<K, V> extends AbstractMap<K, V> implements SortedMap<K, V> {
  public readonly comparator: Comparator<K>;

  constructor(options?: number | SortedMapOptions<K>) {
    super(options);
    this.comparator = (options as any)?.comparator ?? Functions.defaultComparator;
  }

  protected abstract getRoot(): BinaryNode<K, V> | undefined;

  getEntry(key: K): BinaryNode<K, V> | undefined {
    let child = this.getRoot();
    while (child) {
      const c = this.comparator(key, child.key);

      if (c === 0) {
        break;
      } else if (c > 0) {
        // the searched node is greater, check whether the right
        // subtree is empty or not
        child = child.right;
      } else if (c < 0) {
        // the searched node is smaller, check whether the left subtree
        // is empty or not
        child = child.left;
      }
    }
    return child;
  }

  protected abstract removeEntry(key: K): BinaryNode<K, V> | undefined;

  protected findMinNode() {
    let child = this.getRoot();
    if (child) {
      let left: BinaryNode<K, V> | undefined;

      while ((left = child.left)) {
        child = left;
      }
    }
    return child;
  }

  protected findMaxNode() {
    let child = this.getRoot();
    if (child) {
      let right: BinaryNode<K, V> | undefined;

      while ((right = child.right)) {
        child = right;
      }
    }
    return child;
  }

  lastEntry() {
    return this.findMaxNode();
  }

  firstEntry() {
    return this.findMinNode();
  }

  pollLastEntry() {
    const entry = this.findMaxNode();
    if (entry) {
      this.remove(entry.key);
    }
    return entry;
  }

  pollFirstEntry() {
    const entry = this.findMinNode();
    if (entry) {
      this.remove(entry.key);
    }
    return entry;
  }

  firstKey() {
    const e = this.findMinNode();
    return e?.key;
  }

  lastKey() {
    const e = this.findMaxNode();
    return e?.key;
  }

  lowerEntry(key: K) {
    let node = this.getRoot();
    let lastRight: BinaryNode<K, V> | undefined = undefined;

    while (node) {
      const c = this.comparator(key, node.key);

      if (c <= 0) {
        const left = node.left;
        if (!left) {
          return lastRight;
        }
        node = left;
      } else {
        const right = node.right;
        if (!right) {
          return node;
        }
        lastRight = node;
        node = right;
      }
    }
    return undefined;
  }

  lowerKey(key: K) {
    const e = this.lowerEntry(key);
    return e?.key;
  }

  floorEntry(key: K) {
    let node = this.getRoot();
    let lastRight: BinaryNode<K, V> | undefined = undefined;

    while (node) {
      const c = this.comparator(key, node.key);

      if (c < 0) {
        const left = node.left;
        if (!left) {
          return lastRight;
        }
        node = left;
      } else if (c > 0) {
        const right = node.right;
        if (!right) {
          return node;
        }
        lastRight = node;
        node = right;
      } else {
        return node;
      }
    }
    return undefined;
  }

  floorKey(key: K) {
    const e = this.floorEntry(key);
    return e?.key;
  }

  ceilingEntry(key: K) {
    let node = this.getRoot();
    let lastLeft: BinaryNode<K, V> | undefined = undefined;

    while (node) {
      const c = this.comparator(key, node.key);

      if (c > 0) {
        const right = node.right;
        if (!right) {
          return lastLeft;
        }
        node = right;
      } else if (c < 0) {
        const left = node.left;
        if (!left) {
          return node;
        }
        lastLeft = node;
        node = left;
      } else {
        return node;
      }
    }
    return undefined;
  }

  ceilingKey(key: K) {
    const e = this.ceilingEntry(key);
    return e?.key;
  }

  higherEntry(key: K) {
    let node = this.getRoot();
    let lastLeft: BinaryNode<K, V> | undefined = undefined;

    while (node) {
      const c = this.comparator(key, node.key);

      if (c >= 0) {
        const right = node.right;
        if (!right) {
          return lastLeft;
        }
        node = right;
      } else if (c < 0) {
        const left = node.left;
        if (!left) {
          return node;
        }
        lastLeft = node;
        node = left;
      }
    }
    return undefined;
  }

  higherKey(key: K) {
    const e = this.higherEntry(key);
    return e?.key;
  }

  public remove(key: K) {
    const e = this.removeEntry(key);
    return e?.value;
  }

  protected *entryGenerator(): IterableIterator<MapEntry<K, V>> {
    const stack = new ArrayStack<BinaryNode<K, V>>();
    let cursor = this.getRoot();

    while (cursor || !stack.isEmpty()) {
      while (cursor) {
        stack.push(cursor);
        cursor = cursor.left;
      }
      cursor = stack.pop()!;
      yield cursor;
      cursor = cursor.right;
    }
  }

  entryIterator() {
    return new FluentIterator(this.entryGenerator());
  }

  buildOptions(): SortedMapOptions<K> {
    return {
      ...super.buildOptions(),
      comparator: this.comparator,
    };
  }

  abstract clone(): AbstractBinaryTreeMap<K, V>;
}

export const BoundedBinaryTreeMap = CapacityMixin(AbstractBinaryTreeMap);
