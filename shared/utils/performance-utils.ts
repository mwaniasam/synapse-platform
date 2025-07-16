// Performance Utilities
export const performanceUtils = {
  measureTime: <T>(fn: () => T): { result: T; duration: number } => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    return { result, duration: end - start };
  },

  debounce: <T extends (...args: any[]) => any>(fn: T, delay: number): T => {
    let timeoutId: NodeJS.Timeout;
    return ((...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(null, args), delay);
    }) as T;
  },

  throttle: <T extends (...args: any[]) => any>(fn: T, limit: number): T => {
    let inThrottle: boolean;
    return ((...args: Parameters<T>) => {
      if (!inThrottle) {
        fn.apply(null, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }) as T;
  }
};
