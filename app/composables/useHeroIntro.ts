import { gsap } from "gsap";
import { motion } from "~/utils/motion/tokens";

interface HeroIntroTargets {
  scope: Ref<HTMLElement | null>;
  media: Ref<HTMLElement | null>;
}

export function useHeroIntro({ scope, media }: HeroIntroTargets) {
  const prefersReduced = useReducedMotion();
  let ctx: gsap.Context | null = null;

  onMounted(() => {
    // Wait one tick for Vue to evaluate showVideo conditional rendering
    nextTick(() => {
      if (!scope.value) return;

      ctx = gsap.context(() => {
        const eyebrow = scope.value!.querySelector(".header__eyebrow");
        const heading = scope.value!.querySelector(".header__heading");
        const actions = scope.value!.querySelectorAll(".hero__actions > *");
        const overlay = scope.value!.querySelector(".hero__overlay");
        const navList     = scope.value!.querySelector(".links__list");

        if (prefersReduced.value) {
          gsap.set([eyebrow, heading, actions, overlay, media.value, navList], {
            clearProps: "all",
          });
          return;
        }

        // Safeguard targets before running GSAP set/timeline
        const targetsToHide = [eyebrow, heading].filter(Boolean);
        const mediaTarget = media.value;

        if (mediaTarget) gsap.set(mediaTarget, { scale: 1.08 });
        if (overlay) gsap.set(overlay, { opacity: 0 });
        if (targetsToHide.length)
          gsap.set(targetsToHide, { opacity: 0, y: 24 });
        if (actions.length) gsap.set(actions, { opacity: 0, y: 16 });
        if (navList) gsap.set(navList, {opacity: 0, x: 600});

        const tl = gsap.timeline({ defaults: { ease: motion.ease.out } });

        if (mediaTarget) {
          tl.to(mediaTarget, { scale: 1, duration: motion.duration.heroIntro });
        }

        if (overlay) {
          tl.to(overlay, { opacity: 1, duration: motion.duration.slow }, "<");
        }

        if (eyebrow) {
          tl.to(
            eyebrow,
            { opacity: 1, y: 0, duration: motion.duration.base },
            "-=0.7",
          );
        }

        if (heading) {
          tl.to(
            heading,
            { opacity: 1, y: 0, duration: motion.duration.base },
            "-=0.45",
          );
        }
        if (navList) {
          tl.to(
            navList,
            { opacity: 1, x: 0, duration: motion.duration.base },
            "-=0.45",
          );
        }

        if (actions.length) {
          tl.to(
            actions,
            {
              opacity: 1,
              y: 0,
              duration: motion.duration.base,
              stagger: motion.stagger.tight,
            },
            "-=0.35",
          );
        }
      }, scope.value);
    });
  });

  onUnmounted(() => ctx?.revert());
}
