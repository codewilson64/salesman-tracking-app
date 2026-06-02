import { useMemo, useState, useCallback } from "react";

export type DateFilter = {
  startDate: Date | null;
  endDate: Date | null;
};

type Props<T> = {
  data: T[];
  getDate: (item: T) => string | Date | undefined | null;
};

export const useDateFilter = <T>({ data, getDate }: Props<T>) => {
  const [filter, setFilter] = useState<DateFilter>({
    startDate: null,
    endDate: null,
  });

  const filteredData = useMemo(() => {
    if (!filter.startDate && !filter.endDate) {
      return data;
    }

    return data.filter((item) => {
      const value = getDate(item);

      if (!value) return false;

      const date = new Date(value);

      if (isNaN(date.getTime())) return false;

      if (filter.startDate && date < filter.startDate) return false;
      if (filter.endDate && date > filter.endDate) return false;

      return true;
    });
  }, [data, filter, getDate]);

  const setDateRange = useCallback(
    (startDate: Date | null, endDate: Date | null) => {
      const normalizedStart = startDate
        ? new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate(),
            0,
            0,
            0,
            0
          )
        : null;

      const normalizedEnd = endDate
        ? new Date(
            endDate.getFullYear(),
            endDate.getMonth(),
            endDate.getDate(),
            23,
            59,
            59,
            999
          )
        : null;

      setFilter({
        startDate: normalizedStart,
        endDate: normalizedEnd,
      });
    },
    []
  );

  const resetFilter = useCallback(() => {
    setFilter({
      startDate: null,
      endDate: null,
    });
  }, []);

  return {
    filteredData,
    filter,
    setDateRange,
    resetFilter,
    hasActiveFilter:
      filter.startDate !== null ||
      filter.endDate !== null,
  };
};