"use client";

import { useEffect, useState } from "react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > 500);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      aria-hidden={!isVisible}
      aria-label="Scroll back to top"
      className="glass-button"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 30,
        width: "40px",
        height: "40px",
        padding: 0,
        transition: "opacity 0.3s, transform 0.3s",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(12px)",
        pointerEvents: isVisible ? "auto" : "none",
      }}
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
        <path
          d="M8 12V4M4 8l4-4 4 4"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </svg>
    </button>
  );
};

export default ScrollToTopButton;
