export function useReducedMotion() {
  const prefersReduced = ref(false);

  onMounted(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReduced.value = mql.matches;

    const onChange = (e: MediaQueryListEvent) =>
      (prefersReduced.value = e.matches);
    mql.addEventListener("change", onChange);
    onUnmounted(() => mql.removeEventListener("change", onChange));
  });

  return prefersReduced;
}
