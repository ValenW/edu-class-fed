<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose"
  >
    <FormIndex ref="form" :config="config" :init="init" />

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit">提交</el-button>
      <el-button v-if="createMode" @click="onReset">重置</el-button>
      <el-button @click="handleClose">取消</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Form as ElementForm } from 'element-ui'
import FormIndex, { FormConfig, Form } from './index.vue'

@Component({
  components: { FormIndex }
})
export default class UpdateDialog extends Vue {
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

  @Prop({ type: Boolean, default: false })
  private visible!: boolean

  private dialogVisible: boolean = false

  @Watch('visible')
  changeVisible(newValue: boolean) {
    this.dialogVisible = newValue
    if (newValue) {
      this.$nextTick(() => this.$refs.form.formComp.clearValidate())
    }
  }

  $refs!: {
    form: FormIndex
  }

  private async onSubmit() {
    if (!(await this.$refs.form.formComp.validate())) {
      return
    }
    try {
      const {
        data: { code, mesg }
      } = await this.updateMethod(this.$refs.form.form)

      if (Number(code)) {
        throw new Error('mesg')
      }
      this.$message.success(`${this.title}成功`)
      this.$emit('update', true)
      this.handleClose()
    } catch (error) {
      this.$message.error(`${this.title}失败: ${error} 请联系管理员`)
    }
  }

  private onReset() {
    this.$refs.form.resetFields()
  }

  private handleClose() {
    this.$emit('update:visible', false)
  }

  private get title(): string {
    const actionName = this.createMode ? '创建' : '更新'
    return `${actionName}${this.name}`
  }
}
</script>

<style scoped></style>
