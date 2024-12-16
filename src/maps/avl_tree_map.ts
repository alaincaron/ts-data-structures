import { buildMap, MapInitializer } from './map';
import { SortedMapOptions } from './sorted_map';
import { BinaryNode, TreeMap } from './tree_map';
import { WithCapacity } from '../utils';

enum Direction {
  LEFT,
  RIGHT,
}

export interface AvlNode<K, V> extends BinaryNode<K, V> {
  left: AvlNode<K, V> | undefined;
  right: AvlNode<K, V> | undefined;
  height: number;
}

function createNode<K, V>(key: K, value: V): AvlNode<K, V> {
  return { key, value, left: undefined, right: undefined, height: 0 };
}

function computeHeight<K, V>(node: AvlNode<K, V>) {
  node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;
}

function getHeight<K, V>(node: AvlNode<K, V> | undefined | null) {
  return node?.height ?? -1;
}

function leftBalance<K, V>(root: AvlNode<K, V>): AvlNode<K, V> {
  const child = root.left!;

  if (getHeight(child.right) > getHeight(child.left)) {
    const grandChild = child.right!;

    child.right = grandChild.left;
    grandChild.left = child;
    root.left = grandChild.right;
    grandChild.right = root;

    computeHeight(child);
    computeHeight(root);
    computeHeight(grandChild);

    return grandChild;
  }

  root.left = child.right;
  child.right = root;

  computeHeight(root);
  computeHeight(child);

  return child;
}

function rightBalance<K, V>(root: AvlNode<K, V>): AvlNode<K, V> {
  const child = root.right!;

  if (getHeight(child.left) > getHeight(child.right)) {
    const grandChild = child.left!;

    child.left = grandChild.right;
    grandChild.right = child;
    root.right = grandChild.left;
    grandChild.left = root;

    computeHeight(child);
    computeHeight(root);
    computeHeight(grandChild);

    return grandChild;
  }

  root.right = child.left;
  child.left = root;

  computeHeight(root);
  computeHeight(child);

  return child;
}

function rightMost<K, V>(root: AvlNode<K, V>): AvlNode<K, V> {
  if (!root.right) {
    return root;
  }

  const rightMostNode = rightMost(root.right);
  if (rightMostNode == root.right) {
    root.right = rightMostNode.left;
    rightMostNode.left = undefined;
    rightMostNode.height = 0;
  } else if (getHeight(root.right.left) - getHeight(root.right.right) > 1) {
    root.right = leftBalance(root.right);
  }
  computeHeight(root);
  return rightMostNode;
}

function leftMost<K, V>(root: AvlNode<K, V>): AvlNode<K, V> {
  if (!root.left) {
    return root;
  }

  const leftMostNode = leftMost(root.left);

  if (leftMostNode == root.left) {
    root.left = leftMostNode.right;
    leftMostNode.right = undefined;
    leftMostNode.height = 0;
  } else if (getHeight(root.left.right) - getHeight(root.left.left) > 1) {
    root.left = rightBalance(root.left);
  }

  computeHeight(root);

  return leftMostNode;
}

export class AvlTreeMap<K, V> extends TreeMap<K, V> {
  private root: AvlNode<K, V> | undefined;
  private _size: number = 0;

  constructor(options?: SortedMapOptions<K>) {
    super(options);
  }

  static create<K, V>(initializer?: WithCapacity<SortedMapOptions<K> & MapInitializer<K, V>>): AvlTreeMap<K, V> {
    return buildMap<K, V, AvlTreeMap<K, V>, SortedMapOptions<K>>(AvlTreeMap, initializer);
  }

  getRoot() {
    return this.root;
  }

  clear() {
    this.root = undefined;
    this._size = 0;
    return this;
  }

