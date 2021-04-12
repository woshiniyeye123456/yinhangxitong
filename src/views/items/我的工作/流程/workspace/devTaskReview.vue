<template>
  <el-card shadow="never" class="default-card">
    <div slot="header" class="clearfix">
      <span class="slot-title">工单面板</span>
    </div>
    <el-form label-width="120px"
             :model="params" :rules="rules" ref="refForm">
      <el-form-item label="评审参与人员:">
        <el-select
          v-model="params.devTaskReviewers_ids"
          placeholder="请选择:评审参与人员"
          style="width: 100%"
          :disabled="disabled"
          @change="changeTaskReviewers"
          multiple
          filterable
          autocomplete="off"
        >
          <el-option
            v-for="item in taskReviewersList"
            :label="item.name + ` ( ${item._department} ) ( ${item._role} )`"
            :value="item.id"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="评审意见:" prop="devTaskReviewComment">
        <el-input
          v-model="params.devTaskReviewComment"
          autosize
          type="textarea"
          :disabled="disabled"
          resize="none"
          placeholder="评审意见"
        ></el-input>
      </el-form-item>
      <el-form-item label="会议纪要:">
        <text-upload
          :modal="false"
          :defaultFileList="MMDefaultFileList"
          @update:successFileList="val => MMFileList = val"
          :maxImg="20"
        ></text-upload>
      </el-form-item>
      <el-form-item label="其他附件:">
        <text-upload
          :modal="false"
          :defaultFileList="filesDefaultFileList"
          @update:successFileList="val => filesFileList = val"
          :maxImg="20"
        ></text-upload>
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
  import tagInput from '../../../components/tag-input';
  import textUpload from '../../../components/text-upload'

  export default {
    name: "devTaskReview",
    inject: {
      user: {
        from: 'user',
        default: () => {
          return {}
        }
      }
    },
    components: {
      tagInput,
      textUpload,
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
      return {
        rules: {
          // devTaskReviewers: [{required: true, message: '请输入:评审参与人员', trigger: 'blur'}],
        },
        // 会议纪要
        MMDefaultFileList: [],
        MMFileList: [],
        // 其他附件
        filesDefaultFileList: [],
        filesFileList: [],
        //
        taskReviewersList: [],
        params: {
          devTaskReviewers_ids: [],
          devTaskReviewers: [],
        },
      }
    },
    methods: {

      changeTaskReviewers(ids) {
        this.params.devTaskReviewers = [];
        if (ids.length) {
          ids.forEach(id => {
            let team = this.taskReviewersList.find(it => it.id === id);
            if (team) {
              this.params.devTaskReviewers.push(team);
            }
          });
        }
      },

      goBack() {
        this.$router.go(-1)
      },

      save() {
        let params = this.$common.deepClone(this.params);
        params.devTaskReviewMM = this.$common.deepClone(this.MMFileList);
        params.devTaskReviewFiles = this.$common.deepClone(this.filesFileList);
        this.$emit('on-save', params);
      },

      submit() {
        let params = this.$common.deepClone(this.params);
        this.$refs.refForm.validate((valid) => {
          if (valid) {
            params.devTaskReviewMM = this.$common.deepClone(this.MMFileList);
            params.devTaskReviewFiles = this.$common.deepClone(this.filesFileList);
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
        this.$set(this.params, 'devTaskReviewers_ids', this.params.devTaskReviewers_ids || []);
        this.$set(this.params, 'devTaskReviewers', this.params.devTaskReviewers || []);
        // 附件
        if (data.devTaskReviewMM && data.devTaskReviewMM.length) {
          this.MMDefaultFileList = this.$common.deepClone(data.devTaskReviewMM);
          this.MMFileList = this.$common.deepClone(data.devTaskReviewMM);
        }
        if (data.devTaskReviewFiles && data.devTaskReviewFiles.length) {
          this.filesDefaultFileList = this.$common.deepClone(data.devTaskReviewFiles);
          this.filesFileList = this.$common.deepClone(data.devTaskReviewFiles);
        }
      },

      getTaskReviewers() {
        let vars = {};
        vars.key = 'account';
        vars.params = {
          conds: [],
          dims: [],
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data) {
            this.taskReviewersList = data.data || [];
            this.taskReviewersList.forEach(item => {
              let _role = [];
              if (item.roles) {
                item.roles.forEach(item => {
                  _role.push(item.name)
                })
              }
              item._role = _role.join(',');
              let _department = [];
              if (item.departments) {
                item.departments.forEach(item => {
                  _department.push(item.name)
                })
              }
              item._department = _department.join(',');
            });
          }
        });
      },

      init() {
        this.getTaskReviewers();
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
