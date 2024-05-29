export function shuffle<E>(arr: E[], random: () => number = Math.random): E[] {
  let n = arr.length;
  while (n >= 1) {
    const i = arr.length - n;
    const pos = i + Math.floor(random() * (n - i));
    const tmp = arr[i];
    arr[i] = arr[pos];
    arr[pos] = tmp;
    --n;
  }
  return arr;
}
