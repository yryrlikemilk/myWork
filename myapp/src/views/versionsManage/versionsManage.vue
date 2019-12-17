<template>
  <div class="app-container">
    <div class="header">
      <el-row :gutter="10">
        <el-col :xs="16" :sm="16" :md="12" :lg="12" :xl="16"><span>版本管理</span>
          <el-button style="margin-left:20px" @click="goUserMag">用户管理</el-button>
          <el-button style="margin-left:10px" @click="addVersion">新增版本信息</el-button>
          <el-button style="margin-left:10px" @click="goback">退出登录</el-button>
        </el-col>
        <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="4">
          <!-- <el-input
            v-model="input2"
            placeholder="请输入姓名或手机号或支付凭证码"
            prefix-icon="el-icon-search"
          /> -->
        </el-col>
        <el-col :xs="6" :sm="6" :md="4" :lg="4" :xl="4">
          <!-- <el-button type="primary" icon="el-icon-search" @click="getScrch()">搜索</el-button> -->
          <!-- <el-button type="primary" @click="reSet()">重置</el-button> -->
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
            label="版本ID"
            align="center"
            prop="id"
          />
          <el-table-column
            label="版本号"
            align="center"
            prop="versionCode"
          />
          <el-table-column
            label="创建时间"
            align="center"
            prop="rawAddTimeStr"
          />
          <el-table-column
            label="强制更新"
            align="center"
            prop="isForceUpdate"
          />
          <el-table-column
            fixed="right"
            width="180"
            label="操作"
            align="center"
          >
            <template slot-scope="scope">
              <el-link :underline="false" :href="href" target="_blank" @click="download(scope.row)">
                <el-button v-if="false" size="small">下载</el-button>
              </el-link>
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
  </div>
</template>

<script>
import api from '@/uitls/api'
import qs from 'qs'

export default {
  data() {
    return {
      proofCode: '',
      href: '',
      exception: '',
      totall: 200,
      currentPage2: 1,
      userName: '',
      tellnum: '',
      pageSize: 50,
      value: '',
      loginName: '',
      token: '',
      input2: '',
      userId: '',
      id: {},
      tableData: [{ id: 1111, versionCode: '1.1.0', rawAddTimeStr: '2019-12-1' }],
      textarea: '',
      pageData: {}
    }
  },
  mounted() {
    // 接收登录界面参数
    this.getlogindata()
    // 获取用户信息列表
    this.getUser()
  },
  methods: {
    test() {
      return false
    },
    addVersion() {
      this.$router.push({
        path: '/versionsManageAdd',
        query: {
          token: this.token
        }
      })
    },
    goUserMag() {
      this.$router.push({
        path: '/index',
        query: {
          token: this.token
        }
      })
    },

    // 筛选状态
    serchdown(val) {
      this.ScrchUser(val)
    },
    filterTag(value, row) {
      return row.transactStatus === value
    },
    reSet() {
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
    opentip() {
      const h = this.$createElement
      this.$notify({
        title: '提示',
        message: h('i', { style: 'color: teal' }, '请选择状态')
      })
    },
    refresh() {
      const curr = this.currentPage2
      const size = this.pageSize
      this.getUser(size, curr)
    },
    ScrchUser(val) {
      const apiUrl = this.HOST + `${api.userListByPage}?`
      const propt = {
        realName: this.userName,
        userName: this.tellnum,
        proofCode: this.proofCode,
        transactStatus: val
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
    // 登录界面参数获取
    getlogindata() {
      this.token = this.$route.query.token
      this.logindata = this.$route.query.loginName
    },
    handleSizeChange(val) {
      const curr = this.currentPage2
      this.pageSize = val
      this.getUser(val, curr)
    },
    handleCurrentChange(curr) {
      const page = this.pageSize
      this.getUser(page, curr)
    },
    datadeal(obj) {
      this.tableData = []
      for (const u in obj) {
        if (obj[u].isForceUpdate === '0') {
          obj[u].isForceUpdate = '否'
        } else {
          obj[u].isForceUpdate = '是'
        }
        this.tableData.push(obj[u])
      }
    },
    goback() {
      this.token = ''
      this.$router.push({
        path: '/'

      })
    },
    getUser(val = 10, curr = 1) {
      // const propt = {
      //   pageSize: val,
      //   currentPage: curr
      // }
      const apiUrl = this.HOST + `${api.versionConfigListByPage}`
      // const param = new URLSearchParams()
      // param.append('pageSize', propt.pageSize)
      // param.append('currentPage', propt.currentPage)
      this.$axios({
        headers: {
          token: this.token
        },
        url: apiUrl,
        method: 'POST'
        // data: qs.stringify(propt)
      }).then((res) => {
        console.log(res)
        if (res.data.code === -2) {
          this.goback()
        } else {
          // this.pageData.pageNum = res.data.object.pageNum
          // // this.pageData.pageSize = res.data.object.pageSize
          // this.pageData.total = res.data.object.total
          this.datadeal(res.data.object.list)
        }
      }).catch((error) => { // 请求失败处理
        console.log(error)
      })
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
