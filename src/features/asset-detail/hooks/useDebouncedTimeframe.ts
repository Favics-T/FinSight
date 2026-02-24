import { useEffect, useState } from 'react';
import type { Timeframe } from '../types';

export function useDebouncedTimeframe(value: Timeframe, delay = 300): Timeframe {
  const [debounced, setDebounced] = useState<Timeframe>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default useDebouncedTimeframe;
