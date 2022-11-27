<!-- eslint-disable vue/valid-v-model -->
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

        <a-divider>拥有权限</a-divider>
        <template v-for="menu in localMenustree">
          <a-form-item
            v-if="menu.status"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            :key="menu.id"
            :label="menu.label"
          >
            <a-checkbox
              v-decorator="[`menu-${menu.id}`, { initialValue: menu.checkedAll, valuePropName: 'checked' }]"
              :indeterminate="menu.indeterminate"
              @change="onChangeCheckAll($event, menu)"
            >全选</a-checkbox>
            <a-checkbox-group
              @change="onChangeCheck($event, menu)"
              v-decorator="[`menu-${menu.id}`, { initialValue: menu.selected, valuePropName: 'value' }]"
              :options="menu.children" >
              <!-- <span :slot="label">{{ label }}</span> -->
            </a-checkbox-group>
          </a-form-item>
        </template>
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

        <a-divider>拥有权限</a-divider>
        <template v-for="menu in localMenustree">
          <a-form-item
            v-if="menu.status"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            :key="menu.id"
            :label="menu.label"
          >
            <a-checkbox
              v-decorator="[`menuroot-${menu.id}`, { initialValue: menu.checkedAll, valuePropName: 'checked' }]"
              :indeterminate="menu.indeterminate"
              @change="onChangeCheckAll($event, menu)"
            >全选</a-checkbox>
            <a-checkbox-group
              @change="onChangeCheck($event, menu)"
              v-decorator="[`menuitem-${menu.id}`, { initialValue: menu.selected, valuePropName: 'value' }]"
              :options="menu.children" >
              <!-- <span :slot="label">{{ label }}</span> -->
            </a-checkbox-group>
          </a-form-item>
        </template>
      </a-form>
    </a-modal>
  </div>
  <!-- </a-modal> -->
</template>

<script>
import pick from 'lodash.pick'
import { createRole, updateRole } from '@/api/role'
import { mapState } from 'vuex'

export default {
  name: 'RoleModal',
  computed: {
    ...mapState({
      menustree: state => state.user.menustree
    }),
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
      localMenustree: []
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
    add (record) {
      this.addVisible = true
      this.resetData()
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(record, 'name', 'alias'))
      })
    },
    edit (record) {
      this.editVisible = true
      this.resetData()
      this.handleSelected(record)
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(record, 'id', 'name', 'status', 'alias'))
      })
    },
    handleSelected (record) {
      if (record && record.menus.length) {
        // 先处理要勾选的权限结构
        const menuActions = []
        record.menus.forEach(menu => {
          menuActions.push(menu.id)
        })
        // 把权限表遍历一遍，设定要勾选的权限 action
        this.createSelected(this.localMenustree, menuActions)
      }
    },
    createSelected (source, actions, selected) {
      source.forEach(item => {
        if (!item.selected) item.selected = []
        if (actions.includes(item.id)) selected ? selected.push(item.id) : item.selected.push(item.id)
        if (item.children) this.createSelected(item.children, actions, item.selected)
        if (!selected) {
          if (item.selected.length && item.children.length && item.selected.length >= item.children.length) {
            item.checkedAll = true
            item.indeterminate = false
          }
          if (item.selected.length && item.children.length && item.selected.length < item.children.length) {
            item.checkedAll = false
            item.indeterminate = true
          }
        }
      })
    },
    resetData () {
      this.loadMenus()
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
    onChangeCheck (e, menu) {
      menu.selected = e
      menu.indeterminate = !!menu.selected.length && (menu.selected.length < menu.children.length)
      menu.checkedAll = menu.selected.length === menu.children.length
    },
    onChangeCheckAll (e, menu) {
      Object.assign(menu, {
        selected: e.target.checked ? menu.children.map(obj => obj.value) : [],
        indeterminate: false,
        checkedAll: e.target.checked
      })
    },
    loadMenus () {
      const that = this
      that.localMenustree = that.menustree.map(menu => {
        menu = Object.assign(menu, { label: this.$t(menu.meta.title || menu.name), value: menu.id })
        const options = menu.children ? menu.children.concat() : []
        menu.checkedAll = false
        menu.selected = []
        menu.indeterminate = false
        menu.children = options.map(option => {
          return Object.assign(option, { label: this.$t(option.meta.title || option.name), value: option.id })
        })
        return menu
      }).sort((a, b) => a.id - b.id)
    }

  }
}
</script>

<style scoped>

</style>
