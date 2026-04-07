export const getStartEndOfDay = (date?: string) => {
  if (!date) return {};

  const selected = new Date(date);

  if (isNaN(selected.getTime())) return {};

  const start = new Date(selected);
  start.setHours(0, 0, 0, 0);

  const end = new Date(selected);
  end.setHours(23, 59, 59, 999);

  return {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
  };
};