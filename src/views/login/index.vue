<template>
  <div class="login">
    <el-form
      class="login-form"
      label-position="top"
      ref="form"
      :rules="rules"
      :model="form"
      label-width="80px"
    >
      <el-form-item label="手机号" prop="phone">
        <el-input type="text" v-model="form.phone" prop="phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="form.password"
          prop="password"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          class="login-btn"
          type="primary"
          @click="submit"
          :loading="doingLogin"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { login } from '@/services/user'
import { Form } from 'element-ui'

@Component
export default class LoginIndex extends Vue {
  $refs!: {
    form: Form
  }
  private doingLogin = false
  private form = {
    phone: process.env.VUE_APP_USER,
    password: process.env.VUE_APP_SECRET
  }
  private rules = {
    phone: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^1\d{10}$/, message: '请输入正确手机号', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 18, message: '密码长度应为6到18', trigger: 'blur' }
    ]
  }

  async submit() {
    if (!(await this.validateForm())) {
      return
    }

    this.doingLogin = true
    try {
      const {
        data: { content, message, success }
      } = await login(this.form)
      if (!success) {
        throw message
      }

      this.$store.commit('setUser', JSON.parse(content))
      this.$message.success('login success!')
      const redirect = this.$route.query.redirect || '/'
      this.$router.push(redirect as string)
    } catch (err) {
      this.$message.error(err)
    }

    this.doingLogin = false
  }

  private async validateForm(): Promise<boolean> {
    try {
      await this.$refs.form.validate()
      return true
    } catch (err) {
      this.$message.error('登录出错')
    }
    return false
  }
}
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
