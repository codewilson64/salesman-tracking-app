export type Area = {
  id: string;
  areaName: string;
  day: string;
  salesmanId: string;
  salesmanName: string;
  salesmanImage?: string;   
  salesmanImageId?: string;
};

export type GroupedArea = {
  salesmanId: string;
  salesmanName: string;
  salesmanImage?: string;
  areas: Area[];
};