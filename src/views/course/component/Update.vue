<template>
  <div class="update-course">更新课程 {{ courseId }}</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class Update extends Vue {
  @Prop({ type: Boolean, required: true })
  private createMode!: boolean

  @Prop({ required: false })
  private courseId!: number
}
</script>

<style scoped></style>
