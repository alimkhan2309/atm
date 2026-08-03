import { gsap } from "gsap";
import { motion } from "~/utils/motion/tokens";

type RevealPreset = "fade-up" | "fade-in" | "scale-in";

interface ScrollRevealOptions {
  preset?: RevealPreset;
  start?: string;
  stagger?: number;
  once?: boolean;
}

const presets: Record<RevealPreset, gsap.TweenVars> = {
  "fade-up": { y: 32, opacity: 0 },
  "fade-in": { opacity: 0 },
  "scale-in": { scale: 0.94, opacity: 0 },
};

export function useScrollReveal(
  scopeRef: Ref<HTMLElement | null>,
  selector: string,
  options: ScrollRevealOptions = {},
) {
  const prefersReduced = useReducedMotion();
  let ctx: gsap.Context | null = null;

  onMounted(() => {
    if (!scopeRef.value) return;

    ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>(selector);
      if (!targets.length) return;

      if (prefersReduced.value) {
        gsap.set(targets, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      gsap.from(targets, {
        ...presets[options.preset ?? "fade-up"],
        duration: motion.duration.base,
        ease: motion.ease.out,
        stagger: options.stagger ?? motion.stagger.base,
        scrollTrigger: {
          trigger: scopeRef.value,
          start: options.start ?? "top 80%",
          once: options.once ?? true,
        },
      });
    }, scopeRef.value);
  });

  onUnmounted(() => ctx?.revert());
}
