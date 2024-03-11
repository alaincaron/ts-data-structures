import { ContainerInitializer } from './types';

export function extractOptions<
  ContainerType extends object,
  Options extends object = object,
  Initializer extends ContainerInitializer<ContainerType> = ContainerInitializer<ContainerType>,
>(initializer?: Options & Initializer) {
  if (!initializer?.initial) {
    return { options: initializer as Options };
  } else {
    const initialElements = initializer.initial;
    let options: any = {
      ...initializer,
    };

    if ('buildOptions' in initialElements && typeof initialElements.buildOptions === 'function') {
      options = { ...options, ...initialElements.buildOptions() };
    }
    delete options.initial;
    return { options, initialElements };
  }
}
