<script setup lang="ts">
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

let observer: IntersectionObserver | null = null;

function checkMobile() {
  // Matches the project's existing below-desktop breakpoint (1440px) —
  // same threshold the Journey section's scroll-jack switches off at.
  isMobile.value = window.matchMedia("(max-width: 1439px)").matches;
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

function closeMenu() {
  isMenuOpen.value = false;
}

function handleClickOutside(e: MouseEvent) {
  if (isMenuOpen.value && navbarRef.value && !navbarRef.value.contains(e.target as Node)) {
    closeMenu();
  }
}

function handleEscape(e: KeyboardEvent) {
  if (e.key === "Escape") closeMenu();
}

// Full nav row shows when: in the hero (desktop only), or the menu is
// explicitly toggled open. Everywhere else, it collapses to the burger.
const showLinks = computed(() => (isMobile.value ? isMenuOpen.value : isInHero.value || isMenuOpen.value));

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
  document.addEventListener("click", handleClickOutside);
  document.addEventListener("keydown", handleEscape);

  // Watching the Hero section directly (rather than a hardcoded scrollY
  // number) means this stays correct regardless of the hero's actual
  // height at any given breakpoint.
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
    // No hero on this page — default to the compact/scrolled state.
    isInHero.value = false;
  }
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("keydown", handleEscape);
  observer?.disconnect();
});
</script>

<template>
  <nav ref="navbarRef" class="navbar">
    <NuxtLink to="/" class="logo" @click="closeMenu">
        <img src="/images/logo.png" alt="ATM Automation" class="logo__image" :class="{ 'img--collapsed': !showLinks }" />
    </NuxtLink>

    <div class="links" :class="{ 'links--collapsed': !showLinks }">
      <ul class="links__list">
        <li v-for="(link, i) in navLinks" :key="link.to" :style="{ '--i': navLinks.length - i }">
          <NuxtLink :to="link.to" @click="closeMenu">{{ link.label }}</NuxtLink>
        </li>
      </ul>

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

      <button type="button" class="btn btn--primary links__cta">Get a Quote</button>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.navbar {
  position: fixed; // not absolute (scrolls away) or sticky (reserves flow space) — see note above
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-md $spacing-lg;
}

.logo {
  display: block;
  line-height: 0; // avoids inline-image baseline gap under the logo
}

.logo__image {
  height: 32px;
  width: auto;
}

.links {
  position: relative;
  width: fit-content;
  display: flex;
  padding: $spacing-xs $spacing-sm;
  justify-content: flex-end; // keeps the group pinned to the right edge — this
                              // is what makes the list grow leftward instead
                              // of pushing the button rightward
  align-items: center;
  gap: $spacing-sm; // space between the link list / burger and the CTA
  background-color: $color-bg-dark;
  border-radius: $radius-md;
  height: fit-content;
  overflow: hidden; // clips the list while its width animates
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
  max-width: 800px; // animation target — generous cap, see note below
  overflow: hidden;
  white-space: nowrap;
  transition: max-width 0.35s ease, opacity 0.25s ease;

  li {
    padding: $spacing-sm $spacing-md;
    border-radius: $radius-sm;
    opacity: 1;
    transition: background-color 0.2s ease, opacity 0.25s ease;
    // Stagger: items closest to the button (highest --i, since the array
    // is reversed by index) settle in first, ones further away follow —
    // reinforces the "growing outward from the button" motion.
    transition-delay: calc((var(--i, 0) - 1) * 40ms);

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
  border-radius: 0 $radius-md $radius-md 0; // sharp on the side touching the dark pill, rounded on the outer edge
  white-space: nowrap;
}

.burger {
  display: none; // only shown when the pill is in its collapsed state
  flex-shrink: 0; // prevents the flex row from ever squeezing this to zero —
                   // likely cause if the lines were invisible before
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
  width: 20px; // explicit px instead of 100%, so it can't collapse if the
               // parent's width is ever ambiguous
  height: 2px;
  background-color: $color-bg-base;
  border-radius: $radius-pill;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.img--collapsed {
    display: none;
}

// Collapsed state — the list's width animates to 0 (growing/shrinking
// relative to the fixed-right button, per the flex justify-content:flex-end
// above), and the burger takes its place.
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

  .burger {
    display: flex;
  }

  // Desktop-only convenience: hovering the collapsed pill grows the links
  // back out without needing to click. Excluded below desktop width, since
  // touch devices fake :hover on tap and it would fight the burger toggle.
  @include desktop-up {
    &:hover {
      .links__list {
        max-width: 480px;
        padding: 0 $spacing-2xs 0 $spacing-md;
        opacity: 1;

        li {
          opacity: 1;
        }
      }

      .burger {
        opacity: 0;
        pointer-events: none;
      }
    }
  }
}

.burger--open .burger__line {
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

// Mobile: logo + burger only in the bar itself. The CTA button and full
// link list both move into a dropdown panel revealed on tap.
@include below-desktop {
  .links {
    position: static;
  }

  .links__list {
    display: none; // links only ever exist inside the open dropdown panel below
  }

  .burger {
    display: flex;
  }

  .links__cta {
    display: none; // moves into the dropdown panel below when open
  }

  // Dropdown panel — the whole panel is one fixed-position flex container.
  // List and CTA are normal flow children inside it, so the button always
  // sits right after the list regardless of how many links there are.
  .links:has(.burger--open) {
    position: fixed;
    top: 64px; // roughly the navbar's height — adjust once measured live
    left: $spacing-md;
    right: $spacing-md;
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    padding: $spacing-md;
    max-height: calc(100vh - 64px - #{$spacing-md} * 2);
    overflow-y: auto; // safety net if the list ever outgrows the viewport
    background-color: $color-bg-dark;
    border-radius: $radius-md;
    opacity: 1;
    
    width: 94vw;
    height: 90dvh;
    align-items: start;
    justify-content: space-between;

    .links__list {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: $spacing-xs;
      position: static; // no longer independently pinned
      max-width: none;
      padding: 0;
      opacity: 1;

      li {
        opacity: 1;
        transition-delay: 0ms; // no stagger needed in the mobile panel
      }
    }

    .links__cta {
      display: block;
      position: static; // no longer independently pinned — just flows after the list
      text-align: center;
    }
  }
}
</style>