export function parseArgs<E, F>(
  arr: E[],
  arg2: number | F | undefined,
  arg3: number | F | undefined,
  arg4: F | undefined,
  defaultFunction: F
) {
  const result = {
    left: 0,
    right: arr.length,
    f: defaultFunction,
  };

  switch (typeof arg2) {
    case 'number':
      result.left = arg2;
      break;
    case 'function':
      result.f = arg2 as F;
      return result;
    default:
      return result;
  }

  switch (typeof arg3) {
    case 'number':
      result.right = arg3;
      break;
    case 'function':
      result.f = arg3 as F;
      return result;
    default:
      return result;
  }

  if (typeof arg4 === 'function') {
    result.f = arg4 as F;
  }

  return result;
}
