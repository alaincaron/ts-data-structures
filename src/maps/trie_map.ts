import { FluentIterator } from 'ts-fluent-iterators';
import { AvlTreeMap } from './avl_tree_map';
import { buildMap, MapEntry, MapInitializer } from './map';
import { BoundedSortedMap, SortedMap, SortedMapOptions } from './sorted_map';

interface TrieMapNode<V> {
  key: string;
  value?: V;
  children: SortedMap<string, TrieMapNode<V>>;
}

export interface TrieMapOptions extends SortedMapOptions<string> {
  caseSensitive?: boolean;
}

function createNode<V>(key: string, value?: V) {
  return { key, value, children: new AvlTreeMap<string, TrieMapNode<V>>() };
}

class TrieMapEntry<V> implements MapEntry<string, V> {
  constructor(
    private _key: string,
    private node: TrieMapNode<V>
  ) {}
  get key() {
    return this._key;
  }
  set value(v: V) {
    this.node.value = v;
  }

  get value(): V {
    return this.node.value!;
  }
}

export class TrieMap<V> extends BoundedSortedMap<string, V> {
  private root: TrieMapNode<V> = createNode('');
  private _size = 0;
  private caseSensitive: boolean;

  constructor(options?: number | TrieMapOptions) {
    super(options);
    this.caseSensitive = typeof options === 'object' && !!options.caseSensitive;
  }

  static create<V>(initializer?: number | TrieMapOptions | MapInitializer<string, V>): TrieMap<V> {
    return buildMap<string, V, TrieMap<V>, TrieMapOptions>(TrieMap, initializer);
  }

  clear() {
    this.root = createNode('');
    this._size = 0;
  }

  size() {
    return this._size;
  }

  put(key: string, value: V) {
    key = this.cleanInput(key);
    let node = this.root;
    let first = true;
    for (const c of key) {
      let nodeC = node.children.get(c);
      if (!nodeC) {
        if (first) {
          if (this.handleOverflow(key, value)) return undefined;
        } else {
          first = false;
        }
        nodeC = createNode(c);
        node.children.put(c, nodeC);
      }
      node = nodeC;
    }
    const oldValue = node.value;
    node.value = value;
    if (!oldValue) {
      this._size++;
    }
    return oldValue;
  }

  containsKey(word: string): boolean {
    const node = this.getNodePrefix(word);
    return node?.value !== undefined;
  }

  remove(word: string): V | undefined {
    word = this.cleanInput(word);

    function deleteRecursively(node: TrieMapNode<V>, i: number): V | undefined {
      const char = word[i];
      const child = node.children.get(char);
      if (child) {
        if (i === word.length - 1) {
          const oldValue = child.value;
          if (oldValue !== undefined) {
            if (!child.children.isEmpty()) {
              child.value = undefined;
            } else {
              node.children.remove(char);
            }
            return oldValue;
          }
          return undefined;
        }
        const removed = deleteRecursively(child, i + 1);
        if (removed !== undefined && node.value === undefined && child.children.isEmpty()) {
          node.children.remove(char);
        }
        return removed;
      }
      return undefined;
    }

    const oldValue = deleteRecursively(this.root, 0);
    if (oldValue !== undefined) {
      this._size--;
    }
    return oldValue;
  }

  buildOptions(): TrieMapOptions {
    return {
      ...super.buildOptions(),
      caseSensitive: this.caseSensitive,
    };
  }

  clone(): TrieMap<V> {
    return TrieMap.create({ initial: this });
  }

  entryIterator() {
    return new FluentIterator(this.entryGenerator());
  }

  reverseEntryIterator() {
    return new FluentIterator(this.reverseEntryGenerator());
  }

  firstEntry() {
    let node: TrieMapNode<V> | undefined = this.root;
    let word = '';
    for (;;) {
      if (node?.value !== undefined) break;
      const e = node.children.firstEntry();
      if (!e) break;
      word += e.key;
      node = e.value;
    }
    return node?.value !== undefined ? new TrieMapEntry(word, node) : undefined;
  }

  lastEntry() {
    let node: TrieMapNode<V> | undefined = this.root;
    let word = '';
    for (;;) {
      const e = node.children.lastEntry();
      if (!e) break;
      word += e.key;
      node = e.value;
    }
    return node?.value !== undefined ? new TrieMapEntry(word, node) : undefined;
  }

  private getNodePrefix(word: string): TrieMapNode<V> | undefined {
    let node: TrieMapNode<V> | undefined = this.root;
    word = this.cleanInput(word);
    const iter = word[Symbol.iterator]();
    for (;;) {
      if (!node) break;
      const item = iter.next();
      if (item.done) break;
      node = node.children.get(item.value);
    }
    return node;
  }

