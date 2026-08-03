<script setup lang="ts">
import { useScrollReveal } from '~/composables/useScrollReveal';
import { useNumber } from "~/composables/useNumber";

const stats = [
  { value: "8+", label: "Industries Served" },
  { value: "50", label: "Years' Experience" },
  { value: "5000+", label: "Projects Delivered" },
  { value: "UK", label: "Design, Build & Support Facility" },
];

const sectionRef = ref<HTMLElement | null>(null);

// 1. Reveal header intro, paragraph text, and CTA link in one fluid sequence
useScrollReveal(sectionRef, ".header__eyebrow, .header__heading, .header__body, .about__link", {
  preset: "fade-up",
  stagger: 0.08,
  start: "top 80%",
});

// 2. Reveal stats grid side-by-side with a slightly staggered scale-in or fade-up
useScrollReveal(sectionRef, ".about__stat", {
  preset: "fade-up",
  stagger: 0.1,
  start: "top 75%",
});

// 3. Numbers
useNumber(sectionRef)
</script>

<template>
  <section ref="sectionRef" class="section section--alt">
    <div class="about__content">
      <div class="about__text">
        <div class="header about__header">
          <div class="header__intro">
            <span class="header__eyebrow">About Us</span>
            <h2 class="header__heading">
              <span class="about__highlight">50 Years</span> of Precision <br> Manufacturing
            </h2>
          </div>

          <div class="about__body">
            <p class="header__body">
              For 50 years, ATM Automation has specialised in the design and build of
              bespoke automation, assembly, inspection and manufacturing equipment for
              regulated and advanced manufacturing industries.
            </p>
          </div>
        </div>

        <a href="/about-us" class="about__link">Learn More →</a>
      </div>

      <dl class="about__stats">
        <div v-for="stat in stats" :key="stat.label" class="about__stat">
          <dt class="about__stat-value">{{ stat.value }}</dt>
          <dd class="about__stat-label">{{ stat.label }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<style scoped lang="scss">
.about__content {
  display: flex;
  justify-content: space-between;
  gap: $spacing-xl;
  min-width: 0;

  @include tablet {
    flex-direction: column;
  }

  @include mobile {
    flex-direction: column;
  }
}

.about__text {
//   flex: 1 1 0;
//   max-width: 480px;
  min-width: 0;
  max-width: 662px;
  display: flex;
  flex-direction: column;

  @include tablet {
    max-width: none;
  }
}

.about__body {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.about__highlight {
  color: $color-accent-400; // AA-safe red for text — never accent-500
}

.about__link {
  font-family: $font-mono;
  font-size: $fs-body;
  color: $color-text-primary;
  text-decoration: none;
  width: fit-content;

  &:hover {
    color: $color-accent-400;
  }
}

.about__stats {
  flex: 0 1 auto;
  min-width: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, auto));
  column-gap: $spacing-xl; // 64px
  row-gap: $spacing-2xl; // 96px
  align-content: center;
  justify-content: center;
  width: fit-content;

  @include tablet {
    row-gap: $spacing-lg;
  }

  @include mobile {
    column-gap: $spacing-lg;
    row-gap: $spacing-lg;
  }
}

.about__stat-value {
  margin: 0;
  font-family: $font-mono;
  font-weight: $fw-bold;
  font-size: $fs-stats;
  line-height: 1;
  color: $color-accent-400; // AA-safe red for text — never accent-500
}

.about__stat-label {
  margin: $spacing-xs 0 0;
  font-family: $font-primary;
  font-weight: $fw-regular;
  font-size: $fs-body;
  color: $color-text-secondary;
}
</style>