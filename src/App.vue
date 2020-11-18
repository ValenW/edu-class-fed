<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class App extends Vue {}
</script>

<style lang="scss" scoped>
.test {
  color: $info-color;
}
</style>
