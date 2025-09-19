export function isMoreThanOneHourAgo(
  inputTime: string | Date | number
): boolean {
  const now = new Date();
  const givenTime = new Date(inputTime);

  // Difference in milliseconds
  const diffMs = now.getTime() - givenTime.getTime();

  // 1 hour = 3600000 ms
  return diffMs > 3600000;
}
