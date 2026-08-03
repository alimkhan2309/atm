<script setup lang="ts">
/**
 * Header
 * Optional convenience wrapper around the `.header` styling class.
 * You can skip this component entirely and use the raw class/markup
 * directly if you'd rather not add a component for it.
 *
 * Usage:
 *   <Header eyebrow="OUR SERVICES" heading="Supporting Manufacturers Across Key Sectors">
 *     <template #body>ATM Automation designs and builds...</template>
 *     <Button variant="primary">Discuss Your Project</Button>
 *   </Header>
 *
 *   <Header hero eyebrow="Concept to commissioning" heading="Bespoke automation systems for advanced manufacturing" />
 */
interface Props {
  eyebrow: string
  heading: string
  hero?: boolean
}

withDefaults(defineProps<Props>(), {
  hero: false
})
</script>

<template>
  <div class="header" :class="{ 'header--hero': hero }">
    <div class="header__intro">
      <span class="header__eyebrow">{{ eyebrow }}</span>
      <h2 class="header__heading">{{ heading }}</h2>
    </div>

    <p v-if="$slots.body" class="header__body">
      <slot name="body" />
    </p>

    <div v-if="$slots.default" class="header__cta">
      <slot />
    </div>
  </div>
</template>
