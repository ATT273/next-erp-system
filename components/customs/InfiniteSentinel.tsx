import { useEffect, useRef } from "react";

interface InfiniteSentinelProps {
  onIntersect: () => void;
  enabled?: boolean;
}

const InfiniteSentinel = ({ onIntersect, enabled = true }: InfiniteSentinelProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = ref.current;
    if (!target || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersect();
        }
      },
      { threshold: 1 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [onIntersect, enabled]);

  return <div ref={ref} />;
};

export default InfiniteSentinel;
