<template>
  <div class="app-container">
    <div class="header">
      <el-row :gutter="10">
        <el-col :xs="6" :sm="6" :md="12" :lg="12" :xl="16"><span>用户管理</span>
          <el-button style="margin-left:20px" @click="goVersionsMag()">版本管理</el-button>
          <el-button style="margin-left:20px" @click="goback">退出登录</el-button>
        </el-col>
        <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="4">
          <el-input
            v-model="input2"
            placeholder="请输入姓名或手机号或支付凭证码"
            prefix-icon="el-icon-search"
          />
        </el-col>
        <el-col :xs="6" :sm="6" :md="4" :lg="4" :xl="4">
          <el-button type="primary" icon="el-icon-search" @click="getScrch()">搜索</el-button>
          <el-button type="primary" @click="reSet()">重置</el-button>
        </el-col>

      </el-row>
    </div>
    <div class="app-body">
      <div class="tables">
        <el-table
          :data="tableData"
          height="700"
          border
          style="width: 100%"
        >
          <el-table-column
            label="用户ID"
            width="180"
            align="center"
            prop="id"
          />
          <el-table-column
            prop="realName"
            label="姓名"
            width="180"
            align="center"
          />
          <el-table-column
            prop="userName"
            width="180"
            label="手机号"
            align="center"
          />
          <el-table-column
            prop="userType"
            label="商户类型"
            align="center"
          />
          <el-table-column
            prop="inviteUserName"
            label="邀请人"
            align="center"
          />
          <el-table-column
            prop="transactTimeStr"
            label="办理时间"
            align="center"
          />
          <el-table-column
            prop="orders.proofCode"
            label="支付凭证码"
            align="center"
          />
          <el-table-column
            label="状态"
            align="center"
            prop="transactStatus"
          >
            <!-- <template slot="header" slot-scope="scope"> -->
            <template slot="header">
              <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  状态<i class="el-icon-arrow-down el-icon--right"/>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(item,i) in userStatus" :key="i" @click.native="serchdown(i)">{{ item.value }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
          >
            <template slot-scope="scope">
              <el-button size="small" @click="handleClick(scope.row)">详情</el-button>
              <el-link :underline="false" :href="href" target="_blank" @click="download(scope.row)">
                <el-button v-if="isshowdowlond(scope.row)" size="small">下载</el-button>
              </el-link>
              <el-button v-if="isshow(scope.row)" size="small" type="primary" @click="opentwo(scope.row)">付款</el-button>
              <el-button v-if="isshowshenhe(scope.row)" size="small" @click="getStatus(scope.row)">审核</el-button>
              <!-- <el-button size="small" @click="getStatus(scope.row)">审核</el-button> -->
              <el-button v-if="isshowstuikuan(scope.row)" size="small" type="danger" @click="openrefund(scope.row)">退款</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <div class="block">
        <el-pagination
          :current-page.sync="currentPage2"
          :page-sizes="[50, 100, 200, 500]"
          :page-size="pageSize"
          :total="pageData.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
      </div>
    </div>
    <div>
      <el-dialog
        :visible.sync="dialogVisible"
        :before-close="handleClose"
        title="状态修改"
        width="50%">
        <template>
          <div class="radios" @change="getradio()">
            <!-- <el-radio v-model="radio" label="1">待支付</el-radio>
            <el-radio v-model="radio" label="2">审核中</el-radio> -->
            <!-- <el-radio v-model="radio" label="3">代办成功</el-radio> -->
            <el-radio v-model="radio" label="4">资料异常</el-radio>
            <el-radio v-model="radio" label="5">办理成功</el-radio>
            <!-- <el-radio v-model="radio" label="6">支付待审核</el-radio> -->
          </div>
          <div class="checked">
            <el-checkbox-group v-model="checkList">
              <el-checkbox :disabled="disableValue" label="营业执照有误 "/>
              <el-checkbox :disabled="disableValue" label="身份证信息有误 "/>
              <el-checkbox :disabled="disableValue" label="银行卡有误 "/>
            </el-checkbox-group>
          </div>
          <div class="tip">
            <p style="color:red">请选择状态</p>
          </div>
        </template>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="changeStatus1(checkList)">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div>
      <el-dialog
        :visible.sync="dialogVisible_1"
        :before-close="handleClose"
        title="状态修改"
        width="50%">
        <template>
          <div class="radios" @change="getradio()">
            <!-- <el-radio v-model="radio" label="0">未办理</el-radio>
            <el-radio v-model="radio" label="1">待支付</el-radio>
            <el-radio v-model="radio" label="2">审核中</el-radio> -->
            <el-radio v-model="radio" label="3">代办成功</el-radio>
            <el-radio v-model="radio" label="4">资料异常</el-radio>
            <!-- <el-radio v-model="radio" label="5">办理成功</el-radio>
            <el-radio v-model="radio" label="6">付款待审核</el-radio> -->
          </div>
          <div class="checked">
            <el-checkbox-group v-model="checkList">
              <el-checkbox :disabled="disableValue" label="身份证信息有误"/>
            </el-checkbox-group>
          </div>
          <p style="color:red"><span class="tip">请选择异常信息</span></p>
        </template>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible_1 = false">取 消</el-button>
          <el-button type="primary" @click="changeStatus1(checkList)">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import api from '@/uitls/api'
