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
    name: "资料view",
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
        this.content += '# ' + this.params.title + '\r\n\r\n';
        // row
        this.content += this.params.content + '\r\n\r\n';
        if (this.params.path) {
          this.files = JSON.parse(this.params.path);
        }
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
