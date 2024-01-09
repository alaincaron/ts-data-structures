import { CollectionCollector } from './collection_collectors';
import { ArrayList, LinkedList } from '../lists';
import { ContainerOptions } from '../utils';

export function arrayListCollector<A>(arg?: ArrayList<A> | ContainerOptions): CollectionCollector<A, ArrayList<A>> {
  return new CollectionCollector(!arg ? ArrayList<A> : arg instanceof ArrayList ? arg : new ArrayList(arg));
}

export function linkedListCollector<A>(arg?: LinkedList<A> | ContainerOptions): CollectionCollector<A, LinkedList<A>> {
  return new CollectionCollector(!arg ? LinkedList<A> : arg instanceof LinkedList ? arg : new LinkedList(arg));
}
