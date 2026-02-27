import { useEffect, useRef } from "react";

export function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    const el = ref.current;
    if (el) {
      const children = el.querySelectorAll(".fade-up");
      children.forEach((child) => observer.observe(child));
      if (el.classList.contains("fade-up")) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return ref;
}
