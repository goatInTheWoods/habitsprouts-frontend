export const debounce = (func: $TSFixMe, wait: $TSFixMe) => {
  let timeout: $TSFixMe;

  return function executedFunction(...args: $TSFixMe[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
