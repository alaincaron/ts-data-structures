import { PrimitiveSink } from './primitiveSink';

export interface Funnel<T> {
  funnel(t: T, sink: PrimitiveSink): void;
}
