<template>
  <div class="hello">
    <h1>Welcome to Page 2</h1>

    <p>
      <router-link :to="{name: 'HelloWorld'}">Hello World</router-link>
      <router-link :to="{name: 'Page1'}">Page 1</router-link>
    </p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld'
}
</script>
