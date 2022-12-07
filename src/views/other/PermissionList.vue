<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- 查询栏 -->
      <div class="table-page-search-wrapper">
        <a-form
          layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="菜单名称" name="id" :rules="[{ required: true, message: '请输入菜单名称' }]">
                <a-input v-model="queryParam.title" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="状态">
                <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">启用</a-select-option>
                  <a-select-option value="2">禁用</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button
                  type="primary"
                  html-type="submit"
                  @click.stop.prevent="handleSearch()"
                >查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <!-- 操作栏 -->
      <div class="table-operator">
        <a-button
          type="primary"
          html-type="submit"
          @click.stop.prevent="handleSearch(searchState)">
          添加
        </a-button>
      </div>

      <!-- 用户列表 -->
      <s-table
        size="default"
        ref="table"
        row-key="id"
        :columns="columns"
        :data="loadData"
        :single-data="loadSingleData"
        :scroll="{ x: true }"
        :indent-size="5">
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleChangeStatus(record)">{{ record.status === 1 ? '禁用' : '启用' }}</a>
            <a-divider type="vertical" />
            <a @click="handleDelete(record)">删除</a>
          </template>
        </span>
      </s-table>

      <a-modal
        title="操作"
        :width="800"
        v-model="visible"
        @ok="handleOk"
      >
        <a-form :autoFormCreate="(form)=>{this.form = form}">

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="ID"
            hasFeedback
            validateStatus="success"
          >
            <a-input placeholder="ID" v-model="mdl.id" id="no" disabled="disabled" />
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="权限名称"
            hasFeedback
            validateStatus="success"
          >
            <a-input placeholder="起一个名字" v-model="mdl.name" id="permission_name" />
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="状态"
            hasFeedback
            validateStatus="warning"
          >
            <a-select v-model="mdl.status">
              <a-select-option value="1">正常</a-select-option>
              <a-select-option value="2">禁用</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="描述"
            hasFeedback
          >
            <a-textarea :rows="5" v-model="mdl.describe" placeholder="..." id="describe" />
          </a-form-item>

          <a-divider />

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="赋予权限"
            hasFeedback
          >
            <a-select
              style="width: 100%"
              mode="multiple"
              v-model="mdl.actions"
              :allowClear="true"
            >
              <a-select-option v-for="(action, index) in localMenustree" :key="index" :value="action.value">
                {{ action.label }}
              </a-select-option>
            </a-select>
          </a-form-item>

        </a-form>
      </a-modal>

    </a-card>
  </page-header-wrapper>
</template>

<script>
import { mapState } from 'vuex'
import { labelCol, statusMap, wrapperCol } from '@/utils/constant'
import { getMenuById, getMenuListTree } from '@/api/menu'

export default {
  name: 'TableList',
  computed: {
    ...mapState({
      menustree: state => state.user.menustree
    })
  },
  data () {
    return {
      description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',

      visible: false,

      labelCol: labelCol,
      wrapperCol: wrapperCol,
      form: null,
      mdl: {},

      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '菜单标题',
          width: 250,
          fixed: 'left',
          dataIndex: 'meta.title',
          customRender: (text) => {
            return this.$t(text)
          }
        },
        {
          title: '序号',
          width: 60,
          dataIndex: 'sort'
        },
        {
          title: '是否隐藏',
          width: 100,
          dataIndex: 'hidden',
          customRender: (text) => {
            return text === '1' ? '是' : '否'
          }
        },
        {
          title: '状态',
          width: 100,
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '路由名称',
          width: 200,
          dataIndex: 'name'
        },
        {
          title: '路由地址',
          width: 300,
          dataIndex: 'path'
        },
        {
          title: '重定向地址',
          width: 300,
          dataIndex: 'redirect'
        },
        {
          title: '资源路径',
          width: 300,
          dataIndex: 'component'
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '操作',
          width: 200,
          fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 向后端拉取可以用的操作列表
      localMenustree: null,
      // 加载数据方法 必须为 Promise 对象
      loadSingleData: (parameter) => {
        return getMenuById(parameter)
          .then(res => {
            return res.data
          })
      },
      loadData: parameter => {
        const finalParameters = Object.assign(parameter, this.queryParam)
        return getMenuListTree(finalParameters)
          .then(res => {
            return res.data
          })
      },

      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
    statusFilter (key) {
      return statusMap[key].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  created () {
    if (!this.menustree.length) {
      this.$store.dispatch('GetMenuListTree')
        .then(res => {
          this.loadMenus()
        })
    } else {
      this.loadMenus()
    }
  },
  methods: {
    loadMenus () {
      // localMenusTree
      const that = this
      that.localMenustree = that.menustree.map(menu => {
        menu = Object.assign(menu, { label: this.$t(menu.meta.title || menu.name), value: menu.id })
        const options = menu.children ? menu.children.concat() : []
        menu.checkedAll = false
        menu.selected = []
        menu.indeterminate = false
        menu.children = options.map(option => {
          return Object.assign(option, {
            label: this.$t(option.meta.title || option.name),
            value: option.id,
            defaultChecked: false
          })
        })
        return menu
      }).sort((a, b) => a.id - b.id)
    },
    handleSearch () {
      this.$refs.table.refresh()
    },
    handleEdit (record) {
      this.mdl = Object.assign({}, record)
      console.log(this.mdl)
      this.visible = true
    },
    handleOk () {

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
