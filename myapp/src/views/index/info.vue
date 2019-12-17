<template>
  <div class="app-container">
    <div class="heard">
      <el-page-header content="详情页面" @back="goback()"/>
    </div>
    <div class="box-1">
      <el-row v-if="getdata.object" >
        <el-col v-if="getdata.object.company" :span="6">
          <ul>
            <li>公司信息</li>
            <li>企业名称：{{ getdata.object.company.companyName }}</li>
            <li>企业代码：{{ getdata.object.company.companyCode }}</li>
            <li>营业执照：</li>
            <img :src="getdata.object.company.businessLicenseUrl" alt="">
            <li>法人代表：{{ getdata.object.company.legalRepresentative }}</li>
            <li>身份证号：{{ getdata.object.company.idCard }}</li>
            <li>身份证照正面：</li>
            <img :src="getdata.object.company.idPhotoFrontUrl" alt="">
            <li>身份证照背面：</li>
            <img :src="getdata.object.company.idPhotoBackUrl" alt="">
            <li>银行名称：{{ getdata.object.company.bankName }}</li>
            <li>银行卡号：{{ getdata.object.company.bankCard }}</li>
          </ul>
        </el-col>
        <el-col :span="6" >
          <ul>
            <li>申请数据</li>
            <li>办理商户类型：{{ getdata.object.userTypeDesc }}</li>
            <li>办理阶段：{{ getdata.object.statusDesc }}</li>
            <li>办理状态：{{ getdata.object.transactStatusDesc }}</li>
            <li>成功时间：{{ getdata.object.successDateStr }}</li>
            <li>代办金额：{{ getdata.object.agentAmount }}</li>
            <li>开户金额：{{ getdata.object.companyAmount }}</li>
            <li>总金额：{{ getdata.object.amount }}</li>
            <li>支付方式：{{ getdata.object.payTypeDesc }}</li>
            <li>支付时间：{{ getdata.object.payTimeStr }}</li>
            <li>是否已支付：{{ getdata.object.isPayDesc }}</li>
            <li>是否已退款：{{ getdata.object.isRefundDesc }}</li>
            <li>异常信息：{{ getdata.object.exception }}</li>
            <li>是否代办公司注册：{{ getdata.object.isAgentDesc }}</li>
          </ul>
        </el-col>
        <el-col v-if="getdata.object.agent" :span="6">
          <p>代理</p>
          <p>申请人：{{ getdata.object.agent.applicant }}</p>
          <p>身份证号：{{ getdata.object.agent.idCard }}</p>
          <p>身份证照正面：</p>
          <img :src="getdata.object.agent.idPhotoFrontUrl" alt="">
          <p>身份证照背面：</p>
          <img :src="getdata.object.agent.idPhotoBackUrl" alt="">
          <p>公司行业意向：{{ getdata.object.agent.industryIntention }}</p>
          <p>公司地址：{{ getdata.object.agent.addressInfo }}</p>
        </el-col>
        <el-col v-if="getdata.object.user" :span="6">
          <ul>
            <li>用户</li>
            <li>用户名/手机号：{{ getdata.object.user.userName }}</li>
            <li>安全码：{{ getdata.object.user.safeKey }}</li>
            <li>真实姓名：{{ getdata.object.user.realName }}</li>
            <li>用户类型：{{ getdata.object.user.userTypeDesc }}</li>
            <li>邀请人名称：{{ getdata.object.user.inviteUserName }}</li>
            <li>办理时间：{{ getdata.object.user.transactTimeStr }}</li>
            <li>办理状态：{{ getdata.object.user.transactStatusDesc }}</li>
            <li>邀请码：{{ getdata.object.user.inviteCode }}</li>
            <li>直接邀请人数量：{{ getdata.object.user.directInviteNum }}</li>
            <li>间接邀请人数量：{{ getdata.object.user.indirectInviteNum }}</li>
          </ul>
        </el-col>
      </el-row>

    </div>
  </div>
</template>

