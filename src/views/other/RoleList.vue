<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form
        layout="inline"
        :model="searchState"
      >
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="角色ID">
              <a-input placeholder="请输入" v-model="searchState.id"/>
            </a-form-item>
          </a-col>
          <!-- <a-col :md="8" :sm="24">
            <a-form-item label="状态">
              <a-select placeholder="请选择" default-value="0">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">正常</a-select-option>
                <a-select-option value="2">禁用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col> -->
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button
                type="primary"
                html-type="submit"
                @click.stop.prevent="handleSearch(searchState)"
              >查询</a-button>
              <a-button
                type="primary"
                style="margin-left: 8px"
                @click="$refs.modal.add()"
              >添加</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table
      row-key="id"
      size="default"
      ref="table"
      :columns="columns"
      :data="loadData"
      :loading="loading"
      :single-data="loadSingleData"
      :expandedRowKeys="expandedRowKeys"
      @expand="handleExpand">
      <div
        slot="expandedRowRender"
        slot-scope="expandedRecord"
        style="margin: 0">
        <a-button
          :key="index"
          color="cyan"
          v-for="(menu, index) in expandedRecord.menus"
          :style="{ marginBottom: '12px', height: '23px', marginRight: '5px' }"
        >
          {{ $t(menu.meta.title) }}
        </a-button>
      </div>
      <a-tag color="blue" slot="status" slot-scope="text">{{ text | statusFilter }}</a-tag>
      <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
      <span slot="action" slot-scope="text, record">
        <a @click="hanldeEdit(record)">编辑</a>
        <a-popconfirm @confirm="handleDelete(record)" style="margin-left: 8px" title="确定删除此角色吗？">
          <a href="#">删除</a>
        </a-popconfirm>
      </span>
    </s-table>

    <role-modal ref="modal" @ok="handleOk"></role-modal>

  </a-card>
</template>

<script>
import { STable } from '@/components'
import RoleModal from './modules/RoleModal'
import { getRolePageList, getRoleById, deleteRole, getSelectedMenuDetailById } from '@/api/role'

const STATUS = {
  1: '启用',
  2: '禁用'
}

export default {
  name: 'TableList',
  components: {
    STable,
    RoleModal
  },
  data () {
    return {
      description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',

      searchState: { id: null },
      loading: false,

      form: null,
      mdl: {},

      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '唯一识别码',
          dataIndex: 'id'
        },
        {
          title: '角色名称',
          dataIndex: 'name'
        },
        {
          title: '别名',
          dataIndex: 'alias'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          scopedSlots: { customRender: 'createTime' },
          sorter: true
        }, {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadSingleData: (parameter) => {
        return getRoleById(parameter).then(res => {
          return res.data
        })
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getRolePageList(parameter)
          .then(res => {
          return res.data
        })
      },

      expandedRowKeys: [],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
    statusFilter (key) {
      return STATUS[key]
    }
  },
  methods: {
    handleOk () {
      // 新增/修改 成功时，重载列表
      this.$refs.table.refresh()
    },
    hanldeEdit (record) {
      if (!record.menus) {
        this.getMenuDetail(record, () => {
          this.$refs.modal.edit(record)
        })
      } else {
        this.$refs.modal.edit(record)
      }
    },
    handleDelete (record) {
      deleteRole({
        ids: [ record.id ]
      }).then(response => {
        if (response.code === 0) {
          this.$notification['success']({ message: '成功', description: '删除成功', duration: 4 })
          this.$refs.table.refresh()
        } else {
          this.$notification['error']({ message: '错误', description: response.msg, duration: 4 })
        }
      }).catch(err => {
        this.$notification['error']({ message: '错误', description: err, duration: 4 })
      })
    },
    handleSearch (searchState) {
      this.$refs.table.loadData({ id: searchState.id })
    },
    onChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleExpand (expanded, record) {
      console.log('expanded', expanded, record)
      if (!record.menus) {
        this.getMenuDetail(record, () => {
          this.expand(expanded, record)
        })
      } else {
        this.expand(expanded, record)
      }
    },
    expand (expanded, record) {
      if (expanded) {
        this.expandedRowKeys.push(record.id)
      } else {
        this.expandedRowKeys = this.expandedRowKeys.filter(item => record.id !== item)
      }
    },
    getMenuDetail (record, cb) {
      this.loading = true
      getSelectedMenuDetailById({ id: record.id }).then(res => {
        if (res.code === 0) {
          record.menus = res.data || []
          cb()
        } else {
          this.$notification['error']({ message: '错误', description: '获取菜单失败', duration: 4 })
        }
      }).finally(() => {
          this.loading = false
      })
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  }
}
</script>
