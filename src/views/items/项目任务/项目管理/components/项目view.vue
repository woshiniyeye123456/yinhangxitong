<template>
  <el-form label-width="115px"
           :model="params" ref="refForm">
    <el-card shadow="never" class="default-card">
      <div slot="header" class="clearfix">
        <span class="slot-title">项目信息</span>
      </div>
      <el-form-item label="项目名称:">
        <el-input
          v-model="params.application_name"
          readonly
        ></el-input>
      </el-form-item>
      <el-form-item label="项目简称:">
        <el-input
          v-model="params.application_abbreviation"
          readonly
        ></el-input>
      </el-form-item>
      <el-form-item label="所属处室:">
        <el-input
          v-model="params.office_name"
          readonly
        ></el-input>
      </el-form-item>
      <el-form-item label="所属项目组:">
        <el-input
          v-model="params.project_name"
          readonly
        ></el-input>
      </el-form-item>
      <el-form-item label="产品经理:">
        <el-input
          v-model="params._product_manager"
          readonly
        ></el-input>
      </el-form-item>
      <el-form-item label="安全专员:">
        <el-input
          v-model="params._safety_officer"
          readonly
        ></el-input>
      </el-form-item>
      <el-form-item label="项目经理:">
        <el-input
          v-model="params._project_manager"
          readonly
        ></el-input>
      </el-form-item>
      <el-form-item label="合作项目负责人:">
        <el-input
          v-model="params._cooperation_manager"
          readonly
        ></el-input>
      </el-form-item>
    </el-card>
    <div class="margin-top-10 text-right">
      <el-button
        v-show="!hiddenBack"
        type="default"
        @click="goBack"
        size="small"
      >
        返回
      </el-button>
    </div>
  </el-form>
</template>

<script>
  import mixins from '../mixins'
  import textUpload from '../../../components/text-upload'
  import imgUpload from '../../../components/img-upload'

  export default {
    name: "组件form",
    inject: {
      user: {
        from: 'user',
        default: () => {
          return {}
        }
      }
    },
    components: {
      textUpload,
      imgUpload,
    },
    mixins: [
      mixins,
    ],
    props: {
      params: {
        type: Object,
        default() {
          return {}
        }
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      hiddenBack: {
        type: Boolean,
        default: false,
      }
    },
    computed: {},
    data() {
      return {
        activeName: '1',
        fileDefaultFileList: [],
        fileFileList: [],
        rules: [],
      }
    },
    methods: {

      goBack() {
        this.$router.go(-1)
      },

      goback() {
        this.$emit('go-back')
      },

      init() {
        if (this.params.file) {
          this.fileDefaultFileList = this.$common.deepClone(this.params.file);
          this.fileFileList = this.$common.deepClone(this.fileDefaultFileList);
        }
        if (this.params.product_manager_item) {
          let _product_manager = [];
          this.params.product_manager_item.forEach(item => {
            if (this.params.product_manager.indexOf(item.account_id) !== -1) {
              _product_manager.push(item.real_name)
            }
          });
          this.$set(this.params, '_product_manager', _product_manager.join('; '))
        }
        if (this.params.safety_officer_item) {
          let _safety_officer = [];
          this.params.safety_officer_item.forEach(item => {
            if (this.params.safety_officer.indexOf(item.account_id) !== -1) {
              _safety_officer.push(item.real_name)
            }
          });
          this.$set(this.params, '_safety_officer', _safety_officer.join('; '))
        }
        if (this.params.project_manager_item) {
          let _project_manager = [];
          this.params.project_manager_item.forEach(item => {
            if (this.params.project_manager.indexOf(item.account_id) !== -1) {
              _project_manager.push(item.real_name)
            }
          });
          this.$set(this.params, '_project_manager', _project_manager.join('; '))
        }
        if (this.params.cooperation_manager_item) {
          let _cooperation_manager = [];
          this.params.cooperation_manager_item.forEach(item => {
            if (this.params.cooperation_manager.indexOf(item.account_id) !== -1) {
              _cooperation_manager.push(item.real_name)
            }
          });
          this.$set(this.params, '_cooperation_manager', _cooperation_manager.join('; '))
        }
      },
    },
    mounted() {
      this.init();
    },
  }
</script>

<style scoped>
  .form-page-full {
    height: calc(100vh - 55px - 46px - 60px - 42px - 20px);
    overflow-y: auto;
  }
</style>
