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
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="login-btn" type="primary">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'LoginIndex',
  data() {
    return {}
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
