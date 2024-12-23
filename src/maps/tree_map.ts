import { FluentIterator } from 'ts-fluent-iterators';
import { AbstractNavigableMap } from './abstract_navigable_map';
import { SortedMapOptions } from './abstract_sorted_map';
import { MutableMapEntry } from './mutable_map';
import { ArrayStack } from '../stacks';

export interface BinaryNode<K, V> extends MutableMapEntry<K, V> {
  get left(): BinaryNode<K, V> | undefined;
  get right(): BinaryNode<K, V> | undefined;
}

export abstract class TreeMap<K, V> extends AbstractNavigableMap<K, V> {
  protected constructor(options?: SortedMapOptions<K>) {
    super(options);
  }

  protected abstract getRoot(): BinaryNode<K, V> | undefined;

  getEntry(key: K): BinaryNode<K, V> | undefined {
    let child = this.getRoot();
    while (child) {
      const c = this.comparator(key, child.key);

      if (c === 0) {
        break;
      }
      if (c > 0) {
        child = child.right;
      } else if (c < 0) {
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

  private *getEntryGenerator(
    onPush: (node: BinaryNode<K, V>) => BinaryNode<K, V> | undefined,
    onPop: (node: BinaryNode<K, V>) => BinaryNode<K, V> | undefined
  ): IterableIterator<MutableMapEntry<K, V>> {
    const stack = new ArrayStack<BinaryNode<K, V>>();
    let cursor = this.getRoot();

    while (cursor || !stack.isEmpty()) {
      while (cursor) {
        stack.push(cursor);
        cursor = onPush(cursor);
      }
      cursor = stack.pop()!;
      yield cursor;
      cursor = onPop(cursor);
    }
  }

  private entryGenerator(): IterableIterator<MutableMapEntry<K, V>> {
    return this.getEntryGenerator(
      cursor => cursor.left,
      cursor => cursor.right
    );
  }

  private reverseEntryGenerator(): IterableIterator<MutableMapEntry<K, V>> {
    return this.getEntryGenerator(
      cursor => cursor.right,
      cursor => cursor.left
    );
  }

  entryIterator() {
    return new FluentIterator(this.entryGenerator());
  }

  reverseEntryIterator() {
    return new FluentIterator(this.reverseEntryGenerator());
  }

  abstract clone(): TreeMap<K, V>;
}
