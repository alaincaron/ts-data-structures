export namespace DoubleLinkedList {
  export interface Entry {
    before: Entry;
    after: Entry;
  }
}

type Entry = DoubleLinkedList.Entry;
export class DoubleLinkedList<K = Entry> {
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
    for (let e = this.header.after; e != this.header; e = e.after) yield e as K;
  }

  *entriesReversed(): IterableIterator<K> {
    for (let e = this.header.before; e != this.header; e = e.before) yield e as K;
  }
}
