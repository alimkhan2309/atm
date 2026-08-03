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
  width: 320.33px;
  min-width: 320.33px;
  height: 600px;
  padding: $spacing-md; // 24px
  border-radius: $radius-md;
  background-color: $color-accent-100;
  overflow: hidden; // clips the number if it ever runs past the card edge
  scroll-snap-align: start;
}

.card__title {
  position: relative;
  z-index: 1;
  color: $color-text-primary;
  margin: 0;
}

// Decorative ghost numeral — removed from flow entirely, doesn't affect
// title/divider/description positioning at all. Fixed coordinates mean it
// sits in the same spot on every card, regardless of content length.
.card__number {
  position: absolute;
  left: $spacing-md;
  bottom: 8px; // tune this against the fixed divider gap below until it sits flush
  z-index: 0;
  font-family: $font-primary;
  font-weight: $fw-regular;
  font-size: 96px;
  line-height: 1;
  color: rgba($color-text-primary, 0.12); // "ghost" tint — not a shared token, single use
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
}

.card__rule {
  flex: 0 0 70%;
  height: 1px;
  background-color: $color-grey-100;
}

.card__dot {
  width: 10px;
  height: 10px;
  margin-left: $spacing-xs;
  border-radius: $radius-pill;
  background-color: $color-accent-500;
  flex-shrink: 0;
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
}
</style>