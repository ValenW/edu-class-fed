<template>
  <el-card class="advert">
    <div slot="header" class="clearfix">
      <el-row type="flex" justify="space-between">
        广告位管理
        <div class="operations">
          <el-button size="mini" @click="handleAdd">
            添加广告位
          </el-button>
        </div>
      </el-row>
    </div>

    <el-table :data="data">
      <el-table-column prop="spaceKey" label="编号" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button size="mini" @click="handleEdit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <update-dialog
      :visible.sync="dialogVisible"
      :createMode="createMode"
      :config="config"
      :init="init"
      :name="'广告位'"
      :updateMethod="updateMethod"
      @update="loadData()"
    />
  </el-card>
</template>

<script lang="ts">
import { Form, FormConfig } from '@/component/Update/index.vue'
import { Ad, AdSpace, getSpace, updateSpace } from '@/services/advert'
import UpdateDialog from '@/component/Update/dialog.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({ components: { UpdateDialog } })
export default class AdvertSpaceIndex extends Vue {
  private data: AdSpace[] = []

  private dialogVisible: boolean = false
  private createMode: boolean = false
  private config: FormConfig[] = [{ prop: 'name', label: '名称', type: 'text' }]
  private init: Form & any = {}
  private updateMethod = updateSpace

  private created() {
    this.loadData()
  }

  private async loadData() {
    const {
      data: { content }
    } = await getSpace()
    this.data = content
  }

  private handleAdd() {
    this.handleEdit()
  }

  private async handleEdit(item?: AdSpace) {
    this.createMode = !item
    this.dialogVisible = true
    this.init = item || {}
  }
}
</script>

<style lang="scss" scoped></style>
