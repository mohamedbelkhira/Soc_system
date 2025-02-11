import { useCallback, useEffect, useRef, useState } from "react";

export function useDebounce<T>(
  initialValue: T,
  delay: number,
  onChange: (value: T) => void
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(initialValue);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedSetValue = useCallback((newValue: T) => {
    setValue(newValue);
  }, []);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      onChange(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, onChange]);

  return [value, debouncedSetValue];
}
