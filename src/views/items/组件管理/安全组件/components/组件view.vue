<template>
  <div class="markdown-full-page">
    <markdown
      :disabled="true"
      :isFull="true"
      v-model="content"
    >
    </markdown>
    <div class="margin-top-10 text-right">
      <el-button
        type="default"
        @click="goBack"
        size="small"
      >
        返回
      </el-button>
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
        this.content += '## 组件版本号\r\n';
        this.content += this.params.version + '\r\n\r\n';
        // row
        this.content += '## 软件平台\r\n';
        this.content += this.params.software_platform + '\r\n\r\n';
        // row
        this.content += '## 组件来源\r\n';
        this.content += this.params.component_source + '\r\n\r\n';
        // row
        this.content += '## 功能概述\r\n';
        this.content += this.params.functional_overview + '\r\n\r\n';
        // row
        this.content += '## 功能描述\r\n';
        this.content += this.params.function_description + '\r\n\r\n';
        // row
        this.content += '## 使用说明\r\n';
        this.content += this.params.instructions_for_use + '\r\n\r\n';
        // file
        if (this.params.documentation) {
          this.documentation = JSON.parse(this.params.documentation);
        }
        if (this.documentation && this.documentation.length) {
          this.content += '## 相关文档' + '\r\n\r\n';
          this.documentation.forEach(item => {
            this.content += `- [${item.name}](${this.$api.download(item.path)})` + '\r\n\r\n'
          });
        }
        // file
        if (this.params.package) {
          this.package = JSON.parse(this.params.package);
        }
        if (this.package && this.package.length) {
          this.content += '## 程序包' + '\r\n\r\n';
          this.package.forEach(item => {
            this.content += `- [${item.name}](${this.$api.download(item.path)})` + '\r\n\r\n'
          });
        }
        // file
        if (this.params.resource) {
          this.resource = JSON.parse(this.params.resource);
        }
        if (this.resource && this.resource.length) {
          this.content += '## 源代码' + '\r\n\r\n';
          this.resource.forEach(item => {
            this.content += `- [${item.name}](${this.$api.download(item.path)})` + '\r\n\r\n'
          });
        }
        // file
        if (this.params.attachment) {
          this.attachment = JSON.parse(this.params.attachment);
        }
        if (this.attachment && this.attachment.length) {
          this.content += '## 其他附件' + '\r\n\r\n';
          this.attachment.forEach(item => {
            this.content += `- [${item.name}](${this.$api.download(item.path)})` + '\r\n\r\n'
          });
        }
        console.log(this.content);
      },

    },
    mounted() {
      this.init();
    },
  }
</script>

<style lang="scss" scoped>
</style>
