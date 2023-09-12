const dateToEpochTimestamp = (date: Date): number => {
  return Math.round(date.getTime() / 1000);
};

export { dateToEpochTimestamp };
