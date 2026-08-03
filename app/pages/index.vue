<template>
  <main>
    <HomepageHero />
    <Marquee />
    <HomepageServices />
    <HomepageJourney />
    <HomepageAbout />
    <HomepageHighlights />
    <HomepageContact />
    <HomepageFooter />
  </main>
</template>

<script setup lang="ts">
import HomepageHero from "~/sections/homepage/hero/index.vue";
import Marquee from "~/components/ui/Marquee.vue";
import HomepageServices from "~/sections/homepage/services/index.vue";
import HomepageAbout from "~/sections/homepage/about/index.vue";
import HomepageJourney from "~/sections/homepage/journey/index.vue";
import HomepageHighlights from "~/sections/homepage/highlights/index.vue";
import HomepageContact from "~/sections/homepage/contact/index.vue";
import HomepageFooter from "~/sections/homepage/footer/index.vue";
</script>
