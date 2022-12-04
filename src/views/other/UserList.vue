<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form
          layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="用户名" name="id" :rules="[{ required: true, message: '请输入用户名' }]">
                <a-input v-model="queryParam.username" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="状态">
                <a-select placeholder="请选择" default-value="0">
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
                  @click.stop.prevent="handleSearch(searchState)"
                >查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
      </div>

      <s-table
        size="default"
        ref="table"
        row-key="id"
        :columns="columns"
        :data="loadData"
        :single-data="loadSingleData"
        :loading="loading"
        :alert="alert"
        :row-selection="rowSelection"
        :show-pagination="true"
      >

        <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleChangePassword(record)">修改密码</a>
            <a-divider type="vertical" />
            <a @click="handleChangeRole(record)">角色配置</a>
            <a-divider type="vertical" />
            <a @click="handleChangeStatus(record)">{{ record.status === 1 ? '禁用' : '启用' }}</a>
            <a-divider type="vertical" />
            <a @click="handleDelete(record)">删除</a>
          </template>
        </span>
      </s-table>

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

        </a-form>
      </a-modal>
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
      <!-- 更改密码 -->
      <a-modal
        title="更改密码"
        style="top: 20px;"
        :width="800"
        v-model="pwdVisible"
        @ok="handleOk($event,'pwd')"
      >
        <a-form class="permission-form" :form="form">

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="ID"
            hasFeedback
            validateStatus="success"
            hidden="hidden"
          >
            <a-input
              placeholder="ID"
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
      </a-modal>

    </a-card>
  </page-header-wrapper>
</template>

<script>
import pick from 'lodash.pick'
import { STable } from '@/components'
import {
  getUserPageList,
  addUser,
  deleteUser,
  getUserById,
  changePassword,
  updateUserInfo
  // getUserRoleListById
} from '@/api/base'
// import { getRolePageList, getRoleById, deleteRole } from '@/api/role'
import { PERMISSION_ENUM } from '@/core/permission/permission'
import { scorePassword } from '@/utils/util'
import { Modal } from 'ant-design-vue'

const statusMap = {
  1: {
    status: 'success',
    text: '启用'
  },
  2: {
    status: 'error',
    text: '禁用'
  }
}

const columns = [
  {
    title: '用户名',
    dataIndex: 'userName'
  },
  {
    title: '昵称',
    dataIndex: 'nickName'
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
    width: '350px',
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
    },
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  data () {
    return {
      description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',

      visible: false,
      addVisible: false,
      pwdVisible: false,

      loading: false,

      alert: {
        show: true,
        clear: true
      },

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
      loadSingleData: (parameter) => {
        return getUserById(parameter)
          .then(res => {
            return res.data
          })
      },
      loadData: (parameter) => {
        const finalParameters = Object.assign(parameter, this.queryParam)
        console.log(finalParameters)
        return getUserPageList(finalParameters)
          .then(res => {
            console.log(res.data)
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
      return statusMap[key].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    },
    permissionFilter (key) {
      const permission = PERMISSION_ENUM[key]
      return permission && permission.label
    }
  },
  methods: {
    doAdd (values) {
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
    },
    doUpdate (values) {
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
    },
    doChangePassword (values) {
      changePassword({
        'newPassword': values.newPassword,
        'password': values.oldPassword,
        'username': values.userName
      }).then(response => {
        if (response.code === 0) {
          this.$notification['success']({ message: '成功', description: '修改成功', duration: 4 })
          this.$refs.table.refresh()
        } else {
          this.$notification['error']({ message: '错误', description: response.msg, duration: 4 })
        }
        this.pwdVisible = false
      }).catch(err => {
        this.$notification['error']({ message: '错误', description: err, duration: 4 })
        this.pwdVisible = false
      })
    },
    doDel (record) {
      deleteUser({
        ids: [record.id]
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
    handleRoleSelected (record) {
    },
    handleSearch () {
      this.$refs.table.refresh()
    },
    handleDelete (record) {
      const that = this
      Modal.confirm({
        title: '确定要删除么？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          that.doDel(record)
        },
        onCancel () {
        }
      })
    },
    handleChangePassword (record) {
      this.pwdVisible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(record, ['id', 'newPassword', 'oldPassword', 'userName']))
      })
    },
    handleChangeStatus (record) {
      const that = this
      Modal.confirm({
        title: '确定要' + (record.status === 1 ? '禁用' : '启用') + '么？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          record.status = record.status === 1 ? 2 : 1
          that.doUpdate(record)
        },
        onCancel () {
        }
      })
    },
    handleEdit (record) {
      this.visible = true
      console.log('record', record)

      this.$nextTick(() => {
        this.form.setFieldsValue(pick(record, ['id', 'status', 'avatar', 'userName', 'nickName']))
      })
    },
    handleOk (e, type) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (type === 'add') {
          this.doAdd(values)
        } else if (type === 'edit') {
          this.doUpdate(values)
        } else if (type === 'pwd') {
          this.doChangePassword(values)
        }
        console.log(err, values)
      })
    },
    handleAdd (record) {
      this.addVisible = true
      console.log('record', record)
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(record, ['id', 'status', 'password', 'userName', 'nickName']))
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
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  },
  watch: {}
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