  size() {
    return this._size;
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

  private doPut(key: K, value: V) {
    const root = this.root;

    if (!root) {
      if (this.handleOverflow(key, value)) return undefined;

      // insert root node
      this.root = createNode(key, value);
      return undefined;
    }

    const c = this.comparator(key, root.key);

    if (c < 0) {
      const result = this.insertLeft(root, key, value);
      if (getHeight(root.left) - getHeight(root.right) > 1) {
        this.root = leftBalance(root);
      }
      return result;
    }

    if (c > 0) {
      const result = this.insertRight(root, key, value);
      if (getHeight(root.right) - getHeight(root.left) > 1) {
        this.root = rightBalance(root);
      }
      return result;
    }

    return root;
  }

  private insertLeft(parent: AvlNode<K, V>, key: K, value: V): AvlNode<K, V> | undefined {
    if (!parent.left) {
      if (this.handleOverflow(key, value)) return undefined;

      parent.left = createNode(key, value);
      parent.height = 1;
      return undefined;
    }

    const c = this.comparator(key, parent.left.key);
    let result: AvlNode<K, V> | undefined;

    if (c < 0) {
      result = this.insertLeft(parent.left, key, value);
      if (getHeight(parent.left.left) - getHeight(parent.left.right) > 1) {
        parent.left = leftBalance(parent.left);
      }
    } else if (c > 0) {
      result = this.insertRight(parent.left, key, value);
      if (getHeight(parent.left.right) - getHeight(parent.left.left) > 1) {
        parent.left = rightBalance(parent.left);
      }
    } else {
      result = parent.left;
    }
    if (!result) {
      computeHeight(parent);
    }
    return result;
  }

  private insertRight(parent: AvlNode<K, V>, key: K, value: V): AvlNode<K, V> | undefined {
    if (!parent.right) {
      if (this.handleOverflow(key, value)) return undefined;
      parent.right = createNode(key, value);
      parent.height = 1;
      return undefined;
    }

    const c = this.comparator(key, parent.right.key);
    let result: AvlNode<K, V> | undefined;

    if (c < 0) {
      result = this.insertLeft(parent.right, key, value);
      if (getHeight(parent.right.left) - getHeight(parent.right.right) > 1) {
        parent.right = leftBalance(parent.right);
      }
    } else if (c > 0) {
      result = this.insertRight(parent.right, key, value);
      if (getHeight(parent.right.right) - getHeight(parent.right.left) > 1) {
        parent.right = rightBalance(parent.right);
      }
    } else {
      result = parent.right;
    }
    if (!result) {
      computeHeight(parent);
    }
    return result;
  }

  protected removeEntry(key: K): AvlNode<K, V> | undefined {
    const removed = this.doRemoveEntry(key);
    if (removed) {
      --this._size;
    }
    return removed;
  }

  private doRemoveEntry(key: K) {
    const root = this.root;
    if (!root) {
      return undefined;
    }

    const c = this.comparator(key, root.key);

    if (c > 0) {
      const result = this.removeNodeDirection(key, root, Direction.RIGHT);
      if (result && getHeight(root.left) - getHeight(root.right) > 1) {
        this.root = leftBalance(root);
      }
      return result;
    }

    if (c < 0) {
      const result = this.removeNodeDirection(key, root, Direction.LEFT);
      if (result && getHeight(root.right) - getHeight(root.left) > 1) {
        this.root = rightBalance(root);
      }
      return result;
    }

    this.root = this.removeNode(root);
    return root;
  }

  private removeNodeDirection(key: K, root: AvlNode<K, V>, dir: Direction): AvlNode<K, V> | undefined {
    const child = dir === Direction.LEFT ? root.left : root.right;
    if (!child) {
      return child;
    }

    const c = this.comparator(key, child.key);
    if (c > 0) {
      const result = this.removeNodeDirection(key, child, Direction.RIGHT);
      if (result && getHeight(child.left) - getHeight(child.right) > 1) {
        const newChild = leftBalance(child);
        if (dir === Direction.LEFT) {
          root.left = newChild;
        } else {
          root.right = newChild;
        }
      }
      computeHeight(root);

      return result;
    }

    if (c < 0) {
      const result = this.removeNodeDirection(key, child, Direction.LEFT);
      if (result && getHeight(child.right) - getHeight(child.left) > 1) {
        const newChild = rightBalance(child);
        if (dir === Direction.LEFT) {
          root.left = newChild;
        } else {
          root.right = newChild;
        }
      }
      computeHeight(root);
      return result;
    }

    const newChild = this.removeNode(child);

    if (dir === Direction.LEFT) {
      root.left = newChild;
    } else {
      root.right = newChild;
    }
    computeHeight(root);
    return child;
  }

  private removeNode(root: AvlNode<K, V>) {
    if (!root.left && !root.right) {
      return undefined;
    }

    let newRoot: AvlNode<K, V> | undefined;
    const leftHeight = getHeight(root.left);
    const rightHeight = getHeight(root.right);

    if (leftHeight > rightHeight) {
      newRoot = rightMost(root.left!);
      newRoot.right = root.right;
      if (newRoot !== root.left) {
        newRoot.left = root.left!;
        const delta = getHeight(newRoot.left.left) - getHeight(newRoot.left.right);
        if (delta > 1) {
          newRoot.left = leftBalance(newRoot.left);
        } else if (delta < -1) {
          newRoot.left = rightBalance(newRoot.left);
        }
      }
    } else {
      newRoot = leftMost(root.right!);
      newRoot.left = root.left;
      if (newRoot != root.right) {
        newRoot.right = root.right!;
        const delta = getHeight(newRoot.right.left) - getHeight(newRoot.right.right);
        if (delta > 1) {
          newRoot.right = leftBalance(newRoot.right);
        } else if (delta < -1) {
          newRoot.right = rightBalance(newRoot.right);
        }
      }
    }

    computeHeight(newRoot);
    root.left = root.right = undefined;
    return newRoot;
  }

  clone(): AvlTreeMap<K, V> {
    return AvlTreeMap.create({ initial: this });
  }
}
