import { CollectionCollector } from './collection_collectors';
import { ArrayDeque } from '../deques';
import { PriorityQueue, QueueOptions } from '../queues';
import { ArrayStack } from '../stacks';
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

export function arrayStackCollector<A>(
  arg?: ArrayStack<A> | WithCapacity<QueueOptions>
): CollectionCollector<A, ArrayStack<A>> {
  return new CollectionCollector(arg instanceof ArrayStack ? arg : ArrayStack.create(arg));
}
