export const units = [
  "pcs",
  "unit",
  "dus",
  "box",
  "karton",
  "pack",
  "sak",
  "karung",
  "kg",
  "gram",
  "liter",
  "meter",
  "m2",
  "set",
] as const;

export type ProductUnit = (typeof units)[number];

export const isProductUnit = (value: string | null | undefined): value is ProductUnit => {
  return units.includes(value as ProductUnit);
};