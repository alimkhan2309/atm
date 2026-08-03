<script setup lang="ts">
interface Props {
  number: number;
  title: string;
  description: string;
}
defineProps<Props>();

// Track expanded state for mobile accordion toggle
const isOpen = ref(false);

function toggleAccordion() {
  isOpen.value = !isOpen.value;
}
</script>

<template>
  <div
    class="card"
    :class="{ 'card--open': isOpen }"
    tabindex="0"
    role="button"
    :aria-expanded="isOpen"
    @click="toggleAccordion"
    @keydown.enter.space.prevent="toggleAccordion"
  >
    <span class="card__number" aria-hidden="true">{{ number }}</span>

    <div class="card__header-wrap">
      <h3 class="card-title card__title">{{ title }}</h3>
      <!-- Chevron indicator visible on mobile only -->
      <span class="card__chevron" aria-hidden="true" />
    </div>

    <div class="card__divider">
      <span class="card__rule" />
      <span class="card__dot" />
    </div>

    <div class="card__body">
      <p class="card__description">{{ description }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  position: relative;
  width: 400px;
  min-width: 320px;
  height: 640px;
  padding: $spacing-md;
  border-radius: $radius-md;
  background-color: $color-accent-100;
  border: 1px solid rgba($color-text-primary, 0.06);
  overflow: hidden;
  scroll-snap-align: start;
  transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;

  @media (hover: hover) {
    &:hover {
      transform: translateY(-6px);
      border-color: rgba($color-accent-400, 0.25);
      box-shadow: 0 20px 40px -24px rgba($color-text-primary, 0.25);

      .card__rule {
        background-color: $color-accent-200;
      }

      .card__dot {
        transform: scale(1.3);
      }

      .card__number {
        color: rgba($color-text-primary, 0.18);
      }
    }
  }

  // --- MOBILE ACCORDION STYLES ---
  @include mobile {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 0;
    height: auto; // override desktop fixed height
    padding: $spacing-md;
    cursor: pointer;
    border-bottom: 1px solid rgba($color-text-primary, 0.1);
    scroll-snap-align: none;

    @media (hover: hover) {
      &:hover {
        transform: none;
        box-shadow: none;
      }
    }
  }
}

.card__header-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.card__title {
  position: relative;
  z-index: 1;
  color: $color-text-primary;
  margin: 0;
  letter-spacing: -0.01em;
}

.card__chevron {
  display: none;

  @include mobile {
    display: block;
    width: 8px;
    height: 8px;
    border-right: 2px solid $color-accent-400;
    border-bottom: 2px solid $color-accent-400;
    transform: rotate(45deg);
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    margin-left: $spacing-xs;
    flex-shrink: 0;

    .card--open & {
      transform: rotate(-135deg);
    }
  }
}

.card__number {
  position: absolute;
  left: $spacing-md;
  bottom: 8px;
  z-index: 0;
  font-family: $font-mono;
  font-weight: $fw-bold;
  font-size: 96px;
  line-height: 1;
  color: rgba($color-text-primary, 0.12);
  transition: color 0.35s ease;

  @include mobile {
    position: static;
    font-size: $fs-card-title;
    line-height: $lh-tight;
    color: $color-accent-400;
    margin-bottom: $spacing-2xs;
  }
}

.card__divider {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  margin-top: $spacing-2xl;
  margin-bottom: $spacing-sm;

  @include mobile {
    margin-top: $spacing-xs;
    margin-bottom: $spacing-xs;
  }
}

.card__rule {
  flex: 0 0 70%;
  height: 1px;
  background-color: $color-grey-100;
  transition: background-color 0.35s ease;

  @include mobile {
    flex-basis: 100%;
  }
}

.card__dot {
  width: 10px;
  height: 10px;
  margin-left: $spacing-xs;
  border-radius: $radius-pill;
  background-color: $color-accent-500;
  flex-shrink: 0;
  transition: transform 0.35s ease;
}

.card__body {
  position: relative;
  z-index: 1;

  @include mobile {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.35s cubic-bezier(0.16, 1, 0.3, 1);

    .card--open & {
      grid-template-rows: 1fr;
    }
  }
}

.card__description {
  margin: 0;
  color: $color-text-secondary;
  font-family: $font-primary;
  font-size: $fs-body;
  font-weight: $fw-regular;
  line-height: $lh-body;

  @include mobile {
    overflow: hidden; // CSS grid row animation requires overflow hidden on child
  }
}
</style>