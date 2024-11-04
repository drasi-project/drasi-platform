export const isTruthy = (value: string) => {
  return ['true', 't', 'yes', 'y', 'on', '1'].includes(
    value.trim().toLowerCase(),
  );
};
