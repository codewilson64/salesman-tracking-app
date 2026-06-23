import { TVisitInput } from "../../libs/visit.schema";
import { Customer } from "../../types/customer";

export type OfflineVisitInput = {
  data: TVisitInput & {
    checkInLatitude: number;
    checkInLongitude: number;
    checkInGpsAccuracy?: number;
  };
  image?: string | null;
  customer: Customer;
  checkInDistanceMeters: number;
};