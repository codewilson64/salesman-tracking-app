import { api } from "../../libs/axios";

export const getUnreadVisitsCount = async () => {
  const res = await api.get("/notifications/unread-visits");
  return res.data;
};

export const getTransactionNotificationCounts = async () => {
  const res = await api.get("/notifications/transaction-counts");
  return res.data;
};

export const markVisitsReportsAsRead = async () => {
  const res = await api.patch("/notifications/mark-as-read");
  return res.data;
};

export const markPaidNotificationsAsRead = async () => {
    const res = await api.patch("/notifications/paid/mark-as-read");
    return res.data;
  };

export const markUnpaidNotificationsAsRead = async () => {
    const res = await api.patch("/notifications/unpaid/mark-as-read");
    return res.data;
  };
