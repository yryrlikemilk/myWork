<template>
  <div :style="`width:${width}; height:${height}`" class="ValidCode disabled-select" @click="refreshCode">
    <span v-for="(item, index) in codeList" :key="index" :style="getStyle(item)">{{ item.code }}</span>
  </div>
</template>

<script>
export default {
  name: 'ValidCode',
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '40px'
    },
    length: {
      type: Number,
      default: 4
    }
  },
  data() {
    return {
      codeList: []
    }
  },
  mounted() {
    this.createdCode()
  },
  created() {
  },
  methods: {
    refreshCode() {
      this.createdCode()
    },
    createdCode() {
      const len = this.length
      const codeList = []
      // const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz0123456789'
      const chars = 'ABCDEFGHJKMNPQRSTWXYZ0123456789'
      const charsLen = chars.length
      // 生成
      for (let i = 0; i < len; i++) {
        const rgb = [Math.round(Math.random() * 220), Math.round(Math.random() * 240), Math.round(Math.random() * 200)]
        codeList.push({
          code: chars.charAt(Math.floor(Math.random() * charsLen)),
          color: `rgb(${rgb})`,
          fontSize: `${[Math.floor(Math.random() * 10) + 12]}px`,
          padding: `${[Math.floor(Math.random() * 10)]}px`,
          transform: `rotate(${Math.floor(Math.random() * 90) - Math.floor(Math.random() * 90)}deg)`
        })
      }
      // 指向
      this.codeList = codeList
      // 将当前数据派发出去
      this.$emit('child-msg', codeList.map(item => item.code).join(''))
      // this.$emit('child-msg', 100)
    },
    getStyle(data) {
      return `color: ${data.color}; font-size: ${data.fontSize}; padding: ${data.padding}; transform: ${data.transform}`
    }
  }
}
</script>

<style scoped>
  .ValidCode{
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
 .ValidCode span{
      display: inline-block;
    }
</style>
