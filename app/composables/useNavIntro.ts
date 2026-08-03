import { gsap } from "gsap";
import type { Ref } from "vue";

export function useNavIntro(navbarRef: Ref<HTMLElement | null>) {
  let ctx: gsap.Context | null = null;

  onMounted(() => {
    setTimeout(() => {
      if (!navbarRef.value) return;

      ctx = gsap.context((self) => {
        const q = self.selector!;

        const logo = q(".logo");
        const linksWrapper = q(".links");
        const listItems = q(".links__list li");
        const cta = q(".links__cta");
        const burger = q(".burger");

        const prefersReduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        if (prefersReduced) return;

        // 1. Initial hidden states
        if (logo.length) gsap.set(logo, { opacity: 0, y: -20 });
        if (cta.length) gsap.set(cta, { opacity: 0, x: 20 });
        if (listItems.length) gsap.set(listItems, { opacity: 0, y: 15 });
        if (burger.length) gsap.set(burger, { opacity: 0, scale: 0.5 });

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // SEQUENCE 1: Logo Drops In
        if (logo.length) {
          tl.to(logo, { opacity: 1, y: 0, duration: 0.5 });
        }

        // SEQUENCE 2: Wrapper Pill Expands
        if (
          linksWrapper.length &&
          window.getComputedStyle(linksWrapper[0]).display !== "none"
        ) {
          const naturalWidth =
            linksWrapper[0].getBoundingClientRect().width || 400;

          tl.fromTo(
            linksWrapper,
            { width: 48, opacity: 0 },
            {
              width: naturalWidth,
              opacity: 1,
              duration: 0.7,
              ease: "power4.inOut",
            },
            "-=0.3",
          );
        }

        // SEQUENCE 3: CTA Button Loads FIRST
        if (cta.length) {
          tl.to(cta, { opacity: 1, x: 0, duration: 0.4 }, "-=0.2");
        }

        // SEQUENCE 4: Links Stagger from LAST to FIRST ("About" -> "Home")
        if (listItems.length) {
          tl.to(
            listItems,
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              stagger: {
                each: 0.05,
                from: "end", // <--- Starts animation from the last item down to the first
              },
            },
            "-=0.2",
          );
        }

        // SEQUENCE 5: Mobile Burger Pops In (if mobile view)
        if (
          burger.length &&
          window.getComputedStyle(burger[0]).display !== "none"
        ) {
          tl.to(
            burger,
            { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.5)" },
            "-=0.3",
          );
        }

        // SEQUENCE 6: Clean up GSAP inline styles when finished
        tl.add(() => {
          gsap.set([linksWrapper, listItems, cta, logo], { clearProps: "all" });
        });
      }, navbarRef.value);
    }, 50);
  });

  onUnmounted(() => {
    ctx?.revert();
  });
}
