<template>
  <List />
</template>

<script lang="ts">
import List from './component/List.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: { List }
})
export default class CourseIndex extends Vue {}
</script>

<style lang="scss" scoped></style>
