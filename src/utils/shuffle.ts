export function shuffle<E>(arr: E[], random?: (n: number) => number): E[] {
  const n = arr.length;
  if (n <= 1) return arr;
  random ??= n => Math.floor(Math.random() * n);
  const n1 = n - 1;
  for (let i = 0; i < n1; ++i) {
    const pos = i + random(n - i);
    const tmp = arr[i];
    arr[i] = arr[pos];
    arr[pos] = tmp;
  }
  return arr;
}
