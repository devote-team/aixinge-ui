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
              <!-- <a-button style="margin-left: 8px">重置</a-button> -->
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :single-data="loadSingleData"
    >
      <!-- <div
        slot="expandedRowRender"
        slot-scope="record"
        style="margin: 0">
        <a-row
          :gutter="24"
          :style="{ marginBottom: '12px' }">
          <a-col :span="12" v-for="(role, index) in record.permissions" :key="index" :style="{ marginBottom: '12px' }">
            <a-col :span="4">
              <span>{{ role.permissionName }}：</span>
            </a-col>
            <a-col :span="20" v-if="role.actionEntitySet.length > 0">
              <a-tag color="cyan" v-for="(action, k) in role.actionEntitySet" :key="k">{{ action.describe }}</a-tag>
            </a-col>
            <a-col :span="20" v-else>-</a-col>
          </a-col>
        </a-row>
      </div> -->
      <a-tag color="blue" slot="status" slot-scope="text">{{ text | statusFilter }}</a-tag>
      <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
      <span slot="action" slot-scope="text, record">
        <a @click="$refs.modal.edit(record)">编辑</a>
        <a-popconfirm @confirm="handleDelete(record)" style="margin-left: 8px" title="确定删除此角色吗？">
          <!-- <template #icon><question-circle-outlined style="color: red" /></template> -->
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
import { getRolePageList, getRoleById, deleteRole } from '@/api/role'

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
      visible: false,

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
        // return this.$http.get('/role', {
        //   params: Object.assign(parameter, this.queryParam)
        // }).then(res => {
        //   return res.result
        // })
      },

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
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  },
  watch: {
    /*
      'selectedRows': function (selectedRows) {
        this.needTotalList = this.needTotalList.map(item => {
          return {
            ...item,
            total: selectedRows.reduce( (sum, val) => {
              return sum + val[item.dataIndex]
            }, 0)
          }
        })
      }
      */
  }
}
</script>
