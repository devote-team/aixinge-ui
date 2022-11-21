<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form
        layout="inline"
        :model="searchState"
      >
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="角色ID" name="id" :rules="[{ required: true, message: '请输入角色ID' }]">
              <a-input v-model="searchState.id" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <!-- <a-col :md="8" :sm="24">
            <a-form-item label="状态">
              <a-select placeholder="请选择" default-value="0">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
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
                @click.stop.prevent="handleAdd(record)"
              >添加</a-button>
              <!-- <a-button style="margin-left: 8px">重置</a-button> -->
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
      :single-data="loadSingleData"
      :expandedRowKeys="expandedRowKeys"
      @expand="handleExpand"
    >
      <!-- <div
        slot="expandedRowRender"
        slot-scope="record"
        style="margin: 0">
        <a-row
          :gutter="24"
          :style="{ marginBottom: '12px' }">
          <a-col :span="12" v-for="(role, index) in record.permissions" :key="index" :style="{ marginBottom: '12px', height: '23px' }">
            <a-col :lg="4" :md="24">
              <span>{{ role.permissionName }}：</span>
            </a-col>
            <a-col :lg="20" :md="24" v-if="role.actionList && role.actionList.length > 0">
              <a-tag color="cyan" v-for="action in role.actionList" :key="action">{{ action | permissionFilter }}</a-tag>
            </a-col>
            <a-col :span="20" v-else>-</a-col>
          </a-col>
        </a-row>
      </div> -->
      <a-tag color="blue" slot="status" slot-scope="text">{{ text | statusFilter }}</a-tag>
      <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-popconfirm @confirm="handleDelete(record)" style="margin-left: 8px" title="确定删除此账号吗？">
          <!-- <template #icon><question-circle-outlined style="color: red" /></template> -->
          <a href="#">删除</a>
        </a-popconfirm>
        <!-- <a-divider type="vertical" />
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
        </a-dropdown> -->
      </span>
    </s-table>

    <!-- 编辑用户 -->
    <a-modal
      title="操作"
      style="top: 20px;"
      :width="800"
      v-model="visible"
      @ok="handleOk($event,'edit')"
    >
      <a-form class="permission-form" :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="唯一识别码"
          hasFeedback
          validateStatus="success"
        >
          <a-input
            placeholder="唯一识别码"
            disabled="disabled"
            v-decorator="['id']"
          />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="头像"
          hasFeedback
          validateStatus="success"
        >
          <a-input
            placeholder="头像"
            v-decorator="['avatar']"
          />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="用户名"
          hasFeedback
          validateStatus="success"
        >
          <a-input
            placeholder="用户名"
            v-decorator="['userName']"
          />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="昵称"
          hasFeedback
          validateStatus="success"
        >
          <a-input
            placeholder="昵称"
            v-decorator="['nickName']"
          />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="状态"
          hasFeedback
        >
          <a-select v-decorator="['status', { initialValue: 1 }]">
            <a-select-option :value="1">正常</a-select-option>
            <a-select-option :value="2">禁用</a-select-option>
          </a-select>
        </a-form-item>

      </a-form>
    </a-modal>
    <!-- <a-modal
      title="操作"
      style="top: 20px;"
      :width="800"
      v-model="visible"
      @ok="handleOk($event,'edit')"
    >
      <a-form class="permission-form" :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="唯一识别码"
          hasFeedback
          validateStatus="success"
        >
          <a-input
            placeholder="唯一识别码"
            disabled="disabled"
            v-decorator="['id']"
          />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="用户名"
          hasFeedback
          validateStatus="success"
        >
          <a-input
            placeholder="用户名"
            disabled="disabled"
            v-decorator="['userName']"
          />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="原密码"
          hasFeedback
        >
          <a-input-password
            :placeholder="$t('user.password.required')"
            v-decorator="['oldPassword', {rules: [{ required: true, message: $t('user.password.required') }, { validator: this.handlePasswordLevel }], validateTrigger: ['change', 'blur']}]"
          />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="新密码"
          hasFeedback
        >
          <a-input-password
            :placeholder="$t('user.register.password.placeholder')"
            v-decorator="['newPassword', {rules: [{ required: true, message: $t('user.password.required') }, { validator: this.handlePasswordLevel }], validateTrigger: ['change', 'blur']}]"
          />
        </a-form-item>

      </a-form>
    </a-modal> -->
    <!-- 添加用户 -->
    <a-modal
      title="添加用户"
      style="top: 20px;"
      :width="800"
      v-model="addVisible"
      @ok="handleOk($event, 'add')"
    >
      <a-form class="permission-form" :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色名称"
          hasFeedback
        >
          <a-input
            placeholder="起一个名字"
            v-decorator="['nickName', {rules: [{ required: true, message: $t('user.nickname.required') }], validateTrigger: ['change', 'blur']}]"
          />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="用户名"
          hasFeedback
        >
          <a-input
            placeholder="用户名"
            v-decorator="['userName', {rules: [{ required: true, message: $t('user.userName.required') }], validateTrigger: ['change', 'blur']}]"
          />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="密码"
          hasFeedback
        >
          <a-input-password
            :placeholder="$t('user.register.password.placeholder')"
            v-decorator="['password', {rules: [{ required: true, message: $t('user.password.required') }, { validator: this.handlePasswordLevel }], validateTrigger: ['change', 'blur']}]"
          />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="确认密码"
          hasFeedback
        >
          <a-input-password
            @click="handlePasswordInputClick"
            :placeholder="$t('user.register.confirm-password.placeholder')"
            v-decorator="['password2', {rules: [{ required: true, message: $t('user.password.required') }, { validator: this.handlePasswordCheck }], validateTrigger: ['change', 'blur']}]"
          />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="状态"
          hasFeedback
        >
          <a-select v-decorator="['status', { initialValue: 1 }]">
            <a-select-option :value="1">正常</a-select-option>
            <a-select-option :value="2">禁用</a-select-option>
          </a-select>
        </a-form-item>

        <!-- <a-divider>拥有权限</a-divider>
        <template v-for="permission in permissions">
          <a-form-item
            class="permission-group"
            v-if="permission.actionsOptions && permission.actionsOptions.length > 0"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            :key="permission.permissionId"
            :label="permission.permissionName"
          >
            <a-checkbox>全选</a-checkbox>
            <a-checkbox-group v-decorator="[`permissions.${permission.permissionId}`]" :options="permission.actionsOptions"/>
          </a-form-item>
        </template> -->

      </a-form>
    </a-modal>

  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { STable } from '@/components'
