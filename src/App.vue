<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      msg: 'Hello world'
    }
  }
})
</script>

<style lang="scss" scoped>
.test {
  color: $info-color;
}
</style>
