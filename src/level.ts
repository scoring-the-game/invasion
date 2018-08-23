let gLevel = 0;

export const increment = () => {
  gLevel += 1;
}

export const get = () => {
  return gLevel;
}
