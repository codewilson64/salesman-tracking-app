// hooks/visit/useDateFilteredVisits.ts
import { useMemo, useState, useCallback } from "react";
import { Visit } from "../../types/visit";
import { groupVisitsByDate } from "../../utils/visitDateFilter";

export type DateFilter = {
  startDate: Date | null;
  endDate: Date | null;
};

const getVisitDate = (visit: Visit): Date => {
  const dateStr = visit.checkInAt;   // ← Using checkInAt as per your group function
  if (!dateStr) return new Date(0);
  return new Date(dateStr);
};

export const useDateFilteredVisits = (visits: Visit[] = []) => {
  const [filter, setFilter] = useState<DateFilter>({
    startDate: null,
    endDate: null,
  });

  const filteredVisits = useMemo(() => {
    if (!filter.startDate && !filter.endDate) {
      return visits;
    }

    return visits.filter((visit) => {
      const visitDate = getVisitDate(visit);
      if (isNaN(visitDate.getTime())) return false;

      if (filter.startDate && visitDate < filter.startDate) return false;
      if (filter.endDate && visitDate > filter.endDate) return false;

      return true;
    });
  }, [visits, filter.startDate, filter.endDate]);

  const groupedData = useMemo(() => {
    return groupVisitsByDate(filteredVisits);
  }, [filteredVisits]);

  const setDateRange = useCallback((start: Date | null, end: Date | null) => {
    setFilter({ startDate: start, endDate: end });
  }, []);

  const resetFilter = useCallback(() => {
    setFilter({ startDate: null, endDate: null });
  }, []);

  const hasActiveFilter = !!(filter.startDate || filter.endDate);

  return {
    visitCountByDate: groupedData.visitCountByDate,
    dateList: groupedData.dateList,
    filteredVisits,
    filter,
    setDateRange,
    resetFilter,
    hasActiveFilter,
  };
};