import { Collector, iterator, Mapper } from 'ts-fluent-iterators';

export interface WindowCollector<A, B = A> {
  enterWindow(item: A): B;
  leaveWindow(item: A): void;
}

export class SumWindowCollector implements WindowCollector<number> {
  private sum: number;
  private correction = 0;

  constructor(initial = 0) {
    this.sum = initial;
  }

  private add(x: number) {
    const y = x - this.correction;
    const t = this.sum + y;
    this.correction = t - this.sum - y;
    this.sum = t;
    return t;
  }

  enterWindow(x: number) {
    return this.add(x);
  }

  leaveWindow(x: number) {
    return this.add(-x);
  }
}

export class MovingAverageCollector implements WindowCollector<number> {
  private n: number = 0;
  private avg: number = 0;

  enterWindow(x: number) {
    this.avg += (x - this.avg) / ++this.n;
    return this.avg;
  }

  leaveWindow(x: number) {
    if (this.n <= 1) {
      this.avg = this.n = 0;
    } else {
      this.avg -= (x - this.avg) / --this.n;
    }
  }
}

function* windowIteratorFromFactory<A, B>(
  iter: Iterator<A>,
  factory: Mapper<void, Collector<A, B>>,
  windowSize: number,
  flag = true
) {
  const buffer: A[] = [];
  for (;;) {
    const item = iter.next();
    if (item.done) break;
    buffer.push(item.value);
    if (buffer.length > windowSize) {
      buffer.shift();
    }
    if (flag || buffer.length >= windowSize) {
      yield iterator(buffer).collectTo(factory!());
    }
  }
}

function* windowIteratorFromWindowCollector<A, B>(
  iter: Iterator<A>,
  collector: WindowCollector<A, B>,
  windowSize: number,
  flag = true
) {
  const buffer: A[] = [];
  for (;;) {
    const item = iter.next();
    if (item.done) break;
    buffer.push(item.value);
    if (buffer.length > windowSize) {
      const removedItem = buffer.shift();
      collector.leaveWindow(removedItem!);
    }
    const result = collector.enterWindow(item.value);
    if (flag || buffer.length >= windowSize) yield result;
  }
}

export function windowIterator<A, B = A>(
  iter: Iterator<A>,
  collector: WindowCollector<A, B> | Mapper<void, Collector<A, B>>,
  windowSize: number,
  flag = true
): IterableIterator<B> {
  if (!Number.isSafeInteger(windowSize) && windowSize < 1) {
    throw new Error(`Invalid window size: ${windowSize}`);
  }
  if (typeof collector === 'function') {
    return windowIteratorFromFactory(iter, collector as Mapper<void, Collector<A, B>>, windowSize, flag);
  }
  return windowIteratorFromWindowCollector(iter, collector as WindowCollector<A, B>, windowSize, flag);
}

export function windowIteratorMapper<A, B = A>(
  collector: WindowCollector<A, B> | Mapper<void, Collector<A, B>>,
  windowSize: number,
  flag = true
): Mapper<Iterator<A>, Iterator<B>> {
  return (iter: Iterator<A>) => windowIterator(iter, collector, windowSize, flag);
}
