import { api } from "../../libs/axios";

// Notification for reports tab
export const getUnreadVisitsCount = async () => {
  const res = await api.get("/notifications/unread-visits");
  return res.data;
};

export const markVisitsReportsAsRead = async () => {
  const res = await api.patch("/notifications/mark-as-read");
  return res.data;
};


// Notification for reports paid/unpaid menus
export const getTransactionNotificationCounts = async () => {
  const res = await api.get("/notifications/transaction-counts");
  return res.data;
};


// Notification for list of salesman
export const getPaidNotificationCountsBySalesman = async () => {
  const res = await api.get("/notifications/paid/salesman-counts");
  return res.data;
};

export const getUnpaidNotificationCountsBySalesman = async () => {
  const res = await api.get("/notifications/unpaid/salesman-counts");
  return res.data;
};

export const markPaidNotificationsBySalesmanAsRead = async (salesmanId: string) => {
  const res = await api.patch(`/notifications/paid/${salesmanId}/mark-as-read`);
  return res.data;
};

export const markUnpaidNotificationsBySalesmanAsRead = async (salesmanId: string) => {
  const res = await api.patch(`/notifications/unpaid/${salesmanId}/mark-as-read`);
  return res.data;
};
