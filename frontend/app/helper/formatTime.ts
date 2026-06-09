export const formatTime = (dateString?: string | null) => {
  if (!dateString) return "-";

  const date = new Date(dateString);

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const formatDate = (dateString?: string | null) => {
  if (!dateString) return "-";

  const date = new Date(dateString);

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};