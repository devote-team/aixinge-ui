<template>
  <a-result
    :isSuccess="true"
    :content="false"
    :title="email"
    :sub-title="description">
    <div class="desc">用户名: {{ username }}</div>
    <div class="desc">昵称: {{ nickname }}</div>
    <div class="desc">密码: {{ password }}</div>
    <template #extra>
      <!-- <a-button size="large" type="primary" @click="copy">复制信息</a-button> -->
      <a-button size="large" type="primary" style="margin-left: 8px" @click="goHomeHandle">返回首页</a-button>
    </template>

  </a-result>
</template>

<script>
export default {
  name: 'RegisterResult',
  data () {
    return {
      // description: '激活邮件已发送到你的邮箱中，邮件有效期为24小时。请及时登录邮箱，点击邮件中的链接激活帐户。',
      description: '',
      form: {}
    }
  },
  computed: {
    email () {
      return `账户添加成功`
    },
    username () {
      return this.form && this.form.username || 'xxx'
    },
    nickname () {
      return this.form && this.form.nickname || 'xxx'
    },
    password () {
      return this.form && this.form.password || 'xxx'
    }
  },
  created () {
    this.form = this.$route.params
  },
  methods: {
    goHomeHandle () {
      this.$router.push({ name: 'index' })
    }
  }
}
</script>

<style scoped>
.desc {
  max-width: 50%;
  margin: auto;
  font-size: 18px;
}
</style>
