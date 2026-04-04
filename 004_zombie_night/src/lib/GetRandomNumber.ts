export const getRandomNumber = (a: number, b: number): number => {
  const min = Math.min(a, b);
  const max = Math.max(a, b);

  const start = Math.ceil(min);
  const end = Math.floor(max);

  return Math.floor(Math.random() * (end - start + 1)) + start;
};
