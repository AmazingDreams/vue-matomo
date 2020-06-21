<template>
  <div class="hello">
    <h1>Welcome to the vue-matomo demo</h1>

    <p>
      <a href="https://www.google.com">External link to google</a>
    </p>
    <p>
      <router-link :to="{name: 'Page1'}">Page 1</router-link>
      <router-link :to="{name: 'Page1', query: {foo: 'bar', bar: 'baz'}}">Page 1 with Query</router-link>
      <router-link :to="{name: 'Page2'}">Page 2 (Untracked)</router-link>
    </p>
    <p>
      <router-link :to="{ hash: 'update-hash'}" replace>Update Hash</router-link>
      <router-link :to="{ hash: 'update-hash-2'}" replace>Update Hash 2</router-link>
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
