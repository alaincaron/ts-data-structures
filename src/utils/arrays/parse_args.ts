export function parseArgs<F extends object>(
  len: number,
  arg2: number | F | undefined,
  arg3: number | F | undefined,
  arg4: F | undefined,
  defaultFunction: F
) {
  const result = {
    left: 0,
    right: len,
    f: defaultFunction,
  };

  switch (typeof arg2) {
    case 'number':
      result.left = arg2;
      break;
    case 'undefined':
      return result;
    default:
      result.f = arg2 as F;
      return result;
  }

  switch (typeof arg3) {
    case 'number':
      result.right = arg3;
      break;
    case 'undefined':
      return result;
    default:
      result.f = arg3 as F;
      return result;
  }

  if (arg4) {
    result.f = arg4 as F;
  }

  return result;
}
