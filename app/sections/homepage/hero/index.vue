<script setup lang="ts">
import UiHeader from "~/components/ui/Header.vue";
import UiButton from "~/components/ui/Button.vue";

// Only load/play the video when it makes sense to:
// - not on mobile (autoplaying video is a real bandwidth/battery cost, and
//   the hero is already a static-feeling composition at that size)
// - not if the user has prefers-reduced-motion set (accessibility, not optional)
// In both skip cases we fall back to the original static hero image instead.
const showVideo = ref(false);
const videoRef = ref<HTMLVideoElement | null>(null);
const heroRef = ref<HTMLElement | null>(null);

useHeroIntro({ scope: heroRef, media: videoRef });

onMounted(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const isMobileViewport = window.matchMedia("(max-width: 599px)").matches;

  showVideo.value = !prefersReducedMotion && !isMobileViewport;

  // Some browsers only honor autoplay if `muted` is set as a DOM property,
  // not just the HTML attribute — belt and suspenders.
  if (videoRef.value) {
    videoRef.value.muted = true;
  }
});
</script>

<template>
  <section class="hero" ref="heroRef">
    <video
      v-if="showVideo"
      ref="videoRef"
      class="hero__media"
      src="/hero-player.mp4"
      poster="/images/hero.jpg"
      autoplay
      muted
      loop
      playsinline
      preload="auto"
    />
    <img
      v-else
      ref="videoRef"
      class="hero__media"
      src="/images/hero-mobile.png"
      alt="ATM Automation robotic assembly system in operation"
      loading="eager"
      fetchpriority="high"
    />

    <div class="hero__overlay" />

    <div class="hero__container">
      <UiHeader
        hero
        eyebrow="Concept to commissioning"
        heading="Bespoke automation systems for advanced manufacturing"
      />

      <div class="hero__actions">
        <UiButton class="hero-button" href="/contact" variant="primary">Discuss Your Project</UiButton>
        <UiButton class="hero-button" href="/services" variant="secondary">See Our Work</UiButton>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
  padding: $section-padding-y $section-padding-x;
  display: block;

  @include below-desktop {
    padding: $section-padding-y-tablet $section-padding-x-tablet;
    height: 640px;
  }

  @include mobile {
    // padding: $section-padding-y-mobile $section-padding-x-mobile;
    padding: $section-padding-y-mobile 0;
    min-height: 560px;
  }
}

// Shared positioning for whichever element is rendered — video or img
.hero__media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

// Figma: linear overlay, black 20% at 38% stop -> black 100% at 96% stop.
// Darkest at the bottom, where the content sits, for text legibility.
.hero__overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0.5) 38%,
    rgba(0, 0, 0, 1) 96%
  );
}

.hero__container {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: $spacing-lg;

  @include below-desktop {
    padding: $spacing-xl $spacing-lg $spacing-md;
    flex-direction: column;
    justify-content: flex-end;
    gap: $spacing-lg;
    align-items: flex-start;
  }

  @include mobile {
    padding: $spacing-lg $spacing-md $spacing-xs;
  }
}

.hero__actions {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  flex-shrink: 0;

  @include below-desktop {
    width: 100%;
  }
  @include mobile {
    align-items: start;
    gap: $spacing-xs;
    flex-direction: column;
  }
}

.hero__link {
  color: $color-bg-base;
  font-weight: $fw-medium;
  font-size: $fs-body;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: $color-bg-base;
  }
}
.hero-button {
  @include mobile {
    width: 100%;
  }
}
</style>