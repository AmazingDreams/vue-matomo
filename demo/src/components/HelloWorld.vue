<template>
  <div class="hello">
    <h1>Welcome to the vue-matomo demo</h1>

    <p>
      <a href="https://www.google.com">External link to google</a>
      <router-link :to="{name: 'Page1'}">Page 1</router-link>
    </p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld'
}
</script>
