<script setup lang="ts">
interface Props {
  number: number;
  title: string;
  description: string;
}
defineProps<Props>();
</script>

<template>
  <div class="card">
    <span class="card__number" aria-hidden="true">{{ number }}</span>

    <h3 class="card-title card__title">{{ title }}</h3>

    <div class="card__divider">
      <span class="card__rule" />
      <span class="card__dot" />
    </div>

    <p class="card__description">{{ description }}</p>
  </div>
</template>

<style scoped lang="scss">
.card {
  position: relative; // anchors the absolutely-positioned number
  width: 400px;
  min-width: 320.33px;
  height: 600px;
  padding: $spacing-md; // 24px
  border-radius: $radius-md;
  background-color: $color-accent-100;
  border: 1px solid rgba($color-text-primary, 0.06);
  overflow: hidden; // clips the number if it ever runs past the card edge
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

  // Mobile: no horizontal scroll rail — collapse into a two-column row.
  // Number sits in a fixed left column spanning every row; title, divider,
  // and description flow down the right column in document order.
  @include mobile {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: $spacing-sm;
    row-gap: $spacing-2xs;
    width: 100%;
    min-width: 0;
    height: auto;
    padding: $spacing-md;
    scroll-snap-align: none;

    @media (hover: hover) {
      &:hover {
        transform: none;
        box-shadow: none;
      }
    }
  }
}

.card__title {
  position: relative;
  z-index: 1;
  color: $color-text-primary;
  margin: 0;
  letter-spacing: -0.01em;

  @include mobile {
    grid-column: 2;
    grid-row: 1;
  }
}

// Decorative ghost numeral — removed from flow entirely, doesn't affect
// title/divider/description positioning at all. Fixed coordinates mean it
// sits in the same spot on every card, regardless of content length.
.card__number {
  position: absolute;
  left: $spacing-md;
  bottom: 8px; // tune this against the fixed divider gap below until it sits flush
  z-index: 0;
  font-family: $font-mono;
  font-weight: $fw-bold;
  font-size: 96px;
  line-height: 1;
  color: rgba($color-text-primary, 0.12); // "ghost" tint — not a shared token, single use
  transition: color 0.35s ease;

  // On mobile the ghost treatment doesn't read at row height, so it becomes
  // a small solid step-marker instead — same font, opposite scale.
  @include mobile {
    position: static;
    grid-column: 1;
    grid-row: 1 / -1;
    align-self: start;
    width: 32px;
    font-size: $fs-card-title;
    line-height: $lh-tight;
    color: $color-accent-400;
    opacity: 1;
  }
}

// Fixed gap from the title — this is what makes the divider land in the
// same place on every card, instead of depending on flex leftover space.
.card__divider {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  margin-top: $spacing-2xl; // 96px — fixed, not derived from remaining space
  margin-bottom: $spacing-sm;

  @include mobile {
    grid-column: 2;
    grid-row: 2;
    margin-top: $spacing-xs;
    margin-bottom: $spacing-2xs;
  }
}

.card__rule {
  flex: 0 0 70%;
  height: 1px;
  background-color: $color-grey-100;
  transition: background-color 0.35s ease;

  @include mobile {
    flex-basis: 40%;
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

.card__description {
  position: relative;
  z-index: 1;
  margin: 0;
  color: $color-text-secondary;
  font-family: $font-primary;
  font-size: $fs-body;
  font-weight: $fw-regular;
  line-height: $lh-body;

  @include mobile {
    grid-column: 2;
    grid-row: 3;
  }
}
</style>