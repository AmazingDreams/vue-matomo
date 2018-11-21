<template>
  <div class="hello">
    <h1>Welcome to the vue-matomo demo</h1>

    <p>
      <a href="https://www.google.com">External link to google</a>
    </p>
    <p>
      <router-link :to="{name: 'Page1'}">Page 1</router-link>
    </p>
    <p>
      <button @click="trackMatomoEvent">
        Fire matomo event
      </button>
    </p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  methods: {
    trackMatomoEvent () {
      this.$matomo.trackEvent('Buttons', 'Click', 'demo', 10)
    }
  }
}
</script>
