<template>
  <div class="hello">
    <h1>Welcome to Page 1</h1>

    <p>
      <router-link :to="{name: 'HelloWorld'}">Page 1</router-link>
    </p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld'
}
</script>
