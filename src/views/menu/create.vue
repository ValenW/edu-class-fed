<template>
  <Update />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Update from './components/Update.vue'

@Component({
  components: { Update }
})
export default class MenuCreate extends Vue {}
</script>

<style scoped></style>
