<template>
  <el-card shadow="never" class="default-card">
    <div slot="header" class="clearfix">
      <span class="slot-title">工单面板</span>
    </div>
    <el-form label-width="120px"
             :model="params" :rules="rules" ref="refForm">
      <el-form-item label="检测:">
        <el-radio-group v-model="params.detection" :disabled="disabledAll">
          <el-radio
            v-for="(item, index) in detection"
            :label="item"
            :key="index"
            :disabled="disabled"
          >{{ item }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="web应用:" prop="baseurl"
                    v-show="params.detection === 'web应用'">
        <el-input
          :disabled="disabled || disabledAll"
          v-model="params.baseurl"
          placeholder="web应用"
        ></el-input>
      </el-form-item>
      <template v-if="params.detection === '移动应用'">
        <el-form-item label="移动应用:">
          <text-upload
            :disabled="disabled || disabledAll"
            accept=".apk, .ipa"
            :modal="false"
            :defaultFileList="appDefaultFileList"
            @update:successFileList="val => appFileList = val"
            :maxImg="1"
            @file-before="disabledAll = true"
            @file-after="disabledAll = false"
          ></text-upload>
        </el-form-item>
      </template>
      <el-form-item label="代码包:">
        <text-upload
          :disabled="disabled || disabledAll"
          accept=".zip, .tar"
          :modal="false"
          :defaultFileList="codePackageDefaultFileList"
          @update:successFileList="val => codePackageFileList = val"
          :maxImg="1"
          @file-before="disabledAll = true"
          @file-after="disabledAll = false"
        ></text-upload>
      </el-form-item>
      <el-form-item label="测试工具">
        <el-select
          v-model="params.test_tools"
          placeholder="请选择:测试工具"
          style="width: 100%"
          :disabled="disabled"
          filterable
          autocomplete="off"
          multiple
        >
          <el-option
            v-for="item in testTools"
            :label="item.name"
            :value="item.code"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <div class="margin-top-10 text-right" v-show="!readonly">
        <el-button
          type="default"
          @click="goBack"
          size="small"
        >
          返回
        </el-button>
        <!--<el-button-->
        <!--type="primary"-->
        <!--@click="save"-->
        <!--size="small"-->
        <!--v-if="!disabled"-->
        <!--&gt;-->
        <!--保存-->
        <!--</el-button>-->
        <el-button
          :disabled="disabledAll"
          type="primary"
          @click="submit"
          size="small"
          v-if="!disabled"
        >
          确认完成
        </el-button>
      </div>
    </el-form>
  </el-card>
</template>

<script>
  import {validateURL} from '../../../../../utils/validate'
  import textUpload from '../../../components/text-upload'
  import editTable from '../../../components/edit-table'

  export default {
    name: "submitTestSamples",
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
      editTable,
    },
    props: {
      disabled: {
        type: Boolean,
        default: false,
      },
      workflow_id: {
        type: Number,
        default: 0,
      },
      node_name: {
        type: String,
        default: '',
      },
      task_id: {
        type: Number,
        default: 0,
      },
      data_saved: {
        type: Boolean,
        default: false,
      },
      readonly: false
    },
    computed: {},
    data() {
      const validateUrl = (rule, value, callback) => {
        if (this.params.detection === 'web应用') {
          if (!value) {
            callback(new Error('请输入url'))
          } else if (!validateURL(value)) {
            callback(new Error('请输入正确的url'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      };
      return {
        rules: {
          baseurl: [{required: true, trigger: 'blur', validator: validateUrl}],
        },
        params: {},
        // 附件
        appDefaultFileList: [],
        appFileList: [],
        codePackageDefaultFileList: [],
        codePackageFileList: [],
        //
        detection: ['移动应用', 'web应用'],
        //
        testTools: [],
        disabledAll: false,
      }
    },
    methods: {

      getTool() {
        let vars = {};
        vars.key = 'external_system';
        vars.params = {
          conds: [
            'source <> 2',
            'status = 已启用',
          ],
          dims: [],
          order: ['id', 'DESC'],
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data.data) {
            this.testTools = data.data || [];
          }
        });
      },

      goBack() {
        this.$router.go(-1)
      },

      save() {
        let params = this.$common.deepClone(this.params);
        params.app = this.$common.deepClone(this.appFileList);
        params.code_package = this.$common.deepClone(this.codePackageFileList);
        this.$emit('on-save', params);
      },

      submit() {
        let params = this.$common.deepClone(this.params);
        this.$refs.refForm.validate((valid) => {
          if (valid) {
            if (params.detection === '移动应用') {
              params.testTools = ['bangcleAppTest', 'bangcleCodeChecker'];
              params.bangcleAppTestStatus = true;
              params.bangcleCodeCheckerStatus = true;
              params.bangcleLoopholeCheckerStatus = false;
              params.testToolValues = {
                bangcleAppTest: true,
                bangcleCodeChecker: true,
              };
              if (this.appFileList.length === 0) {
                // return this.$message.error('请上传app包');
              } else {
                params.bangcle_package_file = this.$common.deepClone(this.appFileList);
              }
            } else if (params.detection === 'web应用') {
              params.testTools = ['bangcleCodeChecker', 'bangcleLoopholeChecker'];
              params.bangcleAppTestStatus = false;
              params.bangcleCodeCheckerStatus = true;
              params.bangcleLoopholeCheckerStatus = true;
              params.testToolValues = {
                bangcleCodeChecker: true,
                bangcleLoopholeChecker: true,
              };
              if (!params.baseurl) {
                // return this.$message.error('请输入:web应用');
              } else {
                params.web_package = [
                  {
                    baseurl: params.baseurl
                  }
                ]
              }
            }
            if (this.codePackageFileList.length === 0) {
              // return this.$message.error('请上传代码包');
            } else {
              params.code_package = this.$common.deepClone(this.codePackageFileList);
              params.code_package.forEach(item => {
                item.key = Date.parse(new Date());
                item.visibility = 'public'
              });
              params.dependency_package = this.$common.deepClone(this.codePackageFileList);
            }
            this.$emit('on-submit', params);
          } else {
            return this.$message.error('操作失败');
          }
        });
      },

      getTaskData() {
        let vars = {
          task_id: this.task_id,
          key: 'taskData',
        };
        this.$api.wf(vars, this, data => {
          // console.log(data);
          if (data && data.data) {
            this.setData(data.data);
          }
        });
      },

      getView() {
        let vars = {
          workflow_id: this.workflow_id,
          key: 'view',
          name: 'taskData',
        };
        this.$api.wf(vars, this, data => {
          if (data && data.data) {
            this.setData(data.data);
          }
        });
      },

      setData(data) {
        this.params = data;
        if (!this.params.detection) {
          this.$set(this.params, 'detection', '移动应用')
        }
        if (!this.params.baseurl) {
          this.$set(this.params, 'baseurl', '')
        }
        if (!this.params.test_tools) {
          this.$set(this.params, 'test_tools', [])
        }
        // 附件
        if (data.bangcle_package_file && data.bangcle_package_file.length) {
          this.appDefaultFileList = this.$common.deepClone(data.bangcle_package_file);
          this.appFileList = this.$common.deepClone(data.bangcle_package_file);
        }
        if (data.code_package && data.code_package.length) {
          this.codePackageDefaultFileList = this.$common.deepClone(data.code_package);
          this.codePackageFileList = this.$common.deepClone(data.code_package);
        }
      },

      init() {
        this.getTool();
        if (this.data_saved) {
          this.getTaskData()
        } else {
          this.getView();
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
