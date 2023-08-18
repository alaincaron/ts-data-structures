export interface Entry {
  before: Entry;
  after: Entry;
}

export class DoubleLinkedList {
  private header: Entry;
  constructor() {
    this.header = {} as Entry;
    this.header.before = this.header.after = this.header;
  }

  addLast(e: Entry) {
    this.addBefore(e, this.header);
  }

  addBefore(e: Entry, existingEntry: Entry) {
    e.after = existingEntry;
    e.before = existingEntry.before;
    e.before.after = e;
    e.after.before = e;
  }

  remove(e: Entry) {
    e.before.after = e.after;
    e.after.before = e.before;
  }

  clear() {
    this.header.before = this.header.after = this.header;
  }

  leastRecent() {
    const eldest = this.header.after;
    return eldest === this.header ? undefined : eldest;
  }

  mostRecent() {
    const youngest = this.header.before;
    return youngest === this.header ? undefined : youngest;
  }

  *entries(): IterableIterator<Entry> {
    for (let e = this.header.after; e != this.header; e = e.after) yield e;
  }
}
