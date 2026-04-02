export type Visit = {
  id: string;

  // relations
  areaId: string;
  areaName: string;

  customerId: string;
  customerName: string;

  salesmanId: string;
  salesmanName: string;
  salesmanImage?: string;
  salesmanImageId?: string;

  // shop info
  shopName: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;

  // status
  status: string;
  visitResult?: string;
  duration: number;

  // images
  checkInImage?: string;
  checkInImageId?: string;

  // timestamps
  checkInAt?: string;
  checkOutAt?: string;

  // notes
  notes?: string;
};

export type GroupedVisit = {
  salesmanId: string;
  salesmanName: string;
  salesmanImage?: string;
  visits: Visit[];
};