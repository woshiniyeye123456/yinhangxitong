<template>
  <el-form label-width="110px"
           :model="params" :rules="rules" ref="refForm">
    <el-card shadow="never" class="default-card">
      <div slot="header" class="clearfix">
        <span class="slot-title">基本信息</span>
      </div>
      <el-form-item label="工具名称:" prop="name">
        <el-input
          type="text"
          v-model="params.name"
          :disabled="disabled"
          placeholder="工具名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="工具类型:">
        <el-select
          v-model="params.type"
          :disabled="disabled"
          placeholder="请选择:工具类型"
          style="width: 100%"
          filterable
          autocomplete="off"
        >
          <el-option
            v-for="(item, index) in toolType"
            :label="item"
            :value="item"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <template v-if="params.type === '在线'">
        <el-form-item label="地址:">
          <el-input
            type="text"
            v-model="params.url"
            :disabled="disabled"
            placeholder="地址"
          ></el-input>
        </el-form-item>
      </template>
      <template v-if="params.type === '离线'">
        <el-form-item label="附件:">
          <text-upload
            :disabled="disabled"
            :modal="false"
            :defaultFileList="defaultFileList"
            @update:successFileList="val => fileList = val"
            :maxImg="20"
          ></text-upload>
        </el-form-item>
      </template>
      <!--<el-form-item label="使用说明:">-->
      <!--<tinymce v-if="!disabled" :height="300" v-model="params.instructions_for_use"></tinymce>-->
      <!--<div class="gq-tag-inner" disabled v-if="disabled" v-html="params.instructions_for_use"></div>-->
      <!--</el-form-item>-->
      <el-form-item label="使用说明:">
        <markdown
          :height="600"
          :disabled="disabled"
          v-model="params.instructions_for_use"
        ></markdown>
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
  import Tinymce from '@/components/Tinymce'
  import Markdown from '../../../components/markDown/simple'

  export default {
    name: "工具form",
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
      Tinymce,
      Markdown,
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
        fileList: [],
        defaultFileList: [],
      }
    },
    methods: {

      change(val) {
        if (val && val.length) {
          this.params.loophole_id = val[val.length - 1];
        }
      },

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
            if (this.fileList && this.fileList.length) {
              params.path = JSON.stringify(this.fileList);
            } else {
              params.path = ''
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

      init() {
        // console.log(this.params);
        if (this.params.path) {
          this.defaultFileList = JSON.parse(this.params.path);
          this.fileList = this.$common.deepClone(this.defaultFileList);
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

</style>
