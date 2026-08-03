<script setup lang="ts">
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import journeyData from "~/data/journey.json";

const steps = [...journeyData.journey].sort((a, b) => a.order - b.order);

const sectionRef = ref<HTMLElement | null>(null); // pin target — whole section, header included
const viewportRef = ref<HTMLElement | null>(null); // fixed-width visible window
const trackRef = ref<HTMLElement | null>(null); // the wide flex row of cards, gets translated

const indicatorWidth = ref(20);
const indicatorOffset = ref(0);
const isPinned = ref(false); // true only when the desktop scroll-jack is active

// Native scroll indicator — only relevant on mobile/tablet, where the rail
// still scrolls normally via the browser's own horizontal scrollLeft.
function updateScrollIndicatorNative() {
  const viewport = viewportRef.value;
  if (!viewport || isPinned.value) return;

  const maxScroll = viewport.scrollWidth - viewport.clientWidth;
  if (maxScroll <= 0) {
    indicatorWidth.value = 100;
    indicatorOffset.value = 0;
    return;
  }

  const share = viewport.clientWidth / viewport.scrollWidth;
  const progress = viewport.scrollLeft / maxScroll;
  indicatorWidth.value = Math.max(20, share * 100);
  indicatorOffset.value = progress * (100 - indicatorWidth.value);
}

let mm: gsap.MatchMedia | null = null;

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger); // no-op if already registered by the global plugin, safe either way

  updateScrollIndicatorNative();

  mm = gsap.matchMedia();

  // Desktop only — see note above on why mobile/tablet are excluded.
  mm.add("(min-width: 1440px)", () => {
    const viewport = viewportRef.value;
    const track = trackRef.value;
    if (!viewport || !track) return;

    const distance = track.scrollWidth - viewport.clientWidth;
    if (distance <= 0) return; // nothing to scroll — don't pin for no reason

    isPinned.value = true;

    // Share of content visible at once — fixed for the duration of the
    // pin, only the offset moves as the user scrolls.
    indicatorWidth.value = Math.max(20, (viewport.clientWidth / track.scrollWidth) * 100);

    const tween = gsap.to(track, {
      x: -distance,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.value,
        start: "top top",
        end: () => `+=${distance}`, // vertical scroll distance needed to fully reveal the track
        pin: true, // this is what "locks" vertical scroll until the horizontal scroll finishes
        scrub: 1, // ties progress directly to scroll position, with slight smoothing
        invalidateOnRefresh: true, // recalculates `distance` correctly on resize
        onUpdate: (self) => {
          indicatorOffset.value = self.progress * (100 - indicatorWidth.value);
        },
      },
    });

    // GSAP calls this automatically when the breakpoint stops matching
    // (resize below 1440px) or the component unmounts — resets everything
    // back to a normal, native-scrollable state.
    return () => {
      isPinned.value = false;
      gsap.set(track, { x: 0 });
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  });
});

onUnmounted(() => {
  mm?.revert();
});
</script>

<template>
  <section ref="sectionRef" class="section section--base">
    <div class="journey__content">
      <div class="journey__header">
        <div class="journey__header-intro">
          <span class="header__eyebrow">How we work</span>
          <h2 class="header__heading">From Concept to Commissioning</h2>
        </div>

        <p class="journey__header-description header__body">
          ATM Automation supports customers from early process understanding and proof-of-principle trials through to machine design, build, testing, installation and production support.
        </p>
      </div>

      <div class="scroll-rail">
        <div class="scroll-rail__indicator">
          <div
            class="scroll-rail__indicator-thumb"
            :style="{
              width: `${indicatorWidth}%`,
              transform: `translateX(${indicatorOffset}%)`,
            }"
          />
        </div>

        <div
          ref="viewportRef"
          class="scroll-rail__viewport journey__steps"
          :class="{ 'journey__steps--pinned': isPinned }"
          @scroll="updateScrollIndicatorNative"
        >
          <div ref="trackRef" class="journey__track">
            <Card
              v-for="step in steps"
              :key="step.id"
              :number="step.step"
              :title="step.title"
              :description="step.description"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.journey__content {
  display: flex;
  flex-direction: column;
  gap: $spacing-xl;
}

.journey__header {
  display: flex;
  gap: $spacing-lg;
  align-items: flex-end;

  @include below-desktop {
    flex-direction: column;
    align-items: stretch;
  }
}

.journey__header-intro,
.journey__header-description {
  flex: 1 1 0;
}

.journey__header-description {
  margin: 0;
  color: $color-text-secondary;
}

.journey__steps {
  // Default (mobile/tablet): native horizontal scroll, same as before.
  overflow-x: auto;
  padding-bottom: $spacing-xs;
  scroll-snap-type: x proximity;
  scroll-behavior: smooth;
  touch-action: pan-x;

  // Desktop, once pinned: GSAP drives movement via transform instead —
  // native scroll needs to be off, or the two would fight each other.
  &--pinned {
    overflow: hidden;
    scroll-snap-type: none;
    touch-action: auto;
  }
}

.journey__track {
  display: flex;
  gap: $spacing-md;
  width: max-content; // lets the track be exactly as wide as all cards combined
}
</style>