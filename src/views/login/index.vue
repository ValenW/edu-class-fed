<template>
  <div class="login">
    <!--
      1. :model="ruleForm"
      2. :rules="rules"
      3. ref="ruleForm"
      4. el-form-item 绑定 prop 属性
     -->
    <el-form
      class="login-form"
      label-position="top"
      ref="form"
      label-width="80px"
    >
      <el-form-item label="手机号" prop="phone">
        <el-input type="number" v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="login-btn" type="primary" @click="submit"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { login } from '@/utils/request'

export default Vue.extend({
  name: 'LoginIndex',
  data() {
    return {
      form: {
        phone: '',
        password: ''
      }
    }
  },
  methods: {
    async submit() {
      const {
        data: { content, message, success }
      } = await login(this.form)
      if (!success) {
        this.$message.error(message)
      } else {
        this.$message.success('login success!')
        const data = JSON.parse(content)
        console.log(data.access_token)
        this.$router.push({ name: 'home' })
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-form {
    width: 300px;
    background: #fff;
    padding: 20px;
    border-radius: 5px;
  }
  .login-btn {
    width: 100%;
  }
}
</style>
