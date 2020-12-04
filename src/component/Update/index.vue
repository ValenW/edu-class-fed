<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item
      v-for="(item, index) in config"
      :key="index"
      :label="item.label"
      :prop="item.prop"
      :required="item.required"
    >
      <el-switch
        v-model="form[item.prop]"
        v-if="item.type === 'boolean'"
        active-color="#13ce66"
        inactive-color="#ff4949"
        :active-value="true"
        :inactive-value="false"
      />

      <el-input-number
        v-model="form[item.prop]"
        v-else-if="item.type === 'number'"
        :min="item.config && item.config.min"
        :max="item.config && item.config.max"
        :disabled="item.disabled"
      />

      <el-select
        v-model="form[item.prop]"
        v-else-if="item.type === 'select'"
        :placeholder="item.config && item.config.placeHolder"
        :disabled="item.disabled"
      >
        <el-option
          v-for="{ value, label } in item.selects"
          :key="value"
          :label="label"
          :value="value"
        />
      </el-select>

      <el-input
        v-else
        v-model="form[item.prop]"
        :type="(item.config && item.config.type) || item.type"
        :disabled="item.disabled"
      >
        <template slot="prepend" v-if="item.config && item.config.prepend">
          {{ item.config.prepend }}
        </template>
        <template slot="append" v-if="item.config && item.config.append">
          {{ item.config.append }}
        </template>
      </el-input>
    </el-form-item>

    <slot></slot>
  </el-form>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Form as ElementForm } from 'element-ui'

export type FormConfig = {
  label: string
  prop: string
  type: 'text' | 'number' | 'boolean' | 'select' | 'textarea'
  config?: Partial<{
    min: number
    max: number
    placeHolder: string
    append: string
    prepend: string
    type: string
  }>
  required?: boolean
  disabled?: boolean
  default?: string | number
  selects?: { value: string | number; label: string }[]
}
export type Form = {
  [key: string]: string | number | boolean | undefined
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

  public get formComp(): ElementForm {
    return this.$refs.form
  }

  public resetFields() {
    this.$refs.form.resetFields()
    this.form = this.initForm
  }

  private get initForm(): Form {
    const data = this.config.reduce((acc, cur) => {
      const prop = cur.prop
      const initValue =
        (typeof this.init[prop] !== 'undefined' && this.init[prop]) || undefined
      const defaultValue =
        (typeof cur.default !== 'undefined' && cur.default) || undefined
      acc[prop] = (initValue !== undefined && initValue) || defaultValue
      if (cur.type === 'boolean' && acc[prop] === undefined) {
        acc[prop] = false
      }
      return acc
    }, {} as Form)
    return {
      ...this.init,
      ...data
    }
  }

  @Watch('initForm', { immediate: true })
  updateForm(newValue: Form) {
    this.form = newValue
  }
}
</script>

<style scoped></style>
