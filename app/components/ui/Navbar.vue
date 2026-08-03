<script setup lang="ts">
import { useNavIntro } from "~/composables/useNavIntro";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Industries", to: "/industries" },
  { label: "Capabilities", to: "/capabilities" },
  { label: "Projects", to: "/projects" },
  { label: "VR Suite", to: "/vr-suite" },
  { label: "About", to: "/about" },
];

const isMenuOpen = ref(false);
const isInHero = ref(true);
const isMobile = ref(false);
const navbarRef = ref<HTMLElement | null>(null);
const linksListRef = ref<HTMLElement | null>(null);

// Real width of the nav list, measured from the DOM instead of guessed.
// Falls back to a sane default before the first measurement runs.
const listWidth = ref(800);

let observer: IntersectionObserver | null = null;

function checkMobile() {
  isMobile.value = window.matchMedia("(max-width: 1439px)").matches;
}
// Intro animation:
useNavIntro(navbarRef);
// scrollWidth reflects the list's full natural (unwrapped) width even
// while it's visually clipped by max-width/overflow — this keeps the
// "hug" target accurate no matter how many nav links exist, instead of a
// guessed pixel cap that clips as soon as more links get added.
function measureListWidth() {
  const el = linksListRef.value;
  if (!el) return;
  listWidth.value = el.scrollWidth;
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

function closeMenu() {
  isMenuOpen.value = false;
}

function handleClickOutside(e: MouseEvent) {
  if (isMenuOpen.value && navbarRef.value && !navbarRef.value.contains(e.target as Node)) {
    // Ignore clicks landing inside the teleported mobile panel — it's no
    // longer a DOM descendant of navbarRef once teleported to <body>.
    const panel = document.querySelector(".mobile-panel");
    if (panel && panel.contains(e.target as Node)) return;
    closeMenu();
  }
}

function handleEscape(e: KeyboardEvent) {
  if (e.key === "Escape") closeMenu();
}

const showLinks = computed(() => (isMobile.value ? isMenuOpen.value : isInHero.value || isMenuOpen.value));

// Lock page scroll while the mobile panel is open.
watch(isMenuOpen, (open) => {
  if (isMobile.value) {
    document.body.style.overflow = open ? "hidden" : "";
  }
});

onMounted(() => {
  checkMobile();
  measureListWidth();

  // Custom fonts (PP Neue Montreal etc.) load via @font-face with
  // font-display: swap — the list can measure a few px narrower before
  // the real font swaps in, so re-measure once fonts are actually ready.
  document.fonts?.ready.then(measureListWidth);

  window.addEventListener("resize", checkMobile);
  window.addEventListener("resize", measureListWidth);
  document.addEventListener("click", handleClickOutside);
  document.addEventListener("keydown", handleEscape);

  const heroEl = document.querySelector(".hero");
  if (heroEl) {
    observer = new IntersectionObserver(
      ([entry]) => {
        isInHero.value = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(heroEl);
  } else {
    isInHero.value = false;
  }
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
  window.removeEventListener("resize", measureListWidth);
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("keydown", handleEscape);
  document.body.style.overflow = "";
  observer?.disconnect();
});
</script>

<template>
  <nav ref="navbarRef" class="navbar">
    <NuxtLink to="/" class="logo" @click="closeMenu">
      <img
        src="/images/logo.png"
        alt="ATM Automation"
        class="logo__image"
        :class="{ 'img--collapsed': !showLinks }"
      />
    </NuxtLink>

    <!-- Desktop pill: hover-expand nav, unchanged behavior, hidden entirely on mobile -->
    <div class="links" :class="{ 'links--collapsed': !showLinks }">
      <ul ref="linksListRef" class="links__list" :style="{ '--list-width': `${listWidth}px` }">
        <li v-for="(link, i) in navLinks" :key="link.to" :style="{ '--i': navLinks.length - i }">
          <NuxtLink :to="link.to" @click="closeMenu">{{ link.label }}</NuxtLink>
        </li>
      </ul>

      <button type="button" class="btn btn--primary links__cta">Get a Quote</button>
    </div>

    <!-- Independent trigger — never nested inside anything it controls,
         so its position never depends on that element's own layout. -->
    <button
      type="button"
      class="burger"
      :class="{ 'burger--open': isMenuOpen }"
      :aria-expanded="isMenuOpen"
      aria-label="Toggle navigation menu"
      @click="toggleMenu"
    >
      <span class="burger__line" />
      <span class="burger__line" />
      <span class="burger__line" />
    </button>

    <Teleport to="body">
      <Transition name="panel" :duration="{ enter: 450, leave: 500 }">
        <div v-if="isMobile && isMenuOpen" class="mobile-panel">
          <div class="mobile-panel__backdrop" />

          <ul class="mobile-panel__list">
            <li v-for="link in navLinks" :key="link.to">
              <NuxtLink :to="link.to" @click="closeMenu">{{ link.label }}</NuxtLink>
            </li>
          </ul>

          <button type="button" class="btn btn--primary mobile-panel__cta" @click="closeMenu">
            Get a Quote
          </button>
        </div>
      </Transition>
    </Teleport>
  </nav>
</template>

<style scoped lang="scss">
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 2000; // above .mobile-panel, so the burger/X stays clickable while it's open
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-md $spacing-lg;
}

.logo {
  display: block;
  line-height: 0;
}

.logo__image {
  height: 32px;
  width: auto;
}

// ==========================================================================
// Desktop pill (unchanged behavior — hover-expand, hidden below-desktop)
// ==========================================================================

.links {
  position: relative;
  width: fit-content;
  display: flex;
  padding: $spacing-xs $spacing-sm;
  justify-content: flex-end;
  align-items: center;
  gap: $spacing-sm;
  background-color: $color-bg-dark;
  border-radius: $radius-md;
  height: fit-content;
  overflow: hidden;
}

.links__list {
  display: flex;
  align-items: center;
  gap: $spacing-2xs;
  list-style: none;
  margin: 0;
  margin-right: $spacing-2xs;
  padding: 0 $spacing-2xs 0 $spacing-md;
  height: fit-content;
  // Hugs the list's actual measured width instead of a guessed cap —
  // stays correct regardless of how many links exist.
  max-width: var(--list-width, 800px);
  overflow: hidden;
  white-space: nowrap;
  transition: max-width 0.35s ease, opacity 0.25s ease;

  li {
    padding: $spacing-sm $spacing-md;
    border-radius: $radius-sm;
    opacity: 1;
    transition: background-color 0.2s ease;

    a {
      text-decoration: none;
      color: $color-bg-base;
      font-family: $font-primary;
      font-size: $fs-body;
      white-space: nowrap;
    }

    &:hover {
      background-color: $color-grey-800;

      a {
        color: $color-accent-400;
      }
    }
  }
}

.links__cta {
  flex-shrink: 0;
  border-radius: 0 $radius-md $radius-md 0;
  white-space: nowrap;
}

.img--collapsed {
  display: none;
}

.links--collapsed {
  padding-left: 0;

  .links__list {
    max-width: 0;
    padding-left: 0;
    padding-right: 0;
    opacity: 0;

    li {
      opacity: 0;
    }
  }

  @include desktop-up {
    &:hover {
      .links__list {
        max-width: var(--list-width, 480px); // also hugs, was hardcoded before
        padding: 0 $spacing-2xs 0 $spacing-md;
        opacity: 1;

        li {
          opacity: 1;
        }
      }
    }
  }
}

// ==========================================================================
// Burger — independent trigger, always in the same spot, on every state
// ==========================================================================

.burger {
  display: none; // shown below-desktop only
  flex-shrink: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 20px;
  height: 20px;
  padding: $spacing-sm $spacing-md;
  border: none;
  background: transparent;
  cursor: pointer;
}

.burger__line {
  display: block;
  flex-shrink: 0;
  width: 48px;
  height: 4px;
  // Replace with your red token or hex (e.g. #ff3333 or $color-accent-400)
  background-color: $color-accent-400; 
  border-radius: $radius-pill;
  transition: transform 0.2s ease, opacity 0.2s ease, background-color 0.2s ease;

  // Subtle shadow ensures contrast over multi-colored images
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}
.burger--open .burger__line {
  // background-color: transparent;
  // backdrop-filter: invert(1);
  // background-color: $color-bg-base;
  &:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }
  &:nth-child(2) {
    opacity: 0;
  }
  &:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }
}

