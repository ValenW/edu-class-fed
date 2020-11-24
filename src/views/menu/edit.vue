<template>
  <Update :create-mode="false" />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Update from './components/update.vue'

@Component({
  components: { Update }
})
export default class MenuEdit extends Vue {}
</script>

<style scoped></style>
