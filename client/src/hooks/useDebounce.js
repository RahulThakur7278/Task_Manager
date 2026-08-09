import { useState, useEffect } from 'react';

/**
 * Debounce hook — delays updating value until after specified delay.
 * Useful for search inputs to avoid excessive API calls.
 *
 * @param {*} value - Value to debounce
 * @param {number} delay - Delay in milliseconds (default 300)
 * @returns {*} - Debounced value
 */
const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
