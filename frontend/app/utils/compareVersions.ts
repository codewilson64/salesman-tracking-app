export const compareVersions = (current: string, target: string) => {
  const currentParts = current.split(".").map(Number);
  const targetParts = target.split(".").map(Number);

  const maxLength = Math.max(currentParts.length, targetParts.length);

  for (let i = 0; i < maxLength; i++) {
    const currentPart = currentParts[i] ?? 0;
    const targetPart = targetParts[i] ?? 0;

    if (currentPart < targetPart) return -1;
    if (currentPart > targetPart) return 1;
  }

  return 0;
};