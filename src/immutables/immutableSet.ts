import { ImmutableCollection } from './immutableCollection';
import { ISet } from '../sets';

export class ImmutableSet<E> extends ImmutableCollection<E> implements ISet<E> {
  constructor(delegate: ISet<E>) {
    super(delegate);
  }

  protected get delegate(): ISet<E> {
    return super.delegate as ISet<E>;
  }

  toSet(): Set<E> {
    return this.delegate.toSet();
  }
}
