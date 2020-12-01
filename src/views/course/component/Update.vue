<template>
  <div class="update-course">
    <el-steps :active="activeStep" simple>
      <el-step
        v-for="(step, index) in steps"
        :title="step.title"
        :icon="step.icon"
        :key="index"
        @click.native="activeStep = index"
      />
    </el-steps>

    <el-form>
      <div v-show="activeStep === 0">
        基本信息
      </div>
      <div v-show="activeStep === 1">
        课程封面
      </div>
      <div v-show="activeStep === 2">
        销售信息
      </div>
      <div v-show="activeStep === 3">
        秒杀活动
      </div>
      <div v-show="activeStep === 4">
        课程详情
      </div>
      <el-form-item>
        <el-button v-if="activeStep < steps.length - 1" @click="activeStep++">
          下一步
        </el-button>
        <el-button v-else type="primary" @click="handleSubmit">
          {{ updateTitle }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
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

  private steps: { icon: string; title: string }[] = [
    { title: '基本信息', icon: 'el-icon-edit' },
    { title: '课程封面', icon: 'el-icon-picture' },
    { title: '销售信息', icon: 'el-icon-goods' },
    { title: '秒杀活动', icon: 'el-icon-alarm-clock' },
    { title: '课程详情', icon: 'el-icon-edit-outline' }
  ]
  private activeStep: number = 0

  private handleSubmit() {
    // TODO
  }

  private get updateTitle(): string {
    return `${this.createMode ? '创建' : '更新'}课程`
  }
}
</script>

<style scoped></style>
