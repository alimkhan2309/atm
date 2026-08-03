<script setup lang="ts">
// No JS animation loop needed — CSS keyframes handle the scroll, and are
// frame-rate independent (unlike a requestAnimationFrame pixel-decrement
// loop, which runs faster on high-refresh-rate displays).
</script>

<template>
  <section class="marquee">
    <div class="marquee__track">
      <!-- Two identical copies, side by side. The animation moves the whole
           track left by exactly one copy's width (-50% of the track's total
           width), so the moment copy 1 fully exits, copy 2 is already sitting
           in the exact spot copy 1 started in — no gap, no visible seam. -->
      <div class="marquee__group" aria-hidden="false">
        <img src="/images/logo_marquee.png" alt="Client logos" class="marquee__image" />
      </div>
      <div class="marquee__group" aria-hidden="true">
        <img src="/images/logo_marquee.png" alt="" class="marquee__image" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.marquee {
    background-color: #FFFFFF;
  width: 100%;
  height: 100px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center; // centers .marquee__track vertically — overflow now crops evenly, not just from the top

  @include tablet {
    height: 80px;
  }

  @include mobile {
    height: 60px;
  }
}

.marquee__track {
  display: flex;
  align-items: center; // centers each .marquee__group
  width: max-content;
  animation: marquee-scroll 30s linear infinite;

  &:hover {
    animation-play-state: paused;
  }
}

.marquee__group {
  display: flex;
  align-items: center; // centers the image itself
  flex-shrink: 0;
}

.marquee__image {
  width: auto;
  display: block; // natural size, same as before — no height override
}

@keyframes marquee-scroll {
  from {
    transform: translateX(0);
  }
  to {
    // Exactly half the *track's* total width (both copies combined) —
    // this is what makes the loop mathematically seamless regardless
    // of the image's actual pixel width.
    transform: translateX(-50%);
  }
}
</style>