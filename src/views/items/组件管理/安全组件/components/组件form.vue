<template>
  <el-form label-width="110px"
           :model="params" :rules="rules" ref="refForm">
    <el-card shadow="never" class="default-card">
      <div slot="header" class="clearfix">
        <span class="slot-title">基本信息</span>
      </div>
      <el-form-item label="组件名称:" prop="name">
        <el-input
          type="text"
          v-model="params.name"
          :readonly="readonly"
          placeholder="组件名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="组件版本号:" prop="version">
        <el-input
          type="text"
          v-model="params.version"
          :readonly="readonly"
          placeholder="组件版本号"
        ></el-input>
      </el-form-item>
      <template v-if="readonly">
        <el-form-item label="软件平台:">
          <el-input
            v-model="params.software_platform"
            :readonly="readonly"
          ></el-input>
        </el-form-item>
        <el-form-item label="组件来源:">
          <el-input
            v-model="params.component_source"
            :readonly="readonly"
          ></el-input>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="组件标签:">
          <el-select
            v-model="params.labels_ids"
            :disabled="disabled"
            placeholder="请选择:组件标签"
            style="width: 100%"
            multiple
            filterable
            autocomplete="off"
          >
            <el-option
              v-for="item in componentLabelList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="软件平台:">
          <el-select
            v-model="params.software_platform_id"
            :disabled="disabled"
            placeholder="请选择:软件平台"
            style="width: 100%"
            filterable
            autocomplete="off"
          >
            <el-option
              v-for="item in softwarePlatList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组件来源:">
          <el-select
            v-model="params.component_source"
            :disabled="disabled"
            placeholder="请选择:组件来源"
            style="width: 100%"
            filterable
            autocomplete="off"
          >
            <el-option
              v-for="(item, index) in componentList"
              :label="item"
              :value="item"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
      </template>
      <!--<el-form-item label="功能概述:">-->
      <!--<el-input-->
      <!--type="text"-->
      <!--v-model="params.functional_overview"-->
      <!--:disabled="disabled"-->
      <!--placeholder="功能概述"-->
      <!--&gt;</el-input>-->
      <!--</el-form-item>-->
      <el-form-item label="功能描述:" prop="note">
        <el-input
          v-model="params.function_description"
          autosize
          type="textarea"
          :readonly="readonly"
          resize="none"
          placeholder="功能描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="使用说明:">
        <markdown
          :height="300"
          :disabled="disabled"
          v-model="params.instructions_for_use"
        ></markdown>
      </el-form-item>
      <el-form-item label="相关文档:">
        <text-upload
          :disabled="disabled"
          :modal="false"
          :defaultFileList="documentationDefaultFileList"
          @update:successFileList="val => documentationFileList = val"
          :maxImg="20"
        ></text-upload>
      </el-form-item>
      <h5>组件程序</h5>
      <el-form-item label="程序包:">
        <text-upload
          :disabled="disabled"
          :modal="false"
          :defaultFileList="packageDefaultFileList"
          @update:successFileList="val => packageFileList = val"
          :maxImg="20"
        ></text-upload>
      </el-form-item>
      <el-form-item label="源代码:">
        <text-upload
          :disabled="disabled"
          :modal="false"
          :defaultFileList="resourceDefaultFileList"
          @update:successFileList="val => resourceFileList = val"
          :maxImg="20"
        ></text-upload>
      </el-form-item>
      <el-form-item label="其他附件:">
        <text-upload
          :disabled="disabled"
          :modal="false"
          :defaultFileList="attachmentDefaultFileList"
          @update:successFileList="val => attachmentFileList = val"
          :maxImg="20"
        ></text-upload>
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
      },
      readonly: false,
    },
    computed: {},
    data() {
      return {
        rules: {
          name1: [{required: true, message: '请输入:名称', trigger: 'blur'}],
          coding: [{required: true, message: '请输入:编码', trigger: 'blur'}],
          version: [{required: true, message: '请输入:版本号', trigger: 'blur'}],
        },
        softwarePlatList: [],
        componentLabelList: [],
        // 文档
        documentationDefaultFileList: [],
        documentationFileList: [],
        // 程序包
        packageDefaultFileList: [],
        packageFileList: [],
        // 源代码
        resourceDefaultFileList: [],
        resourceFileList: [],
        // 附件
        attachmentDefaultFileList: [],
        attachmentFileList: [],
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
            if (this.documentationFileList && this.documentationFileList.length) {
              params.documentation = JSON.stringify(this.documentationFileList);
            } else {
              params.documentation = ''
            }
            if (this.packageFileList && this.packageFileList.length) {
              params.package = JSON.stringify(this.packageFileList);
            } else {
              params.package = ''
            }
            if (this.resourceFileList && this.resourceFileList.length) {
              params.resource = JSON.stringify(this.resourceFileList);
            } else {
              params.resource = ''
            }
            if (this.attachmentFileList && this.attachmentFileList.length) {
              params.attachment = JSON.stringify(this.attachmentFileList);
            } else {
              params.attachment = ''
            }
            params.labels = [];
            if (this.params.labels_ids && this.params.labels_ids.length) {
              this.params.labels_ids.forEach(id => {
                params.labels.push({
                  component_label_id: id
                })
              })
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

      getSoftwarePlatform() {
        let vars = {};
        vars.key = 'software_platform';
        vars.params = {
          conds: [],
          dims: [],
          order: ['id', 'DESC'],
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data) {
            this.softwarePlatList = data.data || [];
          }
        });
      },

      getComponentLabel() {
        let vars = {};
        vars.key = 'component_label';
        vars.params = {
          conds: [],
          dims: [],
          order: ['id', 'DESC'],
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data) {
            this.componentLabelList = data.data || [];
          }
        });
      },

      init() {
        // console.log(this.params);
        this.getSoftwarePlatform();
        this.getComponentLabel();
        if (this.params.documentation) {
          this.documentationDefaultFileList = JSON.parse(this.params.documentation);
          this.documentationFileList = this.$common.deepClone(this.documentationDefaultFileList);
        }
        if (this.params.package) {
          this.packageDefaultFileList = JSON.parse(this.params.package);
          this.packageFileList = this.$common.deepClone(this.packageDefaultFileList);
        }
        if (this.params.resource) {
          this.resourceDefaultFileList = JSON.parse(this.params.resource);
          this.resourceFileList = this.$common.deepClone(this.resourceDefaultFileList);
        }
        if (this.params.attachment) {
          this.attachmentDefaultFileList = JSON.parse(this.params.attachment);
          this.attachmentFileList = this.$common.deepClone(this.attachmentDefaultFileList);
        }
        this.params.labels_ids = [];
        if (this.params.labels && this.params.labels.length) {
          this.params.labels.forEach(item => {
            this.params.labels_ids.push(item.id)
          })
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
