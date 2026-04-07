import { Visit } from "../types/visit";

export const groupVisitsByDate = (visits: Visit[]) => {
  const visitCountByDate: Record<string, number> = {};

  visits.forEach((visit) => {
    if (!visit.checkInAt) return;

    const date = new Date(visit.checkInAt).toLocaleDateString("en-CA");

    visitCountByDate[date] = (visitCountByDate[date] || 0) + 1;
  });

  const dateList = Object.keys(visitCountByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return { visitCountByDate, dateList };
};