import qs from 'qs'

export default {
  data() {
    return {
      userStatus: [
        { value: '未办理', text: '未办理' },
        { value: '待支付', text: '待支付' },
        { value: '审核中', text: '审核中' },
        { value: '代办成功', text: '代办成功' },
        { value: '资料异常', text: '资料异常' },
        { value: '办理成功', text: '办理成功' },
        { value: '付款待审核', text: '付款待审核' }
      ],
      proofCode: '',
      href: '',
      checkList: [],
      exception: '',
      disableValue: true,
      radio: '1',
      totall: 200,
      currentPage2: 1,
      userType: [{ value0: '初始化', value1: '标准商户', value2: 'vip商户' }],
      userName: '',
      tellnum: '',
      pageSize: 50,
      value: '',
      loginName: '',
      token: '',
      dialogVisible: false,
      dialogVisible_1: false,
      input2: '',
      userId: '',
      id: {},
      tableData: [],
      textarea: '',
      pageData: {},
      statusVal: ''
    }
  },
  created() {
    this.getlogindata()
    this.getUser()
  },
  methods: {
    // 前往版本管理界面
    goVersionsMag() {
      this.$router.push({
        path: '/versionsManage',
        query: {
          token: this.token
        }
      })
    },
    // 筛选状态
    serchdown(val) {
      this.statusVal = val
      this.ScrchUser(val)
    },
    filterTag(value, row) {
      return row.transactStatus === value
    },
    reSet() {
      this.statusVal = ''
      this.input2 = ''
      this.getUser()
    },
    tuikuan(row) {
      const curr = this.currentPage2
      const size = this.pageSize
      const ordersIds = {
        ordersId: row.orders.id
      }
      const apiUrl = this.HOST + `${api.refund}`
      this.$axios({
        headers: {
          token: this.token
        },
        url: apiUrl,
        method: 'POST',
        data: qs.stringify(ordersIds)
      }).then(res => {
        this.getUser(size, curr)
      }).catch()
    },
    isshowstuikuan(row) {
      if (row.transactStatus) {
        if (row.transactStatus === '审核中' || row.transactStatus === '资料异常') {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    isshowdowlond(row) {
      if (row.transactStatus === '未办理') {
        return false
      } else {
        return true
      }
    },
    isshowshenhe(row) {
      if (row.transactStatus === '审核中') {
        return true
      } else {
        return false
      }
    },
    openrefund(row) {
      this.$confirm('是否退款, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tuikuan(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    opentwo(row) {
      this.$confirm('是否已付款, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.accountPaid(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    accountPaid(row) {
      if (row.orders === null) {
        alert('该用户没有订单资料')
      } else {
        const ordersIds = {
          ordersId: row.orders.id
        }
        const apiUrl = this.HOST + `${api.affirmIsPay}`
        this.$axios({
          headers: {
            token: this.token
          },
          url: apiUrl,
          method: 'POST',
          data: qs.stringify(ordersIds)
        }).then(res => {
          if (res.data.code === -1) {
            alert('操作失败')
          }
          this.refresh()
        }).catch()
      }
    },
    download(row) {
      this.href = this.HOST + `${api.download}?ordersId=${row.orders.id}&downloadCheck=${row.downloadCheck}`
    },
    isshow(row) {
      if (row.transactStatus === '支付待审核') {
        return true
      } else {
        return false
      }
    },
    opentip() {
      const h = this.$createElement
      this.$notify({
        title: '提示',
        message: h('i', { style: 'color: teal' }, '请选择状态')
      })
    },
    changeStatus1() {
      if (this.radio === '4') {
        this.exception = []
        this.exception = this.checkList.toString()
        if (this.exception.length === 0) {
          console.log('没有信息')
        } else {
          this.checkOrder()
          this.dialogVisible_1 = false
          this.dialogVisible = false
        }
      } else if (this.radio === '1') {
        alert('请选择状态')
      } else {
        this.exception = []
        this.checkOrder()
        this.dialogVisible_1 = false
        this.dialogVisible = false
      }
    },
    checkOrder() {
      const param = {
        id: this.userId,
        transactStatus: this.radio,
        exception: this.exception
      }
      const apiUrl = this.HOST + `${api.checkOrder}`
      this.$axios({
        headers: {
          token: this.token
        },
        url: apiUrl,
        method: 'POST',
        data: qs.stringify(param)
      }).then(res => {
        if (res.data.code === 0) {
          this.refresh()
        } else if (res.data.code === -1) {
          alert('操作失败')
        } else {
          alert('操作无效')
        }
      }).catch()
    },
    refresh() {
      const curr = this.currentPage2
      const size = this.pageSize
      this.getUser(size, curr)
    },
    getradio() {
      if (this.radio === '4') {
        this.disableValue = false
      } else {
        this.disableValue = true
      }
    },
    ScrchUser(val) {
      const apiUrl = this.HOST + `${api.userListByPage}?`
      const propt = {
        currentPage: this.currentPage2,
        pageSize: this.pageSize,
        realName: this.userName,
        userName: this.tellnum,
        proofCode: this.proofCode,
        transactStatus: this.statusVal
      }
      this.$axios({
        headers: {
          token: this.token
        },
        url: apiUrl,
        method: 'POST',
        data: qs.stringify(propt)
      }).then((res) => {
        if (res.data.code === -2) {
          this.goback()
        } else {
          this.userName = ''
          this.tellnum = ''
          this.proofCode = ''
          this.pageData.total = res.data.object.total
          this.datadeal(res.data.object.list)
        }
      }).catch((error) => { // 请求失败处理
        console.log(error)
      })
    },
    getScrch() {
      const re = /[A-Za-z]+/
      const resu = this.input2.search(re)
      if (resu >= 0) {
        this.proofCode = this.input2
        this.ScrchUser()
      } else {
        if (this.input2.length <= 6 && this.input2.length > 0) {
          this.userName = this.input2
          this.ScrchUser()
        } else if (this.input2 === '' || this.input2 === null) {
          this.getUser()
        } else {
          this.tellnum = this.input2
          this.ScrchUser()
        }
      }
    },
    getlogindata() {
      this.token = this.$route.query.token
      this.logindata = this.$route.query.loginName
    },
    getStatus1(row) {
      this.dialogVisible = true
      this.userId = row.orders.id
    },
    getStatus(row) {
      // const param = {
      //   id: row.id,
      //   transactStatus: row.transactStatus
      // }
      // const apiUrl = this.HOST + `${api.checkOrder}`
      // this.$axios({
      //   headers: {
      //     token: this.token
      //   },
      //   url: apiUrl,
      //   method: 'POST',
      //   param: qs.stringify(param)
      // }).then(res => {
      //   console.log(res)
      // }).catch()
      // console.log(row.orders.status)
      if (row.orders === null) {
        this.dialogVisible_1 = true
        this.userId = row.orders.id
      } else {
        if (row.orders.status === '1') {
          this.dialogVisible_1 = true
          this.userId = row.orders.id
        } else {
          this.getStatus1(row)
        }
      }
    },
    handleSizeChange(val) {
      // const curr = this.currentPage2
      // this.pageSize = val
      this.ScrchUser()
    },
    handleCurrentChange(curr) {
      // const page = this.pageSize
      this.ScrchUser()
    },
    datadeal(obj) {
      this.tableData = []
      for (const u in obj) {
        if (obj[u].userType === '0') {
          obj[u].userType = '初始化'
        } else if (obj[u].userType === '1') {
          obj[u].userType = '标准商户'
        } else if (obj[u].userType === '2') {
          obj[u].userType = 'vip商户'
        } else {
          obj[u].userType = '错误商户'
        }
        switch (obj[u].transactStatus) {
          case '0':
            obj[u].transactStatus = '未办理'
            break
          case '1':
            obj[u].transactStatus = '待支付'
            break
          case '2':
            obj[u].transactStatus = '审核中'
            break
          case '3':
            obj[u].transactStatus = '代办成功'
            break
          case '4':
            obj[u].transactStatus = '资料异常'
            break
          case '5':
            obj[u].transactStatus = '办理成功'
            break
          case '6':
            obj[u].transactStatus = '支付待审核'
            break
          default:
            obj[u].transactStatus = '状态异常'
            break
        }

        this.tableData.push(obj[u])
      }
    },
    // 返回登录页
    goback() {
      this.token = ''
      this.$router.push({
        path: '/'

      })
    },
    getUser(val = 50, curr = 1) {
      const propt = {
        pageSize: val,
        currentPage: curr
      }
      const apiUrl = this.HOST + `${api.userListByPage}`
      const param = new URLSearchParams()
      param.append('pageSize', propt.pageSize)
      param.append('currentPage', propt.currentPage)
      this.$axios({
        headers: {
          token: this.token
        },
        url: apiUrl,
        method: 'POST',
        data: qs.stringify(propt)
      }).then((res) => {
        console.log(res)
        if (res.data.code === -2) {
          this.goback()
        } else {
          this.pageData.pageNum = res.data.object.pageNum
          // this.pageData.pageSize = res.data.object.pageSize
          this.pageData.total = res.data.object.total
          this.datadeal(res.data.object.list)
        }
      }).catch((error) => { // 请求失败处理
        console.log(error)
      })
    },
    changeStatus(value) {
      const param = {
        id: this.userId,
        transactStatus: value,
        exception: ''
      }
      this.$axios({
        headers: {
          token: this.token
        },
        url: this.HOST + `${api.checkOrder}`,
        method: 'POST',
        data: qs.stringify(param)
      }).then(res => {
        console.log(res.data)
      })
      this.dialogVisible = false
    },
    handleClose(done) {
      done()
    },
    open() {
      this.$alert('这是一段内容', '标题名称', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'info',
            message: `action: ${action}`
          })
        }
      })
    },
    handleClick(row) {
      console.log(row.id)
      if (row.transactStatus === '未办理') {
        alert('该用户未注册')
      } else {
        this.$router.push({
          path: '/info',
          query: {
            id: row.id,
            token: this.token
          }
        })
      }
    }
  }

}
</script>

<style  scoped>
  .tip{
    display: none;
  }
  .checked{
    margin-top: 20px;
    padding-left: 30px;
  }
  .radios{
    width: 50%;
  }
  .radios .el-radio{
    margin: 10px;
  }
  .header{
    margin-top: 30px;
    border-bottom:3px solid #f3f4f5;
    line-height: 30px;
  }
   .el-row {
    margin-bottom: 20px;
  }
  margin-bottom :ast-child {
      margin-bottom: 10px;
    }
  .el-col {
    border-radius: 4px;
  }
  .el-col span{
   margin-left: 20px ;
  }
  .tables{
    margin-top: 20px;
  }
  .footer{
    width: 100%;
  }
  .total{
    margin-top: 100px;
  }
  .page{
    width: 500px;
    margin: 0 auto;
  }
  .box-bu{
    width: 50px;
  }
  .block{
    width: 50%;
    margin:  20px auto;
  }
</style>
