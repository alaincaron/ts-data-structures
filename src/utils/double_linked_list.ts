export namespace DoubleLinkedList {
  export interface Entry {
    before: Entry;
    after: Entry;
  }
}

type Entry = DoubleLinkedList.Entry;
export class DoubleLinkedList<K> {
  public readonly header: Entry;
  constructor() {
    this.header = {} as Entry;
    this.header.before = this.header.after = this.header;
  }

  isEmpty() {
    return this.header.before === this.header;
  }

  after(e: K) {
    const node = (e as Entry).after;
    return node === this.header ? undefined : (node as K);
  }

  before(e: K) {
    const node = (e as Entry).before;
    return node === this.header ? undefined : (node as K);
  }

  isLast(e: K) {
    return (e as Entry).after === this.header;
  }

  isFirst(e: K) {
    return (e as Entry).before === this.header;
  }

  addLast(e: K) {
    this.addBefore(e, this.header as unknown as K);
  }

  addFirst(e: K) {
    this.addAfter(e, this.header as unknown as K);
  }

  addBefore(e: K, existingEntry: K) {
    const toAdd = e as Entry;
    const existingNode = existingEntry as Entry;
    toAdd.after = existingNode;
    toAdd.before = existingNode.before;
    toAdd.before.after = toAdd;
    toAdd.after.before = toAdd;
  }

  addAfter(e: K, existingEntry: K) {
    const toAdd = e as Entry;
    const existingNode = existingEntry as Entry;
    toAdd.before = existingNode;
    toAdd.after = existingNode.after;
    toAdd.after.before = toAdd;
    toAdd.before.after = toAdd;
  }

  remove(entry: K) {
    const e = entry as Entry;
    e.before.after = e.after;
    e.after.before = e.before;
  }

  clear() {
    this.header.before = this.header.after = this.header;
  }

  first(): K | undefined {
    const eldest = this.header.after;
    return eldest === this.header ? undefined : (eldest as K);
  }

  last(): K | undefined {
    const youngest = this.header.before;
    return youngest === this.header ? undefined : (youngest as K);
  }

  *entries(): IterableIterator<K> {
    // this loop is more complicated than regular inspection of the after field because it
    // allows to change the list at 'current' point without affecting iteration.
    let current = this.first();
    while (current) {
      const next = this.after(current);
      yield current as K;
      current = next;
    }
  }

  *entriesReversed(): IterableIterator<K> {
    // this loop is more complicated than regular inspection of the before field because it
    // allows to change the list at 'current' point without affecting iteration.
    let current = this.last();
    while (current) {
      const next = this.before(current);
      yield current as K;
      current = next;
    }
  }
}
