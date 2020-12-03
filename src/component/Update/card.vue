<template>
  <div :class="`menu-${createMode ? 'create' : 'edit'}`">
    <el-card class="menu">
      <div slot="header" class="clearfix">
        <span>{{ title }}</span>
      </div>

      <FormIndex :config="config" :init="init" />

      <el-button type="primary" @click="onSubmit">提交</el-button>
      <el-button v-if="createMode" @click="onReset">重置</el-button>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Form as ElementForm } from 'element-ui'
import FormIndex from './index.vue'

type FormConfig = {
  label: string
  prop: string
  type: 'text' | 'number' | 'boolean' | 'select' | 'textarea'
  config?: Partial<{
    min: number
    max: number
  }>
  default?: string | number
  selects?: { value: string; label: string }[]
}
type Form = {
  [prop: string]: string | number
}

@Component({
  components: { FormIndex }
})
export default class Update extends Vue {
  @Prop({ type: Boolean, default: false })
  private createMode!: boolean

  @Prop({ type: String, required: true })
  private name!: string

  @Prop({ type: Array, default: true })
  private config!: FormConfig[]

  @Prop({ type: Object, default: {} })
  private init!: Form

  @Prop({ type: Function, required: true })
  private updateMethod!: (
    form: Form
  ) => Promise<{ data: { code: string; mesg: string } }>

  $refs!: {
    form: ElementForm
  }

  private async onSubmit() {
    try {
      const {
        data: { code, mesg }
      } = await this.updateMethod(this.init)

      if (Number(code)) {
        throw new Error('mesg')
      }
      this.$message.success(`${this.title}成功`)
      this.$router.back()
    } catch (error) {
      this.$message.error(`${this.title}失败: ${error} 请联系管理员`)
    }
  }

  private onReset() {
    this.$refs.form.resetFields()
  }

  private get title(): string {
    const actionName = this.createMode ? '创建' : '更新'
    return `${actionName}${this.name}`
  }
}
</script>

<style scoped></style>