@include below-desktop {
  // Desktop pill plays no role on mobile — the panel below replaces it entirely.
  .links {
    display: none;
  }

  .burger {
    display: flex;
  }
}

// ==========================================================================
// Mobile panel — teleported to <body>, driven by v-if + <Transition>, so
// open and close are fully symmetric (mirror-image animations).
// ==========================================================================

.mobile-panel {
  position: fixed;
  inset: 0;
  z-index: 1500;
  display: flex;
  flex-direction: column;
  padding: calc(64px + $spacing-xl) $spacing-lg $spacing-lg;
}

// Separate layer from the text on purpose — scaling this alone gives the
// "rectangle grows top-down" effect without stretching/squashing the
// links and button that sit on top of it.
.mobile-panel__backdrop {
  position: fixed;
  inset: 0;
  z-index: 0;
  background-color: $color-bg-dark;
  transform-origin: top;
  transform: scaleY(1);
}

.mobile-panel__list {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: $spacing-xs;
  list-style: none;
  margin: 0;
  padding: 0;

  a {
    display: block;
    padding: $spacing-sm 0;
    text-decoration: none;
    color: $color-bg-base;
    font-family: $font-primary;
    font-size: $fs-section-heading;

    &:hover {
      color: $color-accent-400;
    }
  }
}

.mobile-panel__cta {
  position: relative;
  z-index: 1;
  margin-top: auto; // pins the CTA to the bottom of the panel, list stays top-anchored
  text-align: center;
}

// Content fade: base resting state.
.mobile-panel__list,
.mobile-panel__cta {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

// --- Enter (open) ---
.panel-enter-active .mobile-panel__backdrop {
  animation: panel-grow 0.45s cubic-bezier(0.65, 0, 0.35, 1) forwards;
}

.panel-enter-active .mobile-panel__list,
.panel-enter-active .mobile-panel__cta {
  transition-delay: 0.25s; // wait for the backdrop to mostly finish growing
}

.panel-enter-from .mobile-panel__list,
.panel-enter-from .mobile-panel__cta {
  opacity: 0;
  transform: translateY(12px);
}

// --- Leave (close) — the mirror image ---
.panel-leave-active .mobile-panel__backdrop {
  animation: panel-shrink 0.35s cubic-bezier(0.65, 0, 0.35, 1) forwards;
  animation-delay: 0.15s; // let the text fade out first, then the curtain retracts
}

.panel-leave-active .mobile-panel__list,
.panel-leave-active .mobile-panel__cta {
  transition-delay: 0s; // fade out immediately, don't wait around
}

.panel-leave-to .mobile-panel__list,
.panel-leave-to .mobile-panel__cta {
  opacity: 0;
  transform: translateY(12px);
}

@keyframes panel-grow {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}

@keyframes panel-shrink {
  from {
    transform: scaleY(1);
  }
  to {
    transform: scaleY(0);
  }
}
</style>