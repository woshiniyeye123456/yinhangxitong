<template>
  <el-form label-width="195px"
           :model="params" :rules="rules" ref="refForm">
    <el-card shadow="never" class="default-card">
      <div slot="header" class="clearfix">
        <span class="slot-title">基本信息</span>
      </div>
      <el-form-item label="软件名称:">
        <el-input type="text" v-model="params.software_name"
                  placeholder="软件名称"></el-input>
      </el-form-item>
      <el-form-item label="语言类型:">
        <el-select
          v-model="params.language"
          placeholder="请选择:语言类型"
          style="width: 100%"
          filterable
          autocomplete="off"
        >
          <el-option
            v-for="(item, index) in languages"
            :label="item"
            :value="item"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="软件描述:">
        <el-input
          v-model="params.software_description"
          autosize
          type="textarea"
          :disabled="disabled"
          resize="none"
          placeholder="软件描述"
        ></el-input>
      </el-form-item>
    </el-card>
    <el-card shadow="never" class="default-card margin-top-14">
      <div slot="header" class="clearfix">
        <span class="slot-title">项目开发信息</span>
      </div>
      <el-form-item label="外包:">
        <el-radio-group v-model="params.self_dev">
          <el-radio
            v-for="(item, index) in yesorno"
            :label="item"
            :key="index"
            :disabled="disabled"
          >{{ item }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="开发单位名称:">
        <el-input type="text" v-model="params.developer_name"
                  placeholder="开发单位名称"></el-input>
      </el-form-item>
      <el-form-item label="开发单位统一社会信用代码:">
        <el-input
          v-model="params.developer_USCC"
          type="text"
          :disabled="disabled"
          placeholder="开发单位统一社会信用代码"
        ></el-input>
      </el-form-item>
      <el-form-item label="App产品类型:">
        <el-select
          v-model="params.AppPlatform"
          placeholder="请选择:App产品类型"
          style="width: 100%"
          filterable
          autocomplete="off"
        >
          <el-option
            v-for="(item, index) in technologyPlatform"
            :label="item"
            :value="item"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="APP备案类型:">
        <el-select
          v-model="params.AppType"
          placeholder="请选择:APP备案类型"
          style="width: 100%"
          filterable
          autocomplete="off"
        >
          <el-option
            v-for="(item, index) in AppType"
            :label="item"
            :value="item"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="第三方安全加固单位:">
        <el-input
          v-model="params.software_hardener"
          type="text"
          :disabled="disabled"
          placeholder="第三方安全加固单位"
        ></el-input>
      </el-form-item>
      <h5>项目经理信息</h5>
      <el-form-item label="项目经理姓名:">
        <el-input
          v-model="params.project_manager_name"
          type="text"
          :disabled="disabled"
          placeholder="项目经理姓名"
        ></el-input>
      </el-form-item>
      <el-form-item label="项目经理邮箱:">
        <el-input
          v-model="params.project_manager_email"
          type="text"
          :disabled="disabled"
          placeholder="项目经理邮箱"
        ></el-input>
      </el-form-item>
      <el-form-item label="项目经理电话:">
        <el-input
          v-model="params.project_manager_phone"
          type="text"
          :disabled="disabled"
          placeholder="项目经理电话"
        ></el-input>
      </el-form-item>
      <h5>业务经理信息</h5>
      <el-form-item label="业务经理姓名:">
        <el-input
          v-model="params.business_manager_name"
          type="text"
          :disabled="disabled"
          placeholder="业务经理姓名"
        ></el-input>
      </el-form-item>
      <el-form-item label="业务经理邮箱:">
        <el-input
          v-model="params.business_manager_email"
          type="text"
          :disabled="disabled"
          placeholder="业务经理邮箱"
        ></el-input>
      </el-form-item>
      <el-form-item label="业务经理电话:">
        <el-input
          v-model="params.business_manager_phone"
          type="text"
          :disabled="disabled"
          placeholder="业务经理电话"
        ></el-input>
      </el-form-item>
      <h5>第三方开发单位</h5>
      <el-form-item label="公司名称:">
        <el-input
          v-model="params.third_party_name"
          type="text"
          :disabled="disabled"
          placeholder="公司名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="信用代码:">
        <el-input
          v-model="params.third_party_credit_code"
          type="text"
          :disabled="disabled"
          placeholder="信用代码"
        ></el-input>
      </el-form-item>
      <el-form-item label="营业执照:">
        <img-upload
          :modal="false"
          :defaultFileList="fileDefaultFileList"
          @update:successFileList="val => fileFileList = val"
          :maxImg="20"
        ></img-upload>
      </el-form-item>
      <el-form-item label="公司保密协议:">
        <el-input
          v-model="params.company_confidentiality_agreement"
          autosize
          type="textarea"
          :disabled="disabled"
          resize="none"
          placeholder="公司保密协议"
        ></el-input>
      </el-form-item>
      <el-form-item label="开发保密协议:">
        <el-input
          v-model="params.development_confidentiality_agreement"
          autosize
          type="textarea"
          :disabled="disabled"
          resize="none"
          placeholder="开发保密协议"
        ></el-input>
      </el-form-item>
      <h5>乙方项目经理信息</h5>
      <el-form-item label="项目经理姓名:">
        <el-input
          v-model="params.party_b_manager_name"
          type="text"
          :disabled="disabled"
          placeholder="项目经理姓名"
        ></el-input>
      </el-form-item>
      <el-form-item label="项目经理邮箱:">
        <el-input
          v-model="params.party_b_manager_email"
          type="text"
          :disabled="disabled"
          placeholder="项目经理邮箱"
        ></el-input>
      </el-form-item>
      <el-form-item label="项目经理电话:">
        <el-input
          v-model="params.party_b_manager_phone"
          type="text"
          :disabled="disabled"
          placeholder="项目经理电话"
        ></el-input>
      </el-form-item>
    </el-card>
    <div class="margin-top-10 text-right">
      <el-button

        type="default"
        @click="goBack"
        size="small"
      >
        返回
      </el-button>
      <el-button

        type="primary"
        @click="submit"
        size="small"
        v-show="!disabled"
      >
        确认
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
      }
    },
    computed: {},
    data() {
      return {
        rules: {
          name1: [{required: true, message: '请输入:名称', trigger: 'blur'}],
          coding: [{required: true, message: '请输入:编码', trigger: 'blur'}],
          version: [{required: true, message: '请输入:版本号', trigger: 'blur'}],
        },
        authorizationGroupList: [],
        fileDefaultFileList: [],
        fileFileList: [],
      }
    },
    methods: {

      goBack() {
        this.$router.go(-1)
      },

      goback() {
        this.$emit('go-back')
      },

      submit() {
        let params = this.$common.deepClone(this.params);
        this.$refs.refForm.validate((valid) => {
          if (valid) {
            if (this.fileFileList && this.fileFileList.length) {
              params.file = JSON.stringify(this.fileFileList);
            } else {
              params.file = ''
            }
            if (params.id) {
              this.$emit('on-update', params);
            } else {
              this.$emit('on-submit', params);
            }
          } else {
            return this.$message.error('操作失败');
          }
        });
      },

      getAuthorizationGroup() {
        let vars = {};
        vars.key = 'authorization_group';
        vars.params = {
          conds: [],
          dims: [],
          order: ['id', 'DESC'],
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data) {
            this.authorizationGroupList = data.data || [];
          }
        });
      },

      init() {
        // console.log(this.params);
        this.getAuthorizationGroup();
        if (this.params.file) {
          this.fileDefaultFileList = JSON.parse(this.params.file);
          this.fileFileList = this.$common.deepClone(this.fileDefaultFileList);
        }
      },

      clearDataFn() { // 清除选择框内容
        this.$refs.refForm.resetFields();
      },
    },
    mounted() {
      this.init();
    },
    watch: {
      clearData: {
        handler(val) {
          // console.log(val)
          if (val) {
            this.clearDataFn();
            this.$emit('clear-finish');
          }
        },
        deep: true
      },
    }
  }
</script>

<style scoped>
  .box {
    width: 1200px;
    margin-left: auto;
    margin-right: auto;
    padding: 12px 6px;
  }
</style>
