import { ImageSourcePropType } from "react-native";

export type ReportItem = {
  id: number;
  label: string;
  route: string;
  roles: ("owner" | "salesman")[];
  icon: ImageSourcePropType;
};

import paid from "../assets/reportIcons/paid.png";
import unpaid from "../assets/reportIcons/unpaid.png";
import summaryIcon from "../assets/menuIcons/summary.png";

export const ReportMenus = [
  {
    id: 1,
    label: "Paid Transactions",
    route: "screens/reports/paid",
    roles: ["owner", "salesman"],
    icon: paid,
  },
  {
    id: 2,
    label: "Unpaid / Tagihan",
    route: "screens/reports/unpaid",
    roles: ["owner", "salesman"],
    icon: unpaid,
  },
//   {
//     id: 3,
//     label: "Sales Summary",
//     route: "screens/reports/summary",
//     roles: ["owner"], // only admin
//     icon: summaryIcon,
//   },
];