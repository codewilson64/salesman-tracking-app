export const createLocalId = () => {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};