<script setup lang="ts">
import { ArrowUpRight } from "lucide-vue-next";
import { useScrollReveal } from '~/composables/useScrollReveal';
interface Highlight {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
}

const highlights: Highlight[] = [
  {
    id: "assembly-automation",
    title: "Assembly Automation",
    description:
      "Fixture-based and robotic assembly systems built for precision, repeatability and high-volume throughput.",
    image: "/images/highlights/assembly_automation.png",
    href: "/capabilities/assembly-automation", // placeholder — confirm real destination
  },
  {
    id: "robotics",
    title: "Robotics",
    description:
      "Robotic handling, integration and process automation engineered around your product and production environment.",
    image: "/images/highlights/robotics.png",
    href: "/capabilities/robotics", // placeholder — confirm real destination
  },
  {
    id: "inspection-testing",
    title: "Inspection & Testing",
    description:
      "Vision inspection, functional testing and end-of-line validation built into every system for full traceability.",
    image: "/images/highlights/inspection_and_testing.png",
    href: "/capabilities/inspection-testing", // placeholder — confirm real destination
  },
  {
    id: "bespoke-machine-systems",
    title: "Bespoke Machine Systems",
    description:
      "Fully custom-engineered machinery designed, built and commissioned in-house from concept through production.",
    image: "/images/highlights/bespoke_machine_systems.png",
    href: "/capabilities/bespoke-machine-systems", // placeholder — confirm real destination
  },
];
// Header animation
const sectionRef = ref<HTMLElement | null>(null); // pin target — whole section, header included
useScrollReveal(sectionRef, ".header__eyebrow, .header__heading, .header__body, .about__link", {
  preset: "fade-up",
  stagger: 0.2,
  start: "top 80%",
});

// List Animation
useScrollReveal(sectionRef, ".highlights__row", {
  preset: "fade-up",
  stagger: 0.3,
  start: "top 80%",
});
// Only bother with the cursor-follow effect on devices that actually have
// hover (mouse/trackpad) — meaningless on touch, and we don't want a phantom
// floating image stuck on screen after a tap.
const supportsHover = ref(false);
onMounted(() => {
  supportsHover.value = window.matchMedia("(hover: hover)").matches;
});

const listRef = ref<HTMLElement | null>(null);
const hoveredId = ref<string | null>(null);
const cursor = reactive({ x: 0, y: 0 });

// Preview image dimensions + cursor offset, kept in sync with the CSS below
const PREVIEW_WIDTH = 260;
const PREVIEW_HEIGHT = 180;
const OFFSET_X = 24;
const OFFSET_Y = -90;

function onListMouseMove(e: MouseEvent) {
  const rect = listRef.value?.getBoundingClientRect();
  if (!rect) return;

  const targetX = e.clientX - rect.left + OFFSET_X;
  const targetY = e.clientY - rect.top + OFFSET_Y;

  // Clamp so the image can never render past the container's edges,
  // regardless of where the cursor is — this is what actually prevents
  // the page-level horizontal scrollbar, not just hiding the symptom.
  cursor.x = Math.min(Math.max(targetX, 0), Math.max(rect.width - PREVIEW_WIDTH, 0));
  cursor.y = Math.min(Math.max(targetY, 0), Math.max(rect.height - PREVIEW_HEIGHT, 0));
}
</script>

<template>
  <section ref="sectionRef" class="section section--base">
    <div class="highlights__content">
      <div class="header highlights__header">
        <div class="header__intro">
          <span class="header__eyebrow">What we build</span>
          <h2 class="header__heading">Capability Highlights</h2>
        </div>

        <p class="header__body">
          From single robotic cells to fully automated production lines, our
          in-house team designs, builds and commissions the systems that keep
          advanced manufacturing running.
        </p>
      </div>

      <div
        ref="listRef"
        class="highlights__list"
        @mousemove="onListMouseMove"
      >
        <NuxtLink
          v-for="item in highlights"
          :key="item.id"
          :to="item.href"
          class="highlights__row"
          :class="{ 'highlights__row--active': hoveredId === item.id }"
          @mouseenter="hoveredId = item.id"
          @mouseleave="hoveredId = null"
        >
          <div class="highlights__text">
            <h3 class="highlights__title">{{ item.title }}</h3>
            <p class="highlights__description">{{ item.description }}</p>
          </div>

          <ArrowUpRight class="highlights__arrow" :size="24" :stroke-width="1.5" />
        </NuxtLink>

        <!-- All 4 preview images mount once and stay in the DOM — only
             opacity toggles on hover, so switching rows never re-fetches
             or re-decodes an image (that was the source of the jank). -->
        <template v-if="supportsHover">
          <img
            v-for="item in highlights"
            :key="item.id"
            :src="item.image"
            :alt="item.title"
            class="highlights__preview"
            :class="{ 'highlights__preview--active': hoveredId === item.id }"
            :style="{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }"
          />
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.highlights__content {
  display: flex;
  flex-direction: column;
}

.highlights__list {
  position: relative; // anchors the cursor-following preview image
  overflow: hidden; // safety net — image is clamped in JS, this just guarantees it
  margin-top: $spacing-xl;
}

.highlights__row {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-lg;
  padding: $spacing-md 0;
  border-top: 1px solid $color-grey-100;
  color: inherit;
  text-decoration: none;
  transition: background-color 0.2s ease;

  &:last-child {
    border-bottom: 1px solid $color-accent-200; // deliberate accent close to the list
  }

  &--active {
    background-color: $color-accent-100; // branded tint, not plain grey
  }
}

.highlights__text {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.highlights__title {
  margin: 0;
  font-family: $font-primary;
  font-weight: $fw-medium;
  font-size: $fs-card-title; // 22px
  color: $color-text-primary;
}

.highlights__description {
  margin: 0;
  max-width: 720px;
  font-family: $font-primary;
  font-size: $fs-body;
  font-weight: $fw-regular;
  color: $color-text-secondary;
}

.highlights__arrow {
  flex-shrink: 0;
  color: $color-text-primary;
}

.highlights__preview {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 260px;
  height: 180px;
  object-fit: cover;
  border-radius: $radius-md;
  pointer-events: none; // never intercepts the row's own hover/click
  opacity: 0;
  transition: opacity 0.2s ease;
  will-change: transform, opacity;

  &--active {
    opacity: 1;
  }

  @include mobile {
    display: none; // never show the floating preview at mobile widths,
                    // regardless of hover capability — see note above
  }
}
</style>