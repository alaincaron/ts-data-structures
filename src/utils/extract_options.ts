import { ContainerInitializer } from './container';

export function extractOptions<
  ContainerType extends object,
  Options extends object = object,
  Initializer extends ContainerInitializer<ContainerType> = ContainerInitializer<ContainerType>,
>(initializer?: Options & Initializer) {
  if (!initializer?.initial) {
    return { options: initializer as Options };
  } else {
    const initialElements = initializer.initial;
    const options = { ...initializer, ...buildOptions(initialElements) };
    delete options.initial;
    return { options, initialElements };
  }
}

export function buildOptions(obj?: object) {
  if (obj && 'buildOptions' in obj && typeof obj.buildOptions === 'function') {
    return obj.buildOptions();
  }
  return {};
}
