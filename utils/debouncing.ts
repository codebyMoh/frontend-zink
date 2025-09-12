export function debouncing<T extends (...args: any[]) => any>(
  fun: T,
  delay: number
) {
  let timer: ReturnType<typeof setTimeout> | null;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timer as NodeJS.Timeout);
    timer = setTimeout(() => {
      fun.apply(this, args);
    }, delay);
  };
}