// import { QuestionCircleOutlined } from '@ant-design/icons-vue'
// import { getRoleList, getServiceList } from '@/api/manage'
import { getUserPageList, addUser, delateUser, getUserById, updateUserInfo } from '@/api/base'
import { PERMISSION_ENUM } from '@/core/permission/permission'
import { scorePassword } from '@/utils/util'

const STATUS = {
  1: '启用',
  2: '禁用'
}

const columns = [
  {
    title: '唯一识别码',
    dataIndex: 'id'
  },
  {
    title: '用户名',
    dataIndex: 'userName'
  },
  {
    title: '角色名称',
    dataIndex: 'nickName'
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    scopedSlots: { customRender: 'createTime' },
    sorter: true
  }, {
    title: '操作',
    width: '150px',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

const levelNames = {
  0: 'user.password.strength.short',
  1: 'user.password.strength.low',
  2: 'user.password.strength.medium',
  3: 'user.password.strength.strong'
}
const levelClass = {
  0: 'error',
  1: 'error',
  2: 'warning',
  3: 'success'
}
const levelColor = {
  0: '#ff0000',
  1: '#ff0000',
  2: '#ff7e05',
  3: '#52c41a'
}

export default {
  name: 'TableList',
  components: {
    STable
    // QuestionCircleOutlined
  },
  computed: {
    passwordLevelClass () {
      return levelClass[this.state.passwordLevel]
    },
    passwordLevelName () {
      return levelNames[this.state.passwordLevel]
    },
    passwordLevelColor () {
      return levelColor[this.state.passwordLevel]
    }
  },
  data () {
    return {
      searchState: {
        id: null
      },
      description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',

      visible: false,
      addVisible: false,

      state: {
        time: 60,
        level: 0,
        smsSendBtn: false,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000'
      },

      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      form: this.$form.createForm(this),
      permissions: [],

      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns,
      // 加载数据方法 必须为 Promise 对象
      // loadData: parameter => {
      //   return getRoleList(parameter)
      //     .then(res => {
      //       console.log('getRoleList', res)
      //       // 展开全部行
      //       this.expandedRowKeys = res.result.data.map(item => item.id)
      //       return res.result
      //     })
      // },
      loadSingleData: (parameter) => {
        return getUserById(parameter).then(res => {
          return res.data
        })
      },
      loadData: (parameter) => {
        return getUserPageList(parameter).then(res => {
          // if (res.code === 0) {
          //   this.expandedRowKeys = res.data.list.map(item => item.id)
          // }
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
    },
    permissionFilter (key) {
      const permission = PERMISSION_ENUM[key]
      return permission && permission.label
    }
  },
  created () {
    // getServiceList().then(res => {
    //   console.log('getServiceList.call()', res)
    // })
    // getUserPageList({
    //   'page': 1,
    //   'pageSize': 10
    // }).then(res => {
    //   console.log('getUserPageList.call()', res)
    // })

    // getRoleList().then(res => {
    //   console.log('getRoleList.call()', res)
    // })
  },
  methods: {
    handleSearch (searchState) {
      this.$refs.table.loadData({ id: searchState.id })
    },
    handleDelete (record) {
      delateUser({
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
    handleEdit (record) {
      this.visible = true
      console.log('record', record)

      // const checkboxGroup = {}
      // this.permissions = record.permissions.map(permission => {
      //   const groupKey = `permissions.${permission.permissionId}`
      //   checkboxGroup[groupKey] = permission.actionList
      //   const actionsOptions = permission.actionEntitySet.map(action => {
      //     return {
      //       label: action.describe,
      //       value: action.action,
      //       defaultCheck: action.defaultCheck
      //     }
      //   })
      //   return {
      //     ...permission,
      //     actionsOptions
      //   }
      // })

      this.$nextTick(() => {
        // console.log('permissions', this.permissions)
        // console.log('checkboxGroup', checkboxGroup)

        // this.form.setFieldsValue(pick(record, ['id', 'status', 'describe', 'userName']))
        this.form.setFieldsValue(pick(record, ['id', 'status', 'avatar', 'userName', 'nickName']))
        // this.form.setFieldsValue(checkboxGroup)
      })
    },
    handleOk (e, type) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (type === 'add') {
          addUser({
              username: values.userName,
              nickname: values.nickName,
              password: values.password
            }).then(response => {
              if (response.code === 0) {
                this.$notification['success']({ message: '成功', description: '添加成功', duration: 4 })
                this.$refs.table.refresh()
              } else {
                this.$notification['error']({ message: '错误', description: response.msg, duration: 4 })
              }
              this.addVisible = false
            }).catch(err => {
              this.$notification['error']({ message: '错误', description: err, duration: 4 })
              this.addVisible = false
            })
        } else if (type === 'edit') {
          updateUserInfo({
              'avatar': values.avatar,
              'id': values.id,
              'nickName': values.nickName,
              'status': values.status,
              'userName': values.userName
            }).then(response => {
              if (response.code === 0) {
                this.$notification['success']({ message: '成功', description: '修改成功', duration: 4 })
                this.$refs.table.refresh()
              } else {
                this.$notification['error']({ message: '错误', description: response.msg, duration: 4 })
              }
              this.visible = false
            }).catch(err => {
              this.$notification['error']({ message: '错误', description: err, duration: 4 })
              this.visible = false
            })
        }
        console.log(err, values)
      })
    },
    handleAdd (record) {
      this.addVisible = true
      console.log('record', record)

      // const checkboxGroup = {}
      // this.permissions = record.permissions.map(permission => {
      //   const groupKey = `permissions.${permission.permissionId}`
      //   checkboxGroup[groupKey] = permission.actionList
      //   const actionsOptions = permission.actionEntitySet.map(action => {
      //     return {
      //       label: action.describe,
      //       value: action.action,
      //       defaultCheck: action.defaultCheck
      //     }
      //   })
      //   return {
      //     ...permission,
      //     actionsOptions
      //   }
      // })
      this.$nextTick(() => {
        // console.log('permissions', this.permissions)
        // console.log('checkboxGroup', checkboxGroup)
        this.form.setFieldsValue(pick(record, ['id', 'status', 'password', 'userName', 'nickName']))
        // this.form.setFieldsValue(checkboxGroup)
      })
    },
    handlePasswordLevel (rule, value, callback) {
      if (!value) {
       return callback()
      }
      console.log('scorePassword ; ', scorePassword(value))
      if (value.length >= 6) {
        if (scorePassword(value) >= 30) {
          this.state.level = 1
        }
        if (scorePassword(value) >= 60) {
        this.state.level = 2
        }
        if (scorePassword(value) >= 80) {
        this.state.level = 3
        }
      } else {
        this.state.level = 0
        callback(new Error(this.$t('user.password.strength.msg')))
      }
      this.state.passwordLevel = this.state.level
      this.state.percent = this.state.level * 33

      callback()
    },

    handlePasswordInputClick () {
      if (!this.isMobile) {
        this.state.passwordLevelChecked = true
        return
      }
      this.state.passwordLevelChecked = false
    },

    handlePasswordCheck (rule, value, callback) {
      const password = this.form.getFieldValue('password')
      // console.log('value', value)
      if (value === undefined) {
        callback(new Error(this.$t('user.password.required')))
      }
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error(this.$t('user.password.twice.msg')))
      }
      callback()
    },
    onChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleExpand (expanded, record) {
      console.log('expanded', expanded, record)
      if (expanded) {
        this.expandedRowKeys.push(record.id)
      } else {
        this.expandedRowKeys = this.expandedRowKeys.filter(item => record.id !== item)
      }
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

<style lang="less" scoped>
.permission-form {
  :deep(.permission-group) {
    margin-top: 0;
    margin-bottom: 0;
  }
}

</style>