<script>
import api from '@/uitls/api'
import qs from 'qs'
export default{
  data() {
    return {
      loginName: '1',
      token: '',
      userid: '',
      user: {},
      company: {},
      agent: {},
      getdata: {
        // code: '0-成功，-1-失败',
        // object: {
        //   id: '申请ID',
        //   rawAddTime: '',
        //   deleted: '',
        //   rawUpdateTime: '',
        //   deleteTime: '',
        //   userId: '用户id',
        //   companyId: '企业id',
        //   agentId: '代办id',
        //   userType: '办理商户类型 1-标准商户，2-vip商户',
        //   status: '办理阶段 1、代办执照，2、开户',
        //   transactStatus: '办理状态 1-待支付，2-审核中，3-代办成功，4-资料异常，5-办理成功',
        //   successDate: '成功时间',
        //   agentAmount: '代办金额',
        //   companyAmount: '开户金额',
        //   amount: '总金额',
        //   payType: '支付方式 1-支付宝，2-微信',
        //   payTime: '支付时间',
        //   isPay: '是否已支付 0-未支付，1-已支付',
        //   tradeNo: '在线支付交易流水',
        //   isRefund: '是否已退款 0:否 1：是',
        //   exception: '异常信息',
        //   isAgent: '是否代办公司注册 0:否 1：是',
        //   agent: {
        //     id: '代办id',
        //     rawAddTime: '',
        //     deleted: '',
        //     rawUpdateTime: '',
        //     deleteTime: '',
        //     userId: '用户id',
        //     applicant: '申请人',
        //     idCard: '身份证号',
        //     idPhotoFront: '身份证照正面',
        //     idPhotoBack: '身份证照背面',
        //     industryIntention: '公司行业意向',
        //     industryIntentionId: '公司行业意向id',
        //     idPhotoFrontUrl: '身份证照正面 图片链接',
        //     idPhotoBackUrl: '身份证照背面 图片链接',
        //     rawAddTimeStr: ''
        //   },
        //   company: {
        //     id: '公司信息id',
        //     rawAddTime: '',
        //     deleted: '',
        //     rawUpdateTime: '',
        //     deleteTime: '',
        //     userId: '用户id',
        //     companyName: '企业名称',
        //     companyCode: '企业代码',
        //     businessLicense: '营业执照',
        //     legalRepresentative: '法人代表',
        //     idCard: '身份证号',
        //     idPhotoFront: '身份证照正面',
        //     idPhotoBack: '身份证照背面',
        //     bankName: '银行名称',
        //     bankCard: '银行卡号',
        //     bankId: '',
        //     businessLicenseUrl: '营业执照 图片链接',
        //     idPhotoFrontUrl: '身份证照正面 图片链接',
        //     idPhotoBackUrl: '身份证照背面 图片链接',
        //     rawAddTimeStr: ''
        //   },
        //   user: {
        //     id: '用户id',
        //     rawAddTime: '',
        //     deleted: '',
        //     rawUpdateTime: '',
        //     deleteTime: '',
        //     userName: '用户名/手机号',
        //     password: '',
        //     safeKey: '',
        //     realName: '真实姓名',
        //     userType: '用户类型 0-初始化，1-标准商户，2-vip商户',
        //     inviteUserName: '邀请人名称',
        //     inviteUserId: '邀请人id',
        //     transactTime: '办理时间 --支付成功时间',
        //     transactStatus: '办理状态 0-未办理，1-待支付，2-审核中，3-代办成功，4-资料异常，5-办理成功',
        //     inviteCode: '邀请码',
        //     directInviteNum: '直接邀请人数量',
        //     indirectInviteNum: '间接邀请人数量',
        //     rawAddTimeStr: ''
        //   },
        //   rawAddTimeStr: ''
        // },
        // error: '',
        // message: '',
        // exception: ''
      }
    }
  },
  created() {
    this.accept()
    this.getInfoData()
  },
  methods: {
    showdata() {
      return false
    },
    goback() {
      this.$router.push({
        path: '/index',
        query: {
          token: this.token,
          loginName: this.loginName
        }
      })
    },
    accept() {
      this.token = this.$route.query.token
      this.userId = this.$route.query.id
    },
    getInfoData() {
      const par = { userId: this.userId }
      const apiUrl = this.HOST + `${api.getOrdersInfo}`
      this.$axios({
        headers: {
          token: this.token
        },
        url: apiUrl,
        method: 'POST',
        data: qs.stringify(par)
      }).then(res => {
        Object.assign(this.getdata, res.data)
        this.$set(this.getdata)
        console.log(this.getdata)
        // this.getdata.concat(res.data)
        // console.log(this.getdata[0].object)
        if (res.data.code === -2) {
          this.goback()
        }
      })
    }
  }
}
</script>

<style scoped>
.app-container .heard{
  margin-left: 40px;
  margin-top: 20px;

}
.el-col{
  text-align: left;
}
.el-col ul li{
  list-style: none;
  width: 90%;
  margin-top: 10px;
  margin-left: 3px;
}
.el-col img{
  width: 80%;
}
  .box-1{
    text-align: center;

  }

</style>
