<template>
  <el-form label-width="115px"
           :model="params" :rules="rules" ref="refForm">
    <div class="form-page-full">
      <el-card shadow="never" class="default-card">
        <div slot="header" class="clearfix">
          <span class="slot-title">项目信息</span>
        </div>
        <el-form-item label="项目名称:" prop="application_name">
          <el-input type="text" v-model="params.application_name"
                    placeholder="项目名称"></el-input>
        </el-form-item>
        <el-form-item label="项目简称:" prop="application_abbreviation">
          <el-input type="text" v-model="params.application_abbreviation"
                    placeholder="项目简称"></el-input>
        </el-form-item>
        <el-form-item label="所属处室:" prop="office_id">
          <el-select
            v-model="params.office_id"
            placeholder="请选择:所属处室"
            style="width: 100%"
            @change="changeOff"
            filterable
            autocomplete="off"
          >
            <el-option
              v-for="(item, index) in departmentList"
              :label="item.name"
              :value="item.id"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属项目组:" prop="project_id">
          <el-select
            v-model="params.project_id"
            placeholder="请选择:所属项目组"
            style="width: 100%"
            @change="changePro"
            filterable
            autocomplete="off"
          >
            <el-option
              v-for="(item, index) in departmentList"
              :label="item.name"
              :value="item.id"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品经理:" v-if="params.project_id">
          <el-select
            v-model="params.product_manager"
            style="width: 100%"
            multiple
            filterable
            autocomplete="off"
          >
            <el-option
              v-for="(item, index) in productManagerList"
              :label="item.real_name"
              :value="item.account_id"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="安全专员:" v-if="params.project_id">
          <el-select
            v-model="params.safety_officer"
            style="width: 100%"
            multiple
            filterable
            autocomplete="off"
          >
            <el-option
              v-for="(item, index) in safetyOfficerList"
              :label="item.real_name"
              :value="item.account_id"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目经理:" v-if="params.project_id">
          <el-select
            v-model="params.project_manager"
            style="width: 100%"
            multiple
            filterable
            autocomplete="off"
          >
            <el-option
              v-for="(item, index) in projectManagerList"
              :label="item.real_name"
              :value="item.account_id"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合作项目负责人:" v-if="params.project_id">
          <el-select
            v-model="params.cooperation_manager"
            style="width: 100%"
            multiple
            filterable
            autocomplete="off"
          >
            <el-option
              v-for="(item, index) in cooperationManagerList"
              :label="item.real_name"
              :value="item.account_id"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
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
      </el-card>
    </div>
  </el-form>
</template>

