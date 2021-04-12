<template>
  <div :class="{'hidden-upload-card': (appFileList.length >= maxImg)}">
    <el-upload
      multiple
      name="__files__"
      :file-list="defaultFileList"
      :action="files"
      :accept="accept"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :before-upload="beforeAvatarUpload"
      :on-remove="appRemove"
      :on-success="appSuccess"
      :disabled="disabled"
    >
    </el-upload>
    <!-- 预览图片 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :modal="modal"
    >
      <img width="100%" :src="dialogImageUrl">
    </el-dialog>
  </div>
</template>

<script>
  import api from '../../../apis/api';

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
        default: '.png,.jpg,.jpeg,.gif',
      },
      size: {
        type: Number,
        default: 0,
      }
    },
    computed: {
      files() {
        return this.$api.upload();
      },
    },
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        appFileList: [],
      }
    },
    methods: {
      emitList() {
        this.$emit('update:successFileList', this.appFileList);
      },
      appSuccess(response, file, fileList) {
        // console.log(file);
        // console.log(fileList);
        if (file.response && file.response.error) {
          return this.$store.dispatch('FedLogOut').then(() => {
            this.$message.error(file.response.error);
            setTimeout(() => {
              location.reload()// In order to re-instantiate the vue-router object to avoid bugs
            }, 1000)
          });
        }
        this.appFileList = [];
        fileList.forEach((item, index) => {
          let obj = {};
          if (item.status === 'success') {
            if (item.response && !item.response.error) {
              obj.name = item.response.data[0].name;
              obj.path = item.response.data[0].path;
              obj.url = api.download(item.response.data[0].path);
              obj.size = item.size;
            } else {
              obj = item;
            }
            this.appFileList.push(obj)
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
          if (item.status === 'success') {
            if (item.response && !item.response.error) {
              obj.name = item.response.data[0].name;
              obj.path = item.response.data[0].path;
              obj.url = api.download(item.response.data[0].path);
              obj.size = item.size;
            } else {
              obj = item;
            }
            this.appFileList.push(obj)
          }
        });
        this.emitList();
      },
      beforeAvatarUpload(file) {
        // console.log(file);
        const isImg = (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/gif');
        // const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isImg) {
          this.$message.error('上传图片格式不正确!');
        }

        if (this.size > 0) {
          if (file.size > this.size * 1024 * 1024) {
            this.$message.error('上传图片大小不能超过' + this.size + 'MB!');
            return false
          }
        }
        // if (!isLt2M) {
        //   this.$message.error('上传图片大小不能超过2MB!');
        // }
        // return isImg && isLt2M;
        return isImg;
      },
      handlePictureCardPreview(file) {
        // console.log(file);
        if (file.url) {
          this.dialogImageUrl = file.url;
        } else if (file.response) {
          this.dialogImageUrl = api.download(file.response.data[0].path);
        }
        this.dialogVisible = true;
      },
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
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
