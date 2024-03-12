export type Constructor<T = object, A extends unknown[] = any[]> = new (...args: A) => T;
export type AbstractConstructor<T = object, A extends unknown[] = any[]> = abstract new (...args: A) => T;
export type ParameterTail<T extends readonly unknown[]> = T extends [unknown, ...infer U] ? U : never;
export type PrependParameter<Type, Arguments extends unknown[]> = Arguments extends []
  ? [Type]
  : [Arguments[0] & Type, ...ParameterTail<Arguments>];
