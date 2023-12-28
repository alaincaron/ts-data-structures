import { Factory } from './types';
export { Factory } from './types';

export function buildObject<T>(t: Factory<T>): T {
  if (typeof t === 'function') return (t as () => T)();
  return t;
}
