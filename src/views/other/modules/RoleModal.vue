<template>
  <!-- <a-modal
    title="操作"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  > -->
  <div v-if="visible">
    <!-- 添加角色 -->
    <a-modal
      title="添加角色"
      style="top: 20px;"
      :width="800"
      v-model="addVisible"
      @ok="handleOk($event, 'add')"
      @cancel="handleCancel"
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
            v-decorator="['name', {rules: [{ required: true, message: $t('user.nickname.required') }], validateTrigger: ['change', 'blur']}]"
          />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="别名"
          hasFeedback
        >
          <a-input
            placeholder="别名"
            v-decorator="['alias', {rules: [{ required: true, message: $t('user.userName.required') }], validateTrigger: ['change', 'blur']}]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 编辑角色 -->
    <a-modal
      title="编辑角色"
      style="top: 20px;"
      :width="800"
      v-model="editVisible"
      @ok="handleOk($event, 'edit')"
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
          label="角色名称"
          hasFeedback
        >
          <a-input
            placeholder="起一个名字"
            v-decorator="['name', {rules: [{ required: true, message: $t('user.nickname.required') }], validateTrigger: ['change', 'blur']}]"
          />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="别名"
          hasFeedback
        >
          <a-input
            placeholder="别名"
            v-decorator="['alias', {rules: [{ required: true, message: $t('user.userName.required') }], validateTrigger: ['change', 'blur']}]"
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
  </div>
  <!-- </a-modal> -->
</template>

<script>
import { getPermissions } from '@/api/manage'
import pick from 'lodash.pick'
import { createRole, updateRole } from '@/api/role'

export default {
  name: 'RoleModal',
  computed: {
    visible () {
      return this.addVisible || this.editVisible
    }
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      addVisible: false,
      editVisible: false,

      confirmLoading: false,
      mdl: {},

      form: this.$form.createForm(this),
      permissions: []
    }
  },
  created () {
    this.loadPermissions()
  },
  methods: {
    add (record) {
      this.addVisible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(record, 'name', 'alias'))
      })
    },
    edit (record) {
      this.editVisible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(record, 'id', 'name', 'status', 'alias'))
      })
    },
    close () {
      this.$emit('close')
      this.addVisible = false
      this.editVisible = false
    },
    handleOk (e, type) {
      const _this = this
      // 触发表单验证
      e.preventDefault()
      // 新增/修改 成功时，重载列表
      this.form.validateFields((err, values) => {
        if (err) return
        _this.confirmLoading = true
        if (type === 'add') {
          createRole({
            alias: values.alias,
            name: values.name
            }).then(response => {
              if (response.code === 0) {
                this.$notification['success']({ message: '成功', description: '添加成功', duration: 4 })
                _this.$emit('ok')
              } else {
                this.$notification['error']({ message: '错误', description: response.msg, duration: 4 })
              }
            }).catch(err => {
              this.$notification['error']({ message: '错误', description: err, duration: 4 })
            }).finally(() => {
              _this.confirmLoading = false
              _this.close()
            })
        } else if (type === 'edit') {
          updateRole({
              id: values.id,
              alias: values.alias,
              name: values.name,
              status: values.status
            }).then(response => {
              if (response.code === 0) {
                this.$notification['success']({ message: '成功', description: '修改成功', duration: 4 })
                _this.$emit('ok')
              } else {
                this.$notification['error']({ message: '错误', description: response.msg, duration: 4 })
              }
            }).catch(err => {
              this.$notification['error']({ message: '错误', description: err, duration: 4 })
            }).finally(() => {
              _this.confirmLoading = false
              _this.close()
            })
        }
      })
    },
    handleCancel () {
      this.close()
    },
    onChangeCheck (permission) {
      permission.indeterminate = !!permission.selected.length && (permission.selected.length < permission.actionsOptions.length)
      permission.checkedAll = permission.selected.length === permission.actionsOptions.length
    },
    onChangeCheckAll (e, permission) {
      Object.assign(permission, {
        selected: e.target.checked ? permission.actionsOptions.map(obj => obj.value) : [],
        indeterminate: false,
        checkedAll: e.target.checked
      })
    },
    loadPermissions () {
      const that = this
      getPermissions().then(res => {
        const result = res.result
        that.permissions = result.map(permission => {
          const options = JSON.parse(permission.actionData) || []
          permission.checkedAll = false
          permission.selected = []
          permission.indeterminate = false
          permission.actionsOptions = options.map(option => {
            return {
              label: option.describe,
              value: option.action
            }
          })
          return permission
        })
      })
    }

  }
}
</script>

<style scoped>

</style>
