import { Comparator, Comparators, FluentIterator, IteratorGenerator, Iterators, Mapper } from 'ts-fluent-iterators';
import { PriorityQueue } from '../queues';

interface MergeItem<A> {
  data: A;
  iterator: Iterator<A>;
}

export function* merge_iterators<A>(
  iterators: IteratorGenerator<IteratorGenerator<A>>,
  comparator: Comparator<A> = Comparators.natural
): IterableIterator<A> {
  const q = new PriorityQueue<MergeItem<A>>({ comparator: (item1, item2) => comparator(item1.data, item2.data) });
  FluentIterator.from(iterators)
    .map(iter => Iterators.toIterator(iter))
    .forEach(iter => {
      const item = iter.next();
      if (!item.done) q.add({ data: item.value, iterator: iter });
    });

  for (;;) {
    const dequeued = q.poll();
    if (!dequeued) break;
    yield dequeued.data;
    const item = dequeued.iterator.next();
    if (!item.done) q.add({ data: item.value, iterator: dequeued.iterator });
  }
}

export function mergeIteratorWith<A>(
  iterators: IteratorGenerator<IteratorGenerator<A>>,
  comparator: Comparator<A> = Comparators.natural
): Mapper<Iterator<A>, IterableIterator<A>> {
  return (iterator: Iterator<A>) => merge_iterators(FluentIterator.from(iterators).append([iterator]), comparator);
}
