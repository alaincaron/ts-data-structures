import { CollectionCollector } from './collection_collectors';
import { ArrayDeque } from '../deques';
import { PriorityQueue, QueueOptions } from '../queues';
import { WithCapacity } from '../utils';

export function arrayDequeCollector<A>(
  arg?: ArrayDeque<A> | WithCapacity<QueueOptions>
): CollectionCollector<A, ArrayDeque<A>> {
  return new CollectionCollector(arg instanceof ArrayDeque ? arg : ArrayDeque.create(arg));
}

export function priorityQueueCollector<A>(
  arg?: PriorityQueue<A> | WithCapacity<QueueOptions>
): CollectionCollector<A, PriorityQueue<A>> {
  return new CollectionCollector(arg instanceof PriorityQueue ? arg : PriorityQueue.create(arg));
}
