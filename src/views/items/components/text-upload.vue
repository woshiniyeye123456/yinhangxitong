<template>
  <div :class="{'hidden-upload-card': (appFileList.length >= maxImg)}">
    <el-upload multiple name="__files__" :file-list="defaultFileList" :action="files" :accept="accept" :on-preview="handlePictureCardPreview"
      :before-upload="beforeAvatarUpload" :on-remove="appRemove" :on-success="appSuccess" :disabled="disabled">
      <div class="btn-group" v-show="!disabled">
        <el-button slot="trigger" plain size="mini" type="primary">选取文件</el-button>
      </div>
    </el-upload>
  </div>
</template>

<script>
import api from "../../../apis/api";

export default {
  name: "gq-upload",
  components: {},
  props: {
    defaultFileList: {
      type: Array,
      default() {
        return [];
      }
    },
    maxImg: {
      type: Number,
      default: 1
    },
    modal: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default:
        ".json, .txt, .doc, .docx, .wps, .xlsx, .xlsm, .xltx, .xltm, .pdf, .zip, .rar"
    },
    size: {
      type: Number,
      default: 0
    }
  },
  computed: {
    files() {
      return api.upload();
    }
  },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      appFileList: []
    };
  },
  methods: {
    emitList() {
      this.$emit("update:successFileList", this.appFileList);
      this.$emit("file-after");
    },
    appSuccess(response, file, fileList) {
      // console.log(file);
      // console.log(fileList);
      if (file.response && file.response.error) {
        return this.$store.dispatch("FedLogOut").then(() => {
          this.$message.error(file.response.error);
          setTimeout(() => {
            location.reload(); // In order to re-instantiate the vue-router object to avoid bugs
          }, 1000);
        });
      }
      this.appFileList = [];
      fileList.forEach((item, index) => {
        let obj = {};
        if (item.status === "success") {
          if (item.response && !item.response.error) {
            obj.name = item.response.data[0].name;
            obj.path = item.response.data[0].path;
            obj.url = api.download(item.response.data[0].path);
            obj.size = item.size;
          } else {
            obj = item;
          }
          this.appFileList.push(obj);
        }
      });
      this.emitList();
    },
    appRemove(file, fileList) {
      // console.log(file);
      // console.log(fileList);
      this.appFileList = [];
      fileList.forEach((item, index) => {
        let obj = {};
        if (item.status === "success") {
          if (item.response && !item.response.error) {
            obj.name = item.response.data[0].name;
            obj.path = item.response.data[0].path;
            obj.url = api.download(item.response.data[0].path);
            obj.size = item.size;
          } else {
            obj = item;
          }
          this.appFileList.push(obj);
        }
      });
      this.emitList();
    },
    beforeAvatarUpload(file) {
      this.$emit("file-before");
      // const isImg = (
      //   file.type === 'application/json' ||
      //   file.type === 'application/pdf' ||
      //   file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      //   file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      //   console.log(file.type)
      // );
      // const isLt100M = file.size / 1024 / 1024 < 100;

      // if (!isImg) {
      //   this.$message.error('上传图片格式不正确!');
      // }
      // if (!isLt100M) {
      //   this.$message.error('上传图片大小不能超过100MB!');
      // }
      // return isLt100M;

      if (this.size > 0) {
        if (file.size > this.size * 1024 * 1024) {
          this.$message.error("上传文件大小不能超过" + this.size + "MB!");
          return false;
        }
      }

      return true;
    },
    handlePictureCardPreview(file) {
      // console.log(file);
      if (file.url) {
        window.open(file.url);
      } else if (file.response) {
        window.open(api.download(file.response.data[0].path));
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.appFileList = this.$common.deepClone(this.defaultFileList);
    });
  },
  watch: {
    defaultFileList: {
      handler(val) {
        if (val.length >= 0) {
          this.appFileList = this.$common.deepClone(this.defaultFileList);
        }
      },
      deep: true
    }
  }
};
</script>

<style scoped>
.width-max {
  width: 100%;
}

.btn-group {
  width: 100%;
  text-align: left;
}
</style>
