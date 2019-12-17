<template>
  <el-container>
    <el-header>
      <el-button size="medium" type="primary" @click="goback">返回</el-button>
      版本管理
    </el-header>
    <el-main>
      <!-- <p>当前版本：{{ test }}</p>
      <div class="demo-input-suffix">
        <el-row>
          <el-col :span="6" >
            <div class="text">
              更新版本
            </div>
            <el-input
              v-model="input1"
              placeholder="请输入跟新版本号"
            />
          </el-col>
        </el-row>
        <div class="uploading">
          <el-upload
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList"
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple>
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </div>
        <div class="checkBox">
          <template>
            <p>是否强制更新</p>
            <el-radio v-model="radio" label="1">是</el-radio>
            <el-radio v-model="radio" label="2">否</el-radio>
          </template>
        </div>
      </div> -->
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm">
        <el-form-item label="当前版本" prop="currentCode">
          <el-input v-model="ruleForm.currentCode" :disabled="true"/>
        </el-form-item>
        <el-form-item label="更新版本" prop="nextCode">
          <el-input v-model="ruleForm.nextCode"/>
        </el-form-item>
        <el-form-item label="是否强制更新" prop="radio">
          <el-radio-group v-model="ruleForm.radio">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传文件" prop="uploadFile">
          <el-upload
            :on-change="handleChange"
            :file-list="fileList"
            :headers="uploadingHearder()"
            :action="uploadingURL()"
            :on-success="handleAvatarSuccess"
            class="upload-demo">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <!-- <el-upload
            ref="upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :auto-upload="false"
            action="http://113.204.20.254:8181/upload/upload/apk"
            header:token
            show-file-list
            style="height:100px"
            class="upload-demo">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          </el-upload> -->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import api from '@/uitls/api'
import qs from 'qs'
export default {
  data() {
    return {
      rURL: '',
      herf: api.pak,
      token: '',
      loginName: '1',
      fileList: [],
      ruleForm: {
        currentCode: '',
        nextCode: '',
        radio: '',
        resource: '',
        uploadFile: ''
      },
      rules: {
        currentCode: [
          { required: true, message: '请获取当前版本', trigger: 'blur' }
        ],
        nextCode: [
          { required: true, message: '请输入更新版本', trigger: 'blur' }
        ],
        radio: [
          { required: true, message: '请至少选择一个', trigger: 'change' }
        ]

      }
    }
  },
  created() {
    // 初始化token
    this.getToken()
    // 获取当前版本信息
    this.getLatestConfig()
  },
  // data() {
  //   return {
  //     radio: '',
  //     test: '1.1.1',
  //     input1: '',
  //     fileList: [{ name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }, { name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }]
  //   }
  // },
  methods: {
    // 获取上穿后的参数
    handleAvatarSuccess(response, file, fileList) {
      this.rURL = response.object
    },
    // 上传头部信息
    uploadingHearder() {
      return { token: this.token }
    },
    // 上传地址
    uploadingURL() {
      // return this.HOST + `${api.apk}`
      return this.URLT + `${api.apk}`
    },
    // 测试
    test1() {
      // alert(this.token)
    },
    test() {
      return '111'
    },
    // 上传数据
    uploadingData() {
      // const name = {
      //   file: this.fileList[0].name
      // }
      // this.$axios({
      //   header: {
      //     token: this.token
      //   },
      //   url: `${api.apk}`,
      //   method: 'POST',
      //   data: qs.stringify(name)
      // }).then(res => {
      //   this.herf = `${api.apk}` + res.data.object
      // }).catch()
    },
    // 获取当前版本
    getLatestConfig() {
      this.$axios({
        headers: {
          token: this.token
        },
        url: this.HOST + `${api.getLatestConfig}`,
        method: 'POST'
      }).then(res => {
        // console.log(res.data)
        this.ruleForm.currentCode = res.data.object.versionCode
      }).catch()
    },
    // 返回版本管理界面
    goback() {
      this.$router.push({
        path: '/versionsManage',
        query: {
          token: this.token,
          loginName: this.loginName
        }
      })
    },
    // 获取token
    getToken() {
      this.token = this.$route.query.token
    },
    // handleRemove(file, fileList) {
    //   console.log(file, fileList)
    // },
    // handlePreview(file) {
    //   console.log(file)
    // },
    // handleExceed(files, fileList) {
    //   this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    // },
    // beforeRemove(file, fileList) {
    //   return this.$confirm(`确定移除 ${file.name}？`)
    // }
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3)
    },
    // handleRemove(file, fileList) {
    //   console.log(file, fileList)
    // },
    // handlePreview(file) {
    //   console.log(file)
    // },
    addVersionConfig() {
      const param = {
        versionCode: this.ruleForm.nextCode,
        apk: this.rURL,
        isForceUpdate: this.ruleForm.radio
      }
      this.$axios({
        headers: {
          token: this.token
        },
        url: this.HOST + `${api.addVersionConfig}`,
        method: 'POST',
        data: qs.stringify(param)
      }).then(res => {
        console.log(res.data)
        if (res.data.code === 0) {
          alert('创建成功')
        } else {
          alert('创建失败')
        }
      }).catch()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addVersionConfig()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.upload-demo{
  background-color: #ffffff;
  height: 80px;
}
.demo-ruleForm{
  width: 40%;
}
.el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: left;
    line-height: 60px;
  }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: left;
    line-height: 20px;
  }
  .text{
   margin-top: 20px;
   margin-bottom: 20px;
  }
  .uploading{
    width: 30%;
    height: 150px;
    margin-top: 40px;
    background-color: #ffffff;
  }
  .checkBox{
    margin-top: 30px;
  }
</style>
