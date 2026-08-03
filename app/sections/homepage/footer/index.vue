<script setup lang="ts">
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-vue-next";

const pagesLinks = [
  { label: "Home", href: "/" },
  { label: "Industries", href: "/industries" },
  { label: "Capabilities", href: "/capabilities" },
  { label: "Projects", href: "/projects" },
  // NOTE: VR Suite kept here to match the wireframe, but we'd previously
  // flagged dropping it from primary nav unless there's real content behind
  // it — same logic applies here. Confirm before shipping.
  { label: "VR Suite", href: "/vr-suite" },
  { label: "About", href: "/about-us" },
  { label: "Contact", href: "/contact" },
];

const customerCareLinks = [
  { label: "Help center", href: "/help-center" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy policy", href: "/privacy-policy" },
];

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com", icon: Facebook },
  { label: "Twitter", href: "https://twitter.com", icon: Twitter },
  { label: "Instagram", href: "https://instagram.com", icon: Instagram },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/atm-automation/", icon: Linkedin },
];

const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="footer">
    <div class="section footer__content">
      <div class="footer__top">
        <div class="footer__brand">
          <img src="/images/logo.png" alt="ATM Automation" class="footer__logo" />
          <p class="footer__cta-text">
            Looking for automation, assembly, inspection or manufacturing equipment?
          </p>
          <NuxtLink to="/contact" class="btn btn--primary footer__cta-btn">
            Discuss Your Project
          </NuxtLink>
        </div>

        <nav class="footer__nav footer__nav--pages">
          <h3 class="footer__nav-title">Pages</h3>
          <ul class="footer__nav-list">
            <li v-for="link in pagesLinks" :key="link.label">
              <NuxtLink :to="link.href" class="footer__nav-link">{{ link.label }}</NuxtLink>
            </li>
          </ul>
        </nav>

        <nav class="footer__nav footer__nav--care">
          <h3 class="footer__nav-title">Customer care</h3>
          <ul class="footer__nav-list">
            <li v-for="link in customerCareLinks" :key="link.label">
              <NuxtLink :to="link.href" class="footer__nav-link">{{ link.label }}</NuxtLink>
            </li>
          </ul>
        </nav>

        <div class="footer__trust">
          <img
            src="/images/certification.png"
            alt="BSI ISO 9001 Quality Management Systems Certified"
            class="footer__certification"
          />
          <div class="footer__socials">
            <a
              v-for="social in socialLinks"
              :key="social.label"
              :href="social.href"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="social.label"
              class="footer__social-link"
            >
              <component :is="social.icon" :size="20" :stroke-width="1.5" />
            </a>
          </div>
        </div>
      </div>

      <div class="footer__divider" />

      <p class="footer__copyright">
        © {{ currentYear }} ATM Automation Limited. All rights reserved.
      </p>
    </div>

    <img
      src="/images/atm_building.png"
      alt="ATM Automation headquarters and manufacturing facility, Leicester, UK"
      class="footer__building"
    />
  </footer>
</template>

<style scoped lang="scss">
.footer {
  background-color: $color-bg-base;
}

.footer__content {
  display: flex;
  flex-direction: column;
  gap: $spacing-xl;
}

.footer__top {
  display: flex;
  justify-content: space-between;
  gap: $spacing-xl;

  // Tablet: 2x2 grid instead of a full vertical stack — four short columns
  // don't need to go fully single-file until space is genuinely tight.
  @include below-desktop {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "brand trust"
      "pages care";
    gap: $spacing-xl $spacing-lg;
  }

  @include mobile {
    grid-template-columns: 1fr;
    grid-template-areas:
      "brand"
      "trust"
      "pages"
      "care";
    gap: $spacing-lg;
  }
}

.footer__brand {
  grid-area: brand;
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: $spacing-sm;
}

.footer__logo {
  height: 32px;
  width: auto;
}

.footer__cta-text {
  margin: 0;
  max-width: 280px;
  font-family: $font-primary;
  font-size: $fs-body;
  color: $color-text-secondary;
}

.footer__cta-btn {
  margin-top: $spacing-xs;
  text-decoration: none;
}

.footer__nav {
  flex: 0 0 auto;
}

.footer__nav--pages {
  grid-area: pages;
}

.footer__nav--care {
  grid-area: care;
}

.footer__nav-title {
  margin: 0 0 $spacing-sm;
  font-family: $font-primary;
  font-weight: $fw-medium;
  font-size: $fs-card-title;
  color: $color-text-primary;
}

.footer__nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.footer__nav-link {
  font-family: $font-primary;
  font-size: $fs-body;
  color: $color-text-secondary;
  text-decoration: none;

  &:hover {
    color: $color-accent-400;
  }
}

.footer__trust {
  grid-area: trust;
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: $spacing-sm;

  @include below-desktop {
    align-items: flex-start;
  }
}

.footer__certification {
  height: 56px;
  width: auto;
}

.footer__socials {
  display: flex;
  gap: $spacing-sm;
}

.footer__social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: $color-text-primary;

  &:hover {
    color: $color-accent-400;
  }
}

.footer__divider {
  height: 1px;
  background-color: $color-accent-400;
}

.footer__copyright {
  margin: 0;
  text-align: center;
  font-family: $font-mono;
  font-size: $fs-tag;
  color: $color-text-secondary;
}

.footer__building {
  display: block;
  width: 100%;
  height: 420px;
  object-fit: cover;

  @include below-desktop {
    height: 320px;
  }

  @include mobile {
    height: 220px;
  }
}
</style>