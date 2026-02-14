export const px = (value: number | string): string => {
  let token = value.toString();

  if (typeof value === "number") {
    token = `${value}px`;
  }

  return token;
};

export const deg = (value: number): string => {
  let token = value.toString();

  if (typeof value === "number") {
    token = `${value}deg`;
  }

  return token;
};
