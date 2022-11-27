<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-button
        type="primary"
        html-type="submit"
        @click.stop.prevent="handleSearch(searchState)"
      >添加</a-button>
    </div>

    <s-table :columns="columns" :data="loadData" :single-data="loadSingleData">

      <span slot="actions" slot-scope="text, record">
        <a-tag v-for="(action, index) in record.actionList" :key="index">{{ action.describe }}</a-tag>
      </span>

      <span slot="status" slot-scope="text">
        {{ text | statusFilter }}
      </span>

      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a-dropdown>
          <a class="ant-dropdown-link">
            更多 <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;">详情</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">禁用</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">删除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
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
          label="唯一识别码"
          hasFeedback
          validateStatus="success"
        >
          <a-input placeholder="唯一识别码" v-model="mdl.id" id="no" disabled="disabled" />
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
          <a-textarea :rows="5" v-model="mdl.describe" placeholder="..." id="describe"/>
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
            <a-select-option v-for="(action, index) in localMenustree" :key="index" :value="action.value">{{ action.label }}</a-select-option>
          </a-select>
        </a-form-item>

      </a-form>
    </a-modal>

  </a-card>
</template>

<script>
import { STable } from '@/components'
import { mapState } from 'vuex'

export default {
  name: 'TableList',
  components: {
    STable
  },
  computed: {
    ...mapState({
      menustree: state => state.user.menustree
    })
  },
  data () {
    return {
      description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',

      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
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
          title: '权限名称',
          dataIndex: 'label'
        },
        // {
        //   title: '可操作权限',
        //   dataIndex: 'actions',
        //   scopedSlots: { customRender: 'actions' }
        // },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 向后端拉取可以用的操作列表
      localMenustree: null,
      // 加载数据方法 必须为 Promise 对象
      loadSingleData: (parameter) => {
        return new Promise((resolve, reject) => {
          if (this.localMenustree) {
            resolve(this.localMenustree)
          } else {
            this.$store.dispatch('GetMenuListTree').then((res) => {
              this.loadMenus()
              resolve(this.localMenustree)
            }).catch(err => {
              reject(err)
            })
          }
         })
      },
      loadData: parameter => {
        return new Promise((resolve, reject) => {
          if (this.localMenustree) {
            resolve(this.localMenustree)
          } else {
            this.$store.dispatch('GetMenuListTree').then((res) => {
              this.loadMenus()
              resolve(this.localMenustree)
            }).catch(err => {
              reject(err)
            })
          }
         })
      },

      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        1: '正常',
        2: '禁用'
      }
      return statusMap[status]
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
      // localMenustree
      const that = this
      that.localMenustree = that.menustree.map(menu => {
        menu = Object.assign(menu, { label: this.$t(menu.meta.title || menu.name), value: menu.id })
        const options = menu.children ? menu.children.concat() : []
        menu.checkedAll = false
        menu.selected = []
        menu.indeterminate = false
        menu.children = options.map(option => {
          return Object.assign(option, { label: this.$t(option.meta.title || option.name), value: option.id, defaultChecked: false })
        })
        return menu
      }).sort((a, b) => a.id - b.id)
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
