import { Collectors, Mapper } from 'ts-fluent-iterators';

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

export function* windowIterator<A, B = A>(
  iter: Iterator<A>,
  collector: WindowCollector<A, B> | Mapper<void, Collectors.Collector<A, B>>,
  windowSize: number,
  flag = true
): IterableIterator<B> {
  if (!Number.isSafeInteger(windowSize) && windowSize < 1) {
    throw new Error(`Invalid window size: ${windowSize}`);
  }
  const factory = typeof collector === 'function' ? (collector as Mapper<void, Collectors.Collector<A, B>>) : undefined;
  const cw = factory ? undefined : (collector as WindowCollector<A, B>);

  const buffer: A[] = [];
  for (;;) {
    const item = iter.next();
    if (item.done) break;
    buffer.push(item.value);
    if (buffer.length > windowSize) {
      const removedItem = buffer.shift();
      if (cw) cw.leaveWindow(removedItem!);
    }
    if (cw) {
      const result = cw.enterWindow(item.value);
      if (flag || buffer.length >= windowSize) yield result;
    } else if (flag || buffer.length >= windowSize) {
      const c = factory!();
      buffer.forEach(x => c.collect(x));
      yield c.result;
    }
  }
}

export function windowIteratorMapper<A, B = A>(
  collector: WindowCollector<A, B> | Mapper<void, Collectors.Collector<A, B>>,
  windowSize: number,
  flag = true
): Mapper<Iterator<A>, Iterator<B>> {
  return (iter: Iterator<A>) => windowIterator(iter, collector, windowSize, flag);
}
