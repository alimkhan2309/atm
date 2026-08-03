import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Ref } from "vue";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function useNumber(statsRef: Ref<HTMLElement | null>) {
  let ctx: gsap.Context | null = null;

  onMounted(() => {
    // Timeout buffer to ensure Nuxt finishes DOM paint & font swapping
    setTimeout(() => {
      if (!statsRef.value) return;

      ctx = gsap.context((self) => {
        const q = self.selector!;
        const statItems = q(".about__stat");

        const prefersReduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        if (prefersReduced) return;

        // Hide items initially before scroll trigger fires
        gsap.set(statItems, { opacity: 0, y: 30 });

        // Build ScrollTrigger timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: statsRef.value,
            start: "top 85%", // Triggers when the top of the stats section hits 85% of the screen
            once: true, // Runs once and stays visible
          },
        });

        // 1. Fade & Slide up the stat containers in sequence
        tl.to(statItems, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out",
        });

        // 2. Animate the number counting up for each stat element
        statItems.forEach((statEl) => {
          const valueEl = statEl.querySelector(".about__stat-value");
          if (!valueEl) return;

          const rawText = valueEl.textContent?.trim() || "";

          // Parse prefix ($), number (150 or 99.5), and suffix (+, %, k)
          const match = rawText.match(/^([^\d]*)([\d,.]+)(.*)$/);
          if (!match) return;

          const prefix = match[1] || "";
          const targetNum = parseFloat(match[2].replace(/,/g, ""));
          const suffix = match[3] || "";
          const decimals = (match[2].split(".")[1] || "").length;

          if (isNaN(targetNum)) return;

          const counter = { val: 0 };

          // Count up animation tied to the main timeline
          tl.to(
            counter,
            {
              val: targetNum,
              duration: 1.8,
              ease: "power2.out",
              onUpdate: () => {
                const currentFormatted = counter.val.toFixed(decimals);
                valueEl.textContent = `${prefix}${currentFormatted}${suffix}`;
              },
            },
            "<", // Starts concurrently with the item stagger fade-in
          );
        });
      }, statsRef.value);
    }, 50);
  });

  onUnmounted(() => {
    ctx?.revert(); // Safely cleans up ScrollTrigger & GSAP contexts on unmount
  });
}
