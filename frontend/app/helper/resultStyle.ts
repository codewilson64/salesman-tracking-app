export const getResultStyle = (result?: string) => {
  switch (result) {
    case "new order":
      return {
        bg: "bg-green-300",
        text: "text-green-700",
      };
    case "follow-up":
      return {
        bg: "bg-yellow-300",
        text: "text-yellow-700",
      };
    case "shop closed":
      return {
        bg: "bg-red-300",
        text: "text-red-700",
      };
    default:
      return {
        bg: "bg-gray-200",
        text: "text-gray-600",
      };
  }
};