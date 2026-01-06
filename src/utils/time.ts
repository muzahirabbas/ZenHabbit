
export const getCurrentDate = (): Date => {
  return new Date();
};

export const getIsoDate = (): string => {
  return getCurrentDate().toISOString().split('T')[0];
};