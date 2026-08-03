<script setup lang="ts">
import industries from "~/data/industries.json";
import UiButton from "~/components/ui/Button.vue";
import UiTag from "~/components/ui/Tag.vue";

const services = [...industries.industries].sort((a, b) => a.order - b.order);
const selectedServiceId = ref(services[0]?.id ?? "");

const selectedService = computed(
  () => services.find((service) => service.id === selectedServiceId.value) ?? services[0]
);
</script>

<template>
  <section class="section services section--alt">
    <div class="services__content">
      <div class="services__header">
        <div class="services__header-intro">
          <span class="header__eyebrow">Our services</span>
          <h2 class="header__heading">Supporting manufacturers across key sectors</h2>
        </div>

        <p class="services__header-description">
          ATM Automation designs and builds bespoke automation, assembly, inspection and
          manufacturing equipment for regulated and advanced manufacturing environments,
          including medical device, healthcare, automotive, food, packaging, energy and
          industrial production.
        </p>
      </div>

      <div class="services__layout">
        <div class="services__list" role="list">
          <button
            v-for="service in services"
            :key="service.id"
            type="button"
            class="services__list-item"
            :class="{ 'services__list-item--active': service.id === selectedServiceId }"
            @click="selectedServiceId = service.id"
          >
            <span class="services__list-indicator" />
            <span class="services__list-number">{{ String(service.order).padStart(2, '0') }}</span>
            <span class="services__list-name card-title">{{ service.name }}</span>
          </button>
        </div>

        <article v-if="selectedService" class="services__detail">
          <img
            class="services__detail-image"
            :src="`/images/services/${selectedService.image}`"
            :alt="selectedService.name"
          />

          <div class="services__detail-meta">
            <div class="services__detail-tags">
              <UiTag v-for="tag in selectedService.tags" :key="tag">{{ tag }}</UiTag>
            </div>

            <p class="services__detail-description">{{ selectedService.description }}</p>

            <UiButton class="services__detail-link" :href="`/services/${selectedService.id}`" variant="primary">
              Learn More
            </UiButton>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.services__content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: $spacing-xl;
}

.services__header {
  display: flex;
  gap: 40px;
  align-items: center; // was `flex-center` — not a valid CSS value, silently ignored by the browser

  @include below-desktop {
    flex-direction: column;
    gap: $spacing-lg;
  }
}

.services__header-intro,
.services__header-description {
  flex: 1 1 0;
}

.services__header-intro {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.services__header-description {
  margin: 0;
  font-size: $fs-body;
  line-height: $lh-body;
  color: $color-text-secondary;
}

.services__layout {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 40px;

  @include below-desktop {
    grid-template-columns: 1fr;
  }
}

.services__list {
  position: sticky;
  top: 0; // adjust if there's a fixed/sticky site header — see note
  align-self: start; // <- the actual fix: stops the grid's default stretch
                      // from making this column as tall as .services__detail,
                      // which is what was cancelling the sticky effect out
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;

  @include below-desktop {
    position: static; // sticky columns don't make sense once the grid stacks
  }
}

.services__list-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: $spacing-md;
  width: 100%;
  min-height: 72px;
  padding: $spacing-sm $spacing-sm $spacing-sm $spacing-md;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: background-color 160ms ease;

  &:hover {
    background: rgba($color-accent-500, 0.06);
  }
}

.services__list-item--active {
  background: rgba($color-accent-500, 0.06);
}

.services__list-indicator {
  position: absolute;
  inset: 0 auto 0 0;
  width: 4px;
  border-radius: 999px;
  background: transparent;
}

.services__list-item--active .services__list-indicator {
  background: $color-accent-500;
}

.services__list-number {
  font-family: $font-primary;
  font-size: 22px;
  font-weight: $fw-medium;
  line-height: $lh-tight;
  color: $color-accent-500;
  flex-shrink: 0;
}

.services__list-name {
  color: $color-text-primary;
}

.services__detail {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.services__detail-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  display: block;
}

.services__detail-meta {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.services__detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xs;
}

.services__detail-description {
  margin: 0;
  font-size: $fs-body;
  line-height: $lh-body;
  color: $color-text-secondary;
}

.services__detail-link {
  align-self: flex-start;
}
</style>