  getEntry(word: string): MapEntry<string, V> | undefined {
    const node = this.getNodePrefix(word);
    return node?.value === undefined ? undefined : new TrieMapEntry(word, node);
  }

  getHeight(): number {
    function computeHeight(node: TrieMapNode<V>, level: number): number {
      let maxLevel = level;
      for (const child of node.children.values()) {
        const child_level = computeHeight(child, level + 1);
        if (child_level > maxLevel) maxLevel = child_level;
      }
      return maxLevel;
    }
    return computeHeight(this.root, 0);
  }

  /**
   *
   * Check if a given input string has a prefix in the Trie,
   * @param input The input string to check.
   * @param pure if true check for an absloute prefix, meaning it's not a complete word. If false, it checks for absolute prefix and the word itself.
   * @returns {boolean} True if it's an absolute prefix in the Trie.
   */
  hasPrefix(input: string, pure: boolean = true): boolean {
    input = this.cleanInput(input);
    let node = this.root;
    for (const c of input) {
      const child = node.children.get(c);
      if (!child) return false;
      node = child;
    }
    return !pure || node.value === undefined;
  }

  /**
   *
   * Check if the input string is a common prefix in the Trie, meaning it's a prefix shared by all words in the Trie.
   * @param {string} input - The input string representing the common prefix to check for.
   * @returns {boolean} True if it's a common prefix in the Trie.
   */
  hasCommonPrefix(input: string): boolean {
    input = this.cleanInput(input);
    let commonPrefix = '';
    const dfs = (cur: TrieMapNode<V>) => {
      commonPrefix += cur.key;
      if (commonPrefix === input || cur.value !== undefined) return;
      if (cur && cur.children && cur.children.size() === 1) dfs(cur.children.firstEntry()!.value);
    };
    dfs(this.root);
    return commonPrefix === input;
  }

  /**
   *
   * Get the longest common prefix among all the words stored in the Trie.
   * @returns {string} The longest common prefix found in the Trie.
   */
  getLongestCommonPrefix(): string {
    let commonPrefix = '';
    const dfs = (cur: TrieMapNode<V>) => {
      commonPrefix += cur.key;
      if (cur.value !== undefined) return;
      if (cur && cur.children && cur.children.size() === 1) dfs(cur.children.firstEntry()!.value);
    };
    dfs(this.root);
    return commonPrefix;
  }

  /**
   * Time Complexity: O(w * l), where w is the number of words retrieved, and l is the average length of the words.
   * Space Complexity: O(w * l) - The space required for the output array.
   *
   * returns an `Iterator` of all words in a Trie data structure that start with a given prefix.
   * @param {string} prefix - The `prefix` parameter is a string that represents the prefix that we want to search for in the
   * trie. It is an optional parameter, so if no prefix is provided, it will default to an empty string.
   * @returns {string[]} an array of strings.
   */
  private *wordGenerator(prefix: string): IterableIterator<TrieMapEntry<V>> {
    function* dfs(node: TrieMapNode<V>, word: string): IterableIterator<TrieMapEntry<V>> {
      if (node.value !== undefined) {
        yield new TrieMapEntry(word, node);
      }
      for (const [char, child] of node.children) {
        yield* dfs(child, word + char);
      }
    }

    const startNode = this.getNodePrefix(prefix);
    if (!startNode) return;

    yield* dfs(startNode, prefix);
  }

  words(prefix: string) {
    return this.wordGenerator(prefix);
  }

  wordIterator(prefix: string) {
    return new FluentIterator(this.wordGenerator(prefix));
  }

  private *entryGenerator(): IterableIterator<MapEntry<string, V>> {
    function* helper(prefix: string, node: TrieMapNode<V>): IterableIterator<MapEntry<string, V>> {
      if (node.value !== undefined) {
        yield new TrieMapEntry(prefix, node);
      }
      for (const [c, child] of node.children.entries()) {
        yield* helper(prefix + c, child);
      }
    }
    yield* helper('', this.root);
  }

  private *reverseEntryGenerator(): IterableIterator<MapEntry<string, V>> {
    function* helper(prefix: string, node: TrieMapNode<V>): IterableIterator<MapEntry<string, V>> {
      for (const [c, child] of node.children.reverseEntries()) {
        yield* helper(prefix + c, child);
      }
      if (node.value !== undefined) {
        yield new TrieMapEntry(prefix, node);
      }
    }
    yield* helper('', this.root);
  }

  private cleanInput(input: string) {
    return this.caseSensitive ? input : input.toLowerCase();
  }
}
