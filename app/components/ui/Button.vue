<script setup lang="ts">
interface Props {
  variant?: "primary" | "secondary";
  href?: string;
  type?: "button" | "submit" | "reset";
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  href: undefined,
  type: "button",
});

const tag = computed(() => (props.href ? resolveComponent("NuxtLink") : "button"));
</script>

<template>
  <component
    :is="tag"
    class="btn"
    :class="`btn--${variant}`"
    :to="href"
    :type="!href ? type : undefined"
  >
    <slot />
  </component>
</template>

<style scoped lang="scss">
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-sm $spacing-lg;
  border: 0;
  background: $color-logo-red;
  color: white;
  font-weight: $fw-medium;
  font-size: $fs-body;
  cursor: pointer;
  text-decoration: none;
  transition: transform 160ms ease, box-shadow 160ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba($color-logo-red, 0.2);
  }
  // responsive
  @include mobile {
    padding: $spacing-xs $spacing-sm;
    font-size: 16px;
  }
}

.btn--secondary {
  background: $color-bg-base;
  color: $color-text-primary;
  border: 1px solid $color-grey-100;
}
</style>
