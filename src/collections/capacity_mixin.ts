import { AbstractConstructor } from '../utils';
import { CollectionOptions, OptionsBuilder } from './types';

export function CapacityMixin<TBase extends AbstractConstructor<OptionsBuilder>>(Base: TBase) {
  abstract class Derived extends Base {
    readonly _capacity: number;

    constructor(...args: any[]) {
      super(...args);
      const arg0 = args[0];
      if (typeof arg0 === 'number') this._capacity = arg0;
      else this._capacity = arg0?.capacity ?? Infinity;
    }

    capacity() {
      return this._capacity;
    }

    buildOptions(): CollectionOptions {
      return {
        ...super.buildOptions(),
        capacity: this._capacity,
      };
    }
  }
  return Derived;
}
