import { FluentIterator } from 'ts-fluent-iterators';
import { AbstractNavigableMap } from './abstract_navigable_map';
import { MapEntry } from './map';
import { SortedMapOptions } from './sorted_map';
import { ArrayStack } from '../stacks';
import { CapacityMixin } from '../utils';

export interface BinaryNode<K, V> extends MapEntry<K, V> {
  get left(): BinaryNode<K, V> | undefined;
  get right(): BinaryNode<K, V> | undefined;
}

export abstract class AbstractTreeMap<K, V> extends AbstractNavigableMap<K, V> {
  constructor(options?: number | SortedMapOptions<K>) {
    super(options);
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

  firstEntry() {
    let child = this.getRoot();
    if (child) {
      let left: BinaryNode<K, V> | undefined;

      while ((left = child.left)) {
        child = left;
      }
    }
    return child;
  }

  lastEntry() {
    let child = this.getRoot();
    if (child) {
      let right: BinaryNode<K, V> | undefined;

      while ((right = child.right)) {
        child = right;
      }
    }
    return child;
  }

  pollLastEntry() {
    const entry = this.lastEntry();
    if (entry) {
      this.remove(entry.key);
    }
    return entry;
  }

  pollFirstEntry() {
    const entry = this.firstEntry();
    if (entry) {
      this.remove(entry.key);
    }
    return entry;
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

  public remove(key: K) {
    const e = this.removeEntry(key);
    return e?.value;
  }

  private *entryGenerator(): IterableIterator<MapEntry<K, V>> {
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

  private *reverseEntryGenerator(): IterableIterator<MapEntry<K, V>> {
    const stack = new ArrayStack<BinaryNode<K, V>>();
    let cursor = this.getRoot();

    while (cursor || !stack.isEmpty()) {
      while (cursor) {
        stack.push(cursor);
        cursor = cursor.right;
      }
      cursor = stack.pop()!;
      yield cursor;
      cursor = cursor.left;
    }
  }

  entryIterator() {
    return new FluentIterator(this.entryGenerator());
  }

  reverseEntryIterator() {
    return new FluentIterator(this.reverseEntryGenerator());
  }

  abstract clone(): AbstractTreeMap<K, V>;
}

export const BoundedTreeMap = CapacityMixin(AbstractTreeMap);
