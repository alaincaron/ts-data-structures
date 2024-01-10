import { CollectionCollector } from './collection_collectors';
import { ArrayDeque } from '../deques';
import { PriorityQueue, QueueOptions } from '../queues';

export function arrayDequeCollector<A>(
  arg?: ArrayDeque<A> | QueueOptions | number
): CollectionCollector<A, ArrayDeque<A>> {
  return new CollectionCollector(arg instanceof ArrayDeque ? arg : new ArrayDeque<A>(arg));
}

export function priorityQueueCollector<A>(
  arg?: PriorityQueue<A> | QueueOptions | number
): CollectionCollector<A, PriorityQueue<A>> {
  return new CollectionCollector(arg instanceof PriorityQueue ? arg : new PriorityQueue<A>(arg));
}
