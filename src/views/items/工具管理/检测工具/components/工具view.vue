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
        this.content += '## 地址\r\n';
        this.content += this.params.url + '\r\n\r\n';
        if (this.files && this.files.length) {
          this.content += '## 附件' + '\r\n\r\n';
          this.files.forEach(item => {
            this.content += `- [${item.name}](${this.$api.download(item.path)})` + '\r\n\r\n'
          });
        }
      },

    },
    mounted() {
      this.init();
    },
  }
</script>

<style lang="scss" scoped>

</style>
