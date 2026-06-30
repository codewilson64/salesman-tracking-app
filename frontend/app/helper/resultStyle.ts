export const getResultStyle = (result?: string) => {
  switch (result) {
    case "Order Baru":
      return {
        bg: "bg-green-200",
        text: "text-green-700",
      };
    case "Titip Baru":
      return {
        bg: "bg-purple-200",
        text: "text-purple-700",
      };
    case "Update Titipan":
      return {
        bg: "bg-indigo-200",
        text: "text-indigo-700",
      };
    case "Follow Up":
      return {
        bg: "bg-yellow-200",
        text: "text-yellow-700",
      };
    case "Tutup Toko":
      return {
        bg: "bg-red-200",
        text: "text-red-700",
      };
    default:
      return {
        bg: "bg-gray-200",
        text: "text-gray-600",
      };
  }
};