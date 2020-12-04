<template>
  <el-card class="advert-edit">
    <div slot="header" class="clearfix">
      <span>
        <el-button
          icon="el-icon-arrow-left"
          size="mini"
          @click="$router.back()"
          type="text"
        >
          返回
        </el-button>
        <el-divider direction="vertical"></el-divider>
        {{ actionName }}广告
      </span>
    </div>

    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item prop="name" label="广告名称" required>
        <el-input v-model="form.name" required />
      </el-form-item>
      <el-form-item prop="spaceId" label="广告位置">
        <el-select v-model="form.spaceId">
          <el-option
            v-for="{ id, name } in spaces"
            :key="id"
            :label="name"
            :value="id"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="startTime" label="开始时间" required>
        <el-date-picker
          v-model="form.startTime"
          type="datetime"
          placeholder="选择开始时间"
        />
      </el-form-item>
      <el-form-item prop="endTime" label="到期时间" required>
        <el-date-picker
          v-model="form.endTime"
          type="datetime"
          placeholder="选择到期时间"
        />
      </el-form-item>
      <el-form-item prop="status" label="上线/下线">
        <el-switch
          v-model="form.status"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item prop="img" label="广告图片">
        <Uploader v-model="form.img" :limit="2" :acceptTypes="imageTypes" />
      </el-form-item>
      <el-form-item prop="link" label="广告链接" required>
        <el-input v-model="form.link" />
      </el-form-item>
      <el-form-item prop="text" label="广告备注">
        <el-input v-model="form.text" type="textarea" />
      </el-form-item>

      <el-button type="primary" @click="onSubmit">提交</el-button>
      <el-button v-if="createMode" @click="onReset">重置</el-button>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { Ad, AdSpace, getById, getSpace, updateAd } from '@/services/advert'
import Uploader from '@/component/Uploader/index.vue'
import { ImageTypes } from '@/utils'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'

@Component({ components: { Uploader } })
export default class AdUpdate extends Vue {
  @Prop({ type: String })
  private adId!: string

  $refs!: {
    form: Form
  }

  private form: Partial<Ad> = {}
  private spaces: AdSpace[] = []
  private imageTypes: string[] = ImageTypes

  private created() {
    this.loadSpaces()
    this.loadData()
  }

  private async loadData() {
    if (!this.createMode) {
      const {
        data: { content }
      } = await getById(this.adId)
      this.form = content
    } else {
      this.form = { status: 0 }
    }
  }

  private async loadSpaces() {
    const {
      data: { content: spaces }
    } = await getSpace()
    this.spaces = spaces
  }

  private async onSubmit() {
    if (!(await this.$refs.form.validate())) {
      return
    }
    try {
      const {
        data: { success, message }
      } = await updateAd(this.form)
      if (!success) {
        throw new Error(message)
      }
      this.$message.success(`${this.actionName}成功`)
      this.$router.push({ name: 'advert' })
    } catch (error) {
      this.$message.error(`${this.actionName}失败: ${error}`)
    }
  }

  private onReset() {
    this.$refs.form.resetFields()
  }

  private get createMode(): boolean {
    return !this.adId
  }

  private get actionName(): string {
    return this.createMode ? '创建' : '更新'
  }
}
</script>

<style scoped></style>
