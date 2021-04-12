<template>
  <div class="markdown-full-page">
    <markdown
      :disabled="true"
      :isFull="true"
      v-model="content"
    >
    </markdown>
    <div
      class="go-back"
      @click="goBack"
    >
      返回
    </div>
  </div>
</template>

<script>
  import Markdown from '../../../components/markDown/simple'

  export default {
    name: "漏洞view",
    inject: {
      user: {
        from: 'user',
        default: () => {
          return {}
        }
      }
    },
    components: {
      Markdown,
    },
    props: {
      params: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    computed: {},
    data() {
      return {
        files: [],
        content: '',
      }
    },
    methods: {

      goBack() {
        this.$router.go(-1)
      },

      init() {
        // console.log(this.params);
        this.content = '';
        // row
        this.content += '# ' + this.params.name + '\r\n\r\n';
        // row
        this.content += '## 漏洞编号\r\n';
        this.content += this.params.number + '\r\n\r\n';
        // row
        this.content += '## 危害等级\r\n';
        this.content += this.params.harm_level + '\r\n\r\n';
        // row
        if (this.params.baseline) {
          this.content += '## 关联安全基线\r\n';
          this.content += this.params.baseline.name + '\r\n\r\n';
        }
        // row
        this.content += '## 风险描述\r\n';
        this.content += this.params.risk_description + '\r\n\r\n';
        // row
        this.content += '## 发现过程描述\r\n';
        this.content += this.params.discovery_process_des + '\r\n\r\n';
        // row
        this.content += '## 操作方法说明\r\n';
        this.content += this.params.operation_method_description + '\r\n\r\n';
        // row
        this.content += '## 使用工具说明\r\n';
        this.content += this.params.instructions_for_using_tools + '\r\n\r\n';
        // row
        this.content += '## 解决方案\r\n';
        this.content += this.params.solution + '\r\n\r\n';
        // file
        if (this.params.path) {
          this.files = JSON.parse(this.params.path);
        }
        if (this.files && this.files.length) {
          this.content += '## 附件' + '\r\n\r\n';
          this.files.forEach(item => {
            this.content += `- [${item.name}](${this.$api.download(item.path)})` + '\r\n\r\n'
          });
        }
        // console.log(this.content);
      },

    },
    mounted() {
      this.init();
    },
  }
</script>

<style lang="scss" scoped>

  .go-back {
    border-radius: 50%;
    width: 44px;
    height: 44px;
    text-align: center;
    line-height: 44px;
    background-color: #fff;
    box-shadow: 0 0 6px rgba(0, 0, 0, .12);
    cursor: pointer;
    z-index: 5;
    color: #606266;
    font-size: 12px;
    position: fixed;
    right: 20px;
    bottom: 20px;
  }

</style>
