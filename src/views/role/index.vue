<template>
  <List />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import List from './components/List.vue'

@Component({
  components: { List }
})
export default class LoginIndex extends Vue {}
</script>

<style lang="scss" scoped></style>
