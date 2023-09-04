export namespace DoubleLinkedList {
  export interface Entry {
    before: Entry;
    after: Entry;
  }
}

export class DoubleLinkedList {
  public readonly header: DoubleLinkedList.Entry;
  constructor() {
    this.header = {} as DoubleLinkedList.Entry;
    this.header.before = this.header.after = this.header;
  }

  addLast(e: DoubleLinkedList.Entry) {
    this.addBefore(e, this.header);
  }

  addBefore(e: DoubleLinkedList.Entry, existingEntry: DoubleLinkedList.Entry) {
    e.after = existingEntry;
    e.before = existingEntry.before;
    e.before.after = e;
    e.after.before = e;
  }

  remove(e: DoubleLinkedList.Entry) {
    e.before.after = e.after;
    e.after.before = e.before;
  }

  clear() {
    this.header.before = this.header.after = this.header;
  }

  first() {
    const eldest = this.header.after;
    return eldest === this.header ? undefined : eldest;
  }

  last() {
    const youngest = this.header.before;
    return youngest === this.header ? undefined : youngest;
  }

  *entries(): IterableIterator<DoubleLinkedList.Entry> {
    for (let e = this.header.after; e != this.header; e = e.after) yield e;
  }

  *entriesReversed(): IterableIterator<DoubleLinkedList.Entry> {
    for (let e = this.header.before; e != this.header; e = e.before) yield e;
  }
}
