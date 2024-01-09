import { CollectionCollector } from './collection_collectors';
import { ArrayDeque } from '../deques';
import { PriorityQueue, QueueOptions } from '../queues';

export function arrayDequeCollector<A>(arg?: ArrayDeque<A> | QueueOptions): CollectionCollector<A, ArrayDeque<A>> {
  return new CollectionCollector(!arg ? ArrayDeque<A> : arg instanceof ArrayDeque ? arg : new ArrayDeque<A>(arg));
}

export function priorityQueueCollector<A>(
  arg?: PriorityQueue<A> | QueueOptions
): CollectionCollector<A, PriorityQueue<A>> {
  return new CollectionCollector(
    !arg ? PriorityQueue<A> : arg instanceof PriorityQueue ? arg : new PriorityQueue<A>(arg)
  );
}
