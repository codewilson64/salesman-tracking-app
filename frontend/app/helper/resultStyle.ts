export const getResultStyle = (result?: string) => {
  switch (result) {
    case "new order":
      return "bg-green-300 text-green-700";
    case "follow-up":
      return "bg-yellow-300 text-yellow-700";
    case "shop closed":
      return "bg-red-300 text-red-700";
    default:
      return "bg-gray-200 text-gray-600";
  }
};

export const getApprovalStyle = (status?: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-700";
    case "rejected":
      return "bg-red-100 text-red-700";
    default:
      return "bg-yellow-100 text-yellow-700"; // pending
  }
};