import { api } from "../../libs/axios";

export const getUnreadVisitsCount = async () => {
  const res = await api.get("/notifications/unread-visits");
  return res.data;
};

export const markVisitsReportsAsRead = async () => {
  const res = await api.patch("/notifications/mark-as-read");
  return res.data;
};