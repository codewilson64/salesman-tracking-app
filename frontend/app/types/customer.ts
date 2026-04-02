export type Customer = {
  id: string;
  areaId: string;
  areaName: string;
  customerName: string;
  shopName: string;
  phone: string;
  address: string;
  description?: string;
  latitude: number;
  longitude: number;
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