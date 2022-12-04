import Vue from 'vue'
import {
  Button,
  Message,
  Transfer,
  Modal
} from 'ant-design-vue'
import { STable } from '@/components'

Vue.use(Button)
Vue.use(Transfer)
Vue.component('s-table', STable)

Vue.prototype.$message = Message
Vue.prototype.$model = Modal
