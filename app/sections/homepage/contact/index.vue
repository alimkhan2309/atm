<script setup lang="ts">
const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
});

function handleSubmit() {
  // TODO: wire up to actual submission endpoint (email service / API route)
  console.log("Contact form submitted:", { ...form });
}
</script>

<template>
  <section id="contact" class="section section--alt">
    <div class="contact__content">
      <div class="contact__info">
        <h2 class="contact__heading">Contact Us</h2>
        <p class="contact__intro">
          Share your details to connect with us. We'll get back to you as soon as we can.
        </p>

        <div class="contact__block">
          <h3 class="contact__block-title">Address</h3>
          <p class="contact__block-text">
            Blaby Industrial Park, Leicestershire<br />
            LE8 4GZ, United Kingdom
          </p>
        </div>

        <div class="contact__block">
          <h3 class="contact__block-title">Enquiries</h3>
          <p class="contact__block-text">
            Tel: +44 (0)116 277 3607<br />
            email: sales@atmautomation.com
          </p>
        </div>
      </div>

      <form class="contact__form" @submit.prevent="handleSubmit">
        <div class="contact__row">
          <div class="contact__field">
            <label class="contact__label" for="firstName">First Name</label>
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              placeholder="First name"
              class="contact__input"
            />
          </div>
          <div class="contact__field">
            <label class="contact__label" for="lastName">Last name</label>
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              placeholder="Last Name"
              class="contact__input"
            />
          </div>
        </div>

        <div class="contact__row">
          <div class="contact__field">
            <label class="contact__label" for="email">
              Email <span class="contact__required">*</span>
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="Email"
              required
              class="contact__input"
            />
          </div>
          <div class="contact__field">
            <label class="contact__label" for="phone">Phone</label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              placeholder="Phone"
              class="contact__input"
            />
          </div>
        </div>

        <div class="contact__field">
          <label class="contact__label" for="message">
            Message <span class="contact__required">*</span>
          </label>
          <textarea
            id="message"
            v-model="form.message"
            placeholder="Message"
            rows="5"
            required
            class="contact__input contact__textarea"
          />
        </div>

        <button type="submit" class="btn btn--primary contact__submit">
          Send Message
        </button>
      </form>
    </div>
  </section>
</template>

<style scoped lang="scss">

.contact__content {
  display: flex;
  gap: $spacing-2xl;
  width: 100%;

  @include tablet {
    flex-direction: column;
  }

  @include mobile {
    flex-direction: column;
  }
}

.contact__info {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.contact__heading {
  margin: 0;
  font-family: $font-primary;
  font-weight: $fw-medium;
  font-size: $fs-section-heading; // 44px — matches other section headings
  line-height: $lh-heading;
  color: $color-text-primary;
}

.contact__intro {
  margin: 0;
  color: $color-text-secondary;
  font-family: $font-primary;
  font-size: $fs-body;
}

.contact__block {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.contact__block-title {
  margin: 0;
  font-family: $font-primary;
  font-weight: $fw-medium;
  font-size: $fs-card-title;
  color: $color-text-primary;
}

.contact__block-text {
  margin: 0;
  color: $color-text-secondary;
  font-family: $font-primary;
  font-size: $fs-body;
  line-height: $lh-body;
}

.contact__form {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  width: 100%;
}

.contact__row {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-md;

  @include mobile {
    grid-template-columns: 1fr;
  }
}

.contact__field {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  width: 100%;
}

.contact__label {
  font-family: $font-primary;
  font-size: $fs-body;
  font-weight: $fw-medium;
  color: $color-text-primary;
}

.contact__required {
  color: $color-accent-400; // AA-safe red for inline text
}

.contact__input {
  width: 100%;
  font-family: $font-primary;
  font-size: $fs-body;
  padding: $spacing-sm;
  border: none;
  border-radius: $radius-md;
  background-color: $color-grey-50;
  color: $color-text-primary;

  &::placeholder {
    color: $color-grey-400;
  }

  &:focus {
    outline: 2px solid $color-accent-400;
    outline-offset: 1px;
  }
}

.contact__textarea {
  resize: vertical;
  font-family: $font-primary;
}

.contact__submit {
  align-self: flex-start;
  margin-top: $spacing-xs;
}
</style>