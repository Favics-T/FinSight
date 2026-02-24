import { useEffect, useRef, useState } from 'react';

export function useAnimatedNumber(target: number, duration = 450): number {
  const [value, setValue] = useState<number>(Number(target) || 0);
  const previousRef = useRef<number>(Number(target) || 0);

  useEffect(() => {
    const finalValue = Number(target) || 0;
    const startValue = previousRef.current;
    const startTime = performance.now();
    let raf = 0;

    const tick = (timestamp: number) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      const next = startValue + (finalValue - startValue) * eased;
      setValue(next);
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        previousRef.current = finalValue;
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

export default useAnimatedNumber;
