<template>
  <el-card class="advert-edit">
    <div slot="header" class="clearfix">
      <el-row type="flex" justify="space-between">
        编辑广告{{ adId }}
        <div class="operations"></div>
      </el-row>
    </div>
  </el-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({ components: {} })
export default class AdEdit extends Vue {
  @Prop({ type: String, required: true })
  private adId!: string
}
</script>

<style scoped></style>
