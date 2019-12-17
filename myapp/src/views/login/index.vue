<template>
  <div class="app-container">
    <div :style="height" class="login">
      <el-row type="flex" justify="center">
        <el-col :span="24">
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
            <el-form-item>
              <h2>后台管理</h2>
            </el-form-item>
            <el-form-item label="用户名:" prop="name" class="changeColor">
              <el-input v-model="ruleForm.name" prefix-icon="el-icon-user-solid"/>
            </el-form-item>
            <el-form-item label="密码:" prop="pass" class="changeColor">
              <el-input v-model="ruleForm.pass" type="password" prefix-icon="el-icon-s-goods"/>
            </el-form-item>
            <el-form-item label="验证码" prop="code" class="changeColor">
              <el-input v-model="ruleForm.code" class="yanzhen"/>
              <div class="verificationCode" >
                <securityCode
                  ref="child"
                  @child-msg="getcode" />
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">登 &nbsp;&nbsp;录</el-button>
            </el-form-item>
          </el-form>

        </el-col>
      </el-row>

    </div>
  </div>
</template>

<script>
import api from '@/uitls/api'
import qs from 'qs'
import securityCode from '@/components/securityCode'
export default {
  components: {
    securityCode
  },
  data() {
    var that = this
    var codeOK = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('验证码不能为空'))
      } else if (value === that.ruleForm.yanzhenLo || value === that.ruleForm.yanzhenUp) {
        callback()
        // that.$refs.child.refreshCode()
        // return callback(new Error('验证码错误'))
      } else {
        that.$refs.child.refreshCode()
        return callback(new Error('验证码错误'))
      }
    }

    return {
      codeRe: true,
      test: '1',
      codeList: '0',
      securityCode: '',
      height: { height: '1000px' },
      ruleForm: {
        name: '',
        pass: '',
        code: '',
        yanzhenLo: '',
        yanzhenUp: ''
      },
      rules: {
        code: [
          { validator: codeOK, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        pass: [
          { required: true, message: '  请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.height.height = window.screen.height
  },
  methods: {
    // 获取验证码
    getcode(val) {
      this.ruleForm.yanzhenLo = val.toLowerCase()
      this.ruleForm.yanzhenUp = val.toUpperCase()
      console.log()
    },
    jump(e) {
      this.$router.push({
        path: '/index',
        query: {
          loginName: e.loginName,
          token: e.token
        }
      })
    },
    validateUser() {
      const apiUrl = this.HOST + `${api.login}`
      this.$axios({
        url: apiUrl,
        method: 'POST',
        data: qs.stringify({
          userName: this.ruleForm.name,
          password: this.ruleForm.pass
        })
      }).then(res => {
        if (res.data.code === 0) {
          this.jump(res.data.object)
        } else {
          alert('用户名密码错误')
        }
      }).catch(e => {
        console.log(e)
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.validateUser()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style scoped>

.yanzhen{
  width: 60%;
  float: left;
}
.verificationCode{
  float: left;
  width: 30%;
  height: 44px;
  margin-left: 9%;
  font-size: 20px;
  background-color: antiquewhite;
}
.demo-ruleForm{
  margin-bottom: 50px;
}
.app-container{
  width: 100%;
  /* height: 3020px; */
  background-color: #2d3a4b;
  overflow: hidden;
}
.login{
  width: 40%;
  height: 370px;
  margin: 10% 0 30% 30%;
  background-color: #283443;
  border-radius: 4px;
}
.el-col{
  margin-right: 30px;
  width: 80%;
}
.el-form-item{
  margin-top: 0;
  color: #ffffff;
  text-align: center;
  margin-right: 20px
  }
.el-button{
  color: #ffffff;
  width: 100%;
  margin: 0 auto;
  height: 45px;
  font-size: 25px;
}
</style>
