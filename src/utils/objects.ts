export function pick<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  return keys.reduce(
    (acc, val) => {
      if (obj[val] !== undefined) acc[val] = obj[val];
      return acc;
    },
    {} as Pick<T, K>
  );
}
