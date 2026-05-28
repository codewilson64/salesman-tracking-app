import { Visit } from "../types/visit";

export const groupVisitsByDate = (visits: Visit[]) => {
  const visitCountByDate: Record<string, number> = {};

  visits.forEach((visit) => {
    if (!visit.checkInAt) return;

    const d = new Date(visit.checkInAt);

    const date =
      `${d.getFullYear()}-` +
      `${String(d.getMonth() + 1).padStart(2, "0")}-` +
      `${String(d.getDate()).padStart(2, "0")}`;

    visitCountByDate[date] = (visitCountByDate[date] || 0) + 1;
  });

  const dateList = Object.keys(visitCountByDate).sort(
    (a, b) => b.localeCompare(a)
  );

  return { visitCountByDate, dateList };
};