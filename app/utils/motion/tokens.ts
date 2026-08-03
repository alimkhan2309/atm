export const motion = {
  duration: {
    fast: 0.35,
    base: 0.6,
    slow: 0.9,
    heroIntro: 1.1,
  },
  ease: {
    out: "cubic-bezier(0.16, 1, 0.3, 1)", // signature "settle" ease — reveals, intros
    inOut: "cubic-bezier(0.65, 0, 0.35, 1)", // matches the nav curtain you already built
    linear: "none", // scrub-driven only — the Journey rail
  },
  stagger: {
    tight: 0.06,
    base: 0.1,
  },
} as const;
