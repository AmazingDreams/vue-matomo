<template>
  <div class="hello">
    <h1>Welcome to Page 1</h1>

    <p>
      <router-link :to="{name: 'HelloWorld'}">HelloWorld</router-link>
      <router-link :to="{name: 'Page2'}">Page 2 (Untracked)</router-link>
    </p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld'
}
</script>
