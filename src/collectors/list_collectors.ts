import { CollectionCollector } from './collection_collectors';
import { ArrayList, LinkedList } from '../lists';
import { ContainerOptions } from '../utils';

export function arrayListCollector<A>(
  arg?: ArrayList<A> | ContainerOptions | number
): CollectionCollector<A, ArrayList<A>> {
  return new CollectionCollector(arg instanceof ArrayList ? arg : new ArrayList(arg));
}

export function linkedListCollector<A>(
  arg?: LinkedList<A> | ContainerOptions | number
): CollectionCollector<A, LinkedList<A>> {
  return new CollectionCollector(arg instanceof LinkedList ? arg : new LinkedList(arg));
}