<script>
  import mixins from '../mixins'
  import textUpload from '../../../components/text-upload'
  import imgUpload from '../../../components/img-upload'

  export default {
    name: "项目form",
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
        activeName: '1',
        rules: {
          application_name: [{required: true, message: '请输入:项目名称', trigger: 'blur'}],
          application_abbreviation: [{required: true, message: '请输入:项目简称', trigger: 'blur'}],
          office_id: [{required: true, message: '请选择:所属处室', trigger: 'change'}],
          project_id: [{required: true, message: '请选择:所属项目组', trigger: 'change'}],
        },
        fileDefaultFileList: [],
        fileFileList: [],
        //
        departmentList: [],
        productManagerList: [],
        safetyOfficerList: [],
        projectManagerList: [],
        cooperationManagerList: [],
        // technicalRiskIdentification: [
        //   {
        //     label: '是否对身份认证部分代码做修改',
        //     list: [
        //       {
        //         label: '是',
        //         score: 3,
        //       },
        //       {
        //         label: '否',
        //         score: 0,
        //       },
        //       {
        //         label: '不确定',
        //         score: 3,
        //       },
        //     ],
        //     value: '',
        //   },
        //   {
        //     label: '是否对登录后才能使用的业务做了代码修改',
        //     list: [
        //       {
        //         label: '是',
        //         score: 3,
        //       },
        //       {
        //         label: '否',
        //         score: 0,
        //       },
        //       {
        //         label: '不确定',
        //         score: 3,
        //       },
        //     ],
        //     value: '',
        //   },
        //   {
        //     label: '是否修改加解密机制',
        //     list: [
        //       {
        //         label: '是',
        //         score: 3,
        //       },
        //       {
        //         label: '否',
        //         score: 0,
        //       },
        //       {
        //         label: '不确定',
        //         score: 3,
        //       },
        //     ],
        //     value: '',
        //   },
        //   {
        //     label: '是否开放新的对用户侧业务接口',
        //     list: [
        //       {
        //         label: '是',
        //         score: 3,
        //       },
        //       {
        //         label: '否',
        //         score: 0,
        //       },
        //       {
        //         label: '不确定',
        //         score: 3,
        //       },
        //     ],
        //     value: '',
        //   },
        //   {
        //     label: '是否开发新的数据获取、修改接口',
        //     list: [
        //       {
        //         label: '是',
        //         score: 3,
        //       },
        //       {
        //         label: '否',
        //         score: 0,
        //       },
        //       {
        //         label: '不确定',
        //         score: 3,
        //       },
        //     ],
        //     value: '',
        //   },
        //   {
        //     label: '是否引入新的第三方组件或代码',
        //     list: [
        //       {
        //         label: '是',
        //         score: 2,
        //       },
        //       {
        //         label: '否',
        //         score: 0,
        //       },
        //       {
        //         label: '不确定',
        //         score: 2,
        //       },
        //     ],
        //     value: '',
        //   },
        //   {
        //     label: '是否向第三方服务开放新的接口',
        //     list: [
        //       {
        //         label: '是',
        //         score: 3,
        //       },
        //       {
        //         label: '否',
        //         score: 0,
        //       },
        //       {
        //         label: '不确定',
        //         score: 3,
        //       },
        //     ],
        //     value: '',
        //   },
        //   {
        //     label: '是否向第三方企业发送了用户个人隐私相关数据',
        //     list: [
        //       {
        //         label: '是',
        //         score: 3,
        //       },
        //       {
        //         label: '否',
        //         score: 0,
        //       },
        //       {
        //         label: '不确定',
        //         score: 3,
        //       },
        //     ],
        //     value: '',
        //   },
        //   {
        //     label: '是否对现有安全机制做修改',
        //     list: [
        //       {
        //         label: '是',
        //         score: 3,
        //       },
        //       {
        //         label: '否',
        //         score: 0,
        //       },
        //       {
        //         label: '不确定',
        //         score: 3,
        //       },
        //     ],
        //     value: '',
        //   },
        //   {
        //     label: '是否更新IDE开发工具',
        //     list: [
        //       {
        //         label: '是',
        //         score: 2,
        //       },
        //       {
        //         label: '否',
        //         score: 0,
        //       },
        //       {
        //         label: '不确定',
        //         score: 2,
        //       },
        //     ],
        //     value: '',
        //   },
        //   {
        //     label: '是否修改了对基础支撑软件的依赖关系',
        //     list: [
        //       {
        //         label: '是',
        //         score: 1,
        //       },
        //       {
        //         label: '否',
        //         score: 0,
        //       },
        //       {
        //         label: '不确定',
        //         score: 1,
        //       },
        //     ],
        //     value: '',
        //   },
        //   {
        //     label: '是否涉及新的用户个人数据输入（APP相关）',
        //     list: [
        //       {
        //         label: '是',
        //         score: 2,
        //       },
        //       {
        //         label: '否',
        //         score: 0,
        //       },
        //       {
        //         label: '不确定',
        //         score: 2,
        //       },
        //     ],
        //     value: '',
        //   },
        //   {
        //     label: '是否申请了新的系统权限（APP相关）',
        //     list: [
        //       {
        //         label: '是',
        //         score: 2,
        //       },
        //       {
        //         label: '否',
        //         score: 0,
        //       },
        //       {
        //         label: '不确定',
        //         score: 2,
        //       },
        //     ],
        //     value: '',
        //   },
        //   {
        //     label: '是否使用了新的系统权限（APP相关）',
        //     list: [
        //       {
        //         label: '是',
        //         score: 2,
        //       },
        //       {
        //         label: '否',
        //         score: 0,
        //       },
        //       {
        //         label: '不确定',
        //         score: 2,
        //       },
        //     ],
        //     value: '',
        //   },
        //   {
        //     label: '服务器是否开放使用了新的端口（服务器相关）',
        //     list: [
        //       {
        //         label: '是',
        //         score: 2,
        //       },
        //       {
        //         label: '否',
        //         score: 0,
        //       },
        //       {
        //         label: '不确定',
        //         score: 2,
        //       },
        //     ],
        //     value: '',
        //   },
        //   {
        //     label: '是否对系统本地的第三方应用产生依赖关系（客户端相关）',
        //     list: [
        //       {
        //         label: '是',
        //         score: 1,
        //       },
        //       {
        //         label: '否',
        //         score: 0,
        //       },
        //       {
        //         label: '不确定',
        //         score: 1,
        //       },
        //     ],
        //     value: '',
        //   },
        // ],
        // notTechnicalRiskIdentification: [
        //   {
        //     label: '项目核心技术人员是否有重大变动',
        //     list: [
        //       {
        //         label: '是',
        //         score: 2,
        //       },
        //       {
        //         label: '否',
        //         score: 0,
        //       },
        //       {
        //         label: '不确定',
        //         score: 2,
        //       },
        //     ],
        //     value: '',
        //   },
        //   {
        //     label: '项目安全相关岗位人员是否有变动',
        //     list: [
        //       {
        //         label: '是',
        //         score: 3,
        //       },
        //       {
        //         label: '否',
        //         score: 0,
        //       },
        //       {
        //         label: '不确定',
        //         score: 3,
        //       },
        //     ],
        //     value: '',
        //   },
        //   {
        //     label: '项目研发流程是否有变动',
        //     list: [
        //       {
        //         label: '是',
        //         score: 2,
        //       },
        //       {
        //         label: '否',
        //         score: 0,
        //       },
        //       {
        //         label: '不确定',
        //         score: 2,
        //       },
        //     ],
        //     value: '',
        //   },
        //   {
        //     label: '该项目对应的系统是否为6个月内新开发系统',
        //     list: [
        //       {
        //         label: '是',
        //         score: 2,
        //       },
        //       {
        //         label: '否',
        //         score: 0,
        //       },
        //       {
        //         label: '不确定',
        //         score: 2,
        //       },
        //     ],
        //     value: '',
        //   },
        //   {
        //     label: '项目组是否有完整、科学、专业的威胁建模及安全需求执行环节',
        //     list: [
        //       {
        //         label: '是',
        //         score: 3,
        //       },
        //       {
        //         label: '否',
        //         score: 0,
        //       },
        //       {
        //         label: '不确定',
        //         score: 3,
        //       },
        //     ],
        //     value: '',
        //   },
        //   {
        //     label: '项目组是否有完整、科学、专业的威胁建模及安全设计执行环节',
        //     list: [
        //       {
        //         label: '是',
        //         score: 3,
        //       },
        //       {
        //         label: '否',
        //         score: 0,
        //       },
        //       {
        //         label: '不确定',
        //         score: 3,
        //       },
        //     ],
        //     value: '',
        //   },
        //   {
        //     label: '项目组是否有完整、科学、专业的威胁建模及安全测试用例开发环节',
        //     list: [
        //       {
        //         label: '是',
        //         score: 3,
        //       },
        //       {
        //         label: '否',
        //         score: 0,
        //       },
        //       {
        //         label: '不确定',
        //         score: 3,
        //       },
        //     ],
        //     value: '',
        //   },
        //   {
        //     label: '项目组是否有完整、科学、专业的威胁建模及安全测试用例执行环节',
        //     list: [
        //       {
        //         label: '是',
        //         score: 3,
        //       },
        //       {
        //         label: '否',
        //         score: 0,
        //       },
        //       {
        //         label: '不确定',
        //         score: 3,
        //       },
        //     ],
        //     value: '',
        //   },
        //   {
        //     label: '团队外包人员比例',
        //     list: [
        //       {
        //         label: '高',
        //         score: 2,
        //       },
        //       {
        //         label: '中',
        //         score: 1,
        //       },
        //       {
        //         label: '低',
        //         score: 0,
        //       },
        //     ],
        //     value: '',
        //   },
        //   {
        //     label: '团队对于应用所面临的监管合规性要求是否清晰',
        //     list: [
        //       {
        //         label: '是',
        //         score: 3,
        //       },
        //       {
        //         label: '否',
        //         score: 0,
        //       },
        //       {
        //         label: '不确定',
        //         score: 3,
        //       },
        //     ],
        //     value: '',
        //   },
        // ],
      }
    },
    methods: {

      getManager(path, isEdit) {
        let vars = {};
        vars.key = 'account_of_department';
        vars.params = {
          conds: [
            'path HAS_PREFIX ' + path
          ],
          dims: [],
          order: ['id', 'DESC'],
        };
        if (!isEdit) {
          this.params.product_manager = [];
          this.params.product_manager_item = [];
          this.params.safety_officer = [];
          this.params.safety_officer_item = [];
          this.params.project_manager = [];
          this.params.project_manager_item = [];
          this.params.cooperation_manager = [];
          this.params.cooperation_manager_item = [];
        }
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data.data) {
            // 项目组成员
            this.params.team_member = data.data;
            // 产品经理
            this.productManagerList = data.data.filter(item => {
              if (item.roles) {
                return item.roles.find(ro => {
                  return ro.name === '产品经理'
                })
              }
              return false
            });
            if (!isEdit) {
              this.productManagerList.forEach(item => {
                this.params.product_manager.push(item.account_id);
                this.params.product_manager_item.push(item);
              });
            }
            // 安全专员
            this.safetyOfficerList = data.data.filter(item => {
              if (item.roles) {
                return item.roles.find(ro => {
                  return ro.name === '安全专员'
                })
              }
              return false
            });
            if (!isEdit) {
              this.safetyOfficerList.forEach(item => {
                this.params.safety_officer.push(item.account_id);
                this.params.safety_officer_item.push(item);
              });
            }
            // 项目经理
            this.projectManagerList = data.data.filter(item => {
              if (item.roles) {
                return item.roles.find(ro => {
                  return ro.name === '项目经理'
                })
              }
              return false
            });
            if (!isEdit) {
              this.projectManagerList.forEach(item => {
                this.params.project_manager.push(item.account_id);
                this.params.project_manager_item.push(item);
              });
            }
            // 合作项目负责人
            this.cooperationManagerList = data.data.filter(item => {
              if (item.roles) {
                return item.roles.find(ro => {
                  return ro.name === '合作项目负责人'
                })
              }
              return false
            });
            if (!isEdit) {
              this.cooperationManagerList.forEach(item => {
                this.params.cooperation_manager.push(item.account_id);
                this.params.cooperation_manager_item.push(item);
              });
            }
          }
        });
      },

      changePro(id) {
        this.params.project_item = {};
        this.params.project_name = '';
        if (id) {
          this.params.project_item = this.departmentList.find(it => it.id === id);
          this.params.project_name = this.params.project_item.name;
          this.getManager(this.params.project_item.path)
        }
      },

      changeOff(id) {
        this.params.office_item = {};
        this.params.office_name = '';
        if (id) {
          this.params.office_item = this.departmentList.find(it => it.id === id);
          this.params.office_name = this.params.office_item.name;
        }
      },

      getDepartment() {
        let vars = {};
        vars.key = 'department';
        vars.params = {
          conds: [],
          dims: [],
          order: ['id', 'ASC'],
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data) {
            this.departmentList = data.data || [];
          }
        });
      },

      change(val) {
        if (val && val.length) {
          this.params.parent_id = val[val.length - 1];
        } else {
          this.params.parent_id = 0;
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
        // console.log(params)
        this.$refs.refForm.validate((valid) => {
          if (valid) {
            params.file = this.$common.deepClone(this.fileFileList);
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
        this.getDepartment();
        if (this.params.file) {
          this.fileDefaultFileList = this.$common.deepClone(this.params.file);
          this.fileFileList = this.$common.deepClone(this.fileDefaultFileList);
        }
        if (this.params && this.params.project_item) {
          this.getManager(this.params.project_item.path, true)
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
  .form-page-full {
    height: calc(100vh - 55px - 46px - 60px - 42px - 20px);
    overflow-y: auto;
  }
</style>
