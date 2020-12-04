<template>
  <el-card class="advert">
    <div slot="header" class="clearfix">
      <el-row type="flex" justify="space-between">
        广告管理
        <div class="operations">
          <el-button size="mini" @click="handleAdd">
            添加广告
          </el-button>
        </div>
      </el-row>
    </div>

    <el-table :data="data">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="createTime" label="位置">
        <template slot-scope="{ row }">
          {{ spacesName[row.spaceId] }}
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="图片">
        <template slot-scope="{ row }">
          <el-image
            style="width: 100px; height: 100px"
            :src="row.img"
            fit="cover"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="时间" min-width="100px">
        <template slot-scope="{ row }">
          <div>开始时间: {{ row.startTime }}</div>
          <div>结束时间: {{ row.endTime }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="上线/下线" align="center">
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            :disabled="adUpdating[row.id]"
            @change="handleStateChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button size="mini" @click="handleEdit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <update-card
      :visible.sync="dialogVisible"
      :createMode="createMode"
      :config="config"
      :init="init"
      :name="'广告位'"
      :updateMethod="updateMethod"
      @update="loadData()"
    /> -->
  </el-card>
</template>

<script lang="ts">
import { Form, FormConfig } from '@/component/Update/index.vue'
import {
  Ad,
  AdSpace,
  getAd,
  getSpace,
  updateAd,
  updateSpace
} from '@/services/advert'
import UpdateCard from '@/component/Update/card.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({ components: { UpdateCard } })
export default class AdvertSpaceIndex extends Vue {
  private data: Ad[] = []
  private spaces: AdSpace[] = []
  private adUpdating: Record<number, boolean> = {}

  private dialogVisible: boolean = false
  private createMode: boolean = false
  private config: FormConfig[] = [{ prop: 'name', label: '名称', type: 'text' }]
  private init: Form & any = {}
  private updateMethod = updateSpace

  private created() {
    this.loadData()
    this.loadSpaces()
  }

  private async loadData() {
    const {
      data: { content: ads }
    } = await getAd()
    this.data = ads
  }

  private async loadSpaces() {
    const {
      data: { content: spaces }
    } = await getSpace()
    this.spaces = spaces
  }

  private handleAdd() {
    this.handleEdit()
  }

  private async handleEdit(item?: Ad) {
    this.createMode = !item
    this.dialogVisible = true
    this.init = item || {}
  }

  private async handleStateChange(item: Ad) {
    this.$set(this.adUpdating, item.id, true)
    try {
      const {
        data: { data, code, mesg }
      } = await updateAd(item)
      if (Number.parseInt(code)) {
        throw new Error(mesg)
      }
      this.$message.success(`${item.status ? '上线' : '下线'}成功`)
    } catch (error) {
      this.$message.error(`Error when change state: ${error}`)
      item.status = item.status ? 0 : 1
    } finally {
      this.$set(this.adUpdating, item.id, false)
    }
  }

  private get spacesName(): Record<number, string> {
    return (this.spaces || []).reduce((acc, cur) => {
      acc[cur.id] = cur.name
      return acc
    }, {} as Record<number, string>)
  }
}
</script>

<style lang="scss" scoped></style>
