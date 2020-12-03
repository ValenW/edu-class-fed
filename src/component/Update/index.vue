<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item
      v-for="(item, index) in config"
      :key="index"
      :label="item.label"
      :prop="item.prop"
    >
      <el-radio-group v-model="form[item.prop]" v-if="item.type === 'boolean'">
        <el-radio :label="true">是</el-radio>
        <el-radio :label="false">否</el-radio>
      </el-radio-group>

      <el-input-number
        v-model="form[item.prop]"
        v-else-if="item.type === 'number'"
      />

      <el-select
        v-model="form[item.prop]"
        v-else-if="item.type === 'select'"
        placeholder="请选择上级菜单"
      >
        <el-option
          v-for="{ value, label } in item.selects"
          :key="value"
          :label="label"
          :value="value"
        />
      </el-select>

      <el-input v-else v-model="form[item.prop]" :type="item.type" />
    </el-form-item>

    <slot></slot>
  </el-form>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Form as ElementForm } from 'element-ui'

export type FormConfig = {
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
export type Form = {
  [key: string]: string | number | undefined
}

@Component
export default class Update extends Vue {
  @Prop({ type: Array, default: true })
  private config!: FormConfig[]

  @Prop({ type: Object, default: {} })
  private init!: Form

  public form: Form = {}

  $refs!: {
    form: ElementForm
  }

  public resetFields() {
    this.$refs.form.resetFields()
  }

  private created() {
    this.initForm()
  }

  private initForm() {
    this.config.forEach(c => {
      const initValue =
        (typeof this.init[c.prop] !== 'undefined' && this.init[c.prop]) ||
        undefined
      const defaultValue =
        (typeof c.default !== 'undefined' && c.default) || undefined
      this.form[c.prop] = (initValue === undefined && initValue) || defaultValue
    })
  }
}
</script>

<style scoped></style>
