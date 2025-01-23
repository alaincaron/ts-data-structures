import { PrimitiveSink } from './primitiveSink';

export type Funnel<T> = (t: T, sink: PrimitiveSink) => void;
