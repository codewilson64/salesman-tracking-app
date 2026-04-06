import staff from '../assets/menuIcons/staff.png'
import products from '../assets/menuIcons/products.png'
import areas from '../assets/menuIcons/areas.png'
import customers from '../assets/menuIcons/customers.png'
import salesVisits from '../assets/menuIcons/sales-visits.png'
import visits from '../assets/menuIcons/visits.png'

import { ImageSourcePropType } from 'react-native'

export type MenuItem = {
  id: number;
  label: string;
  route: string;
  roles: ("owner" | "salesman")[];
  icon: ImageSourcePropType;
};

export const Menus = [
  {
    id: 1,
    label: "Salesmen staff",
    route: "screens/salesmen",
    roles: ["owner"],
    icon: staff,
  },
  {
    id: 2,
    label: "Products",
    route: "screens/products",
    roles: ["owner"],
    icon: products,
  },
  {
    id: 3,
    label: "Areas",
    route: "screens/areas",
    roles: ["owner", "salesman"],
    icon: areas,
  },
  {
    id: 4,
    label: "Customers",
    route: "screens/customers",
    roles: ["owner", "salesman"],
    icon: customers,
  },
  {
    id: 5,
    label: "Visits",
    route: "screens/visits",
    roles: ["salesman"],
    icon: visits, 
  },
  {
    id: 6,
    label: "Sales visits",
    route: "screens/sales-visits",
    roles: ["owner"],
    icon: salesVisits,
  },
];