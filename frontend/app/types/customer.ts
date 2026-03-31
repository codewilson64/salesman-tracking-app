export type Customer = {
  id: string;
  areaId: string;
  areaName: string;
  customerName: string;
  shopName: string;
  phone: string;
  address: string;
  description?: string;
  salesmanId: string;
  salesmanName: string;
  salesmanImage?: string;   
  salesmanImageId?: string;
  customerImage?: string;
  customerImageId?: string;
};

export type GroupedCustomer = {
  salesmanId: string;
  salesmanName: string;
  salesmanImage?: string;
  customers: Customer[];
};