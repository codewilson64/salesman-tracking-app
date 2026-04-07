import { Area, GroupedArea } from "../../types/area";
import { Customer, GroupedCustomer } from "../../types/customer";
import { GroupedVisit, Visit } from "../../types/visit";
import { groupBy } from "./group";

export const groupCustomersBySalesman = (
  customers: Customer[]
): GroupedCustomer[] => {
  const grouped = groupBy(customers, (c) => c.salesmanId);

  return Object.entries(grouped).map(([salesmanId, customers]) => ({
    salesmanId,
    salesmanName: customers[0].salesmanName,
    salesmanImage: customers[0].salesmanImage,
    customers,
  }));
};

export const groupVisitsBySalesman = (
  visits: Visit[]
): GroupedVisit[] => {
  const grouped = groupBy(visits, (v) => v.salesmanId);

  return Object.entries(grouped).map(([salesmanId, visits]) => ({
    salesmanId,
    salesmanName: visits[0].salesmanName,
    salesmanImage: visits[0].salesmanImage,
    visits,
  }));
};

export const groupAreasBySalesman = (
  areas: Area[]
): GroupedArea[] => {
  const grouped = groupBy(areas, (a) => a.salesmanId);

  return Object.entries(grouped).map(([salesmanId, areas]) => ({
    salesmanId,
    salesmanName: areas[0].salesmanName,
    salesmanImage: areas[0].salesmanImage,
    areas,
  }));
};