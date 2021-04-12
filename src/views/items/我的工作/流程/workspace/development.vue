<template>
  <el-card shadow="never" class="default-card">
    <div slot="header" class="clearfix">
      <span class="slot-title">工单面板</span>
    </div>
    <el-form label-width="120px"
             :model="params" :rules="rules" ref="refForm">
      <div class="default-tool">
        <el-button type="primary" size="small" @click="add" icon="el-icon-circle-plus-outline">
          问题记录
        </el-button>
      </div>
      <edit-table
        class="margin-top-8"
        :tableColumn="tableColumn"
        :tableData="tableData"
        :tableOptions="tableOptions"
        @on-edit="onEdit"
        @on-filter-name-active="onFilterNameActive"
        @on-delete="onDelete"
      ></edit-table>
      <!-- popup -->
      <popup
        :params="popupParams"
        :visible.sync="popupVisible"
        @on-submit="popupSubmit"
      ></popup>
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
  import textUpload from '../../../components/text-upload'
  import editTable from '../../../components/edit-table'
  import popup from '../components/popup-issues'

  export default {
    name: "development",
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
      popup,
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
        appType: ['Android', 'iOS'],
        table_id: 1,
        rules: {
          // devTaskReviewers: [{required: true, message: '请输入:评审参与人员', trigger: 'blur'}],
        },
        params: {},
        // table
        tableColumn: [
          {
            prop: 'creator',
            label: '提出人',
            align: 'center',
            minWidth: '18',
          },
          {
            prop: 'created_time',
            label: '提出时间',
            align: 'center',
            minWidth: '18',
          },
          {
            prop: 'problem_description',
            label: '问题描述',
            align: 'center',
            minWidth: '18',
          },
        ],
        tableData: [],
        tableOptions: {
          operationWidth: '240',
          // height: 'calc(100vh - 120px)',
          // height: '100%',
          sequence: true,
          selection: false,
          loading: false,
          active: [
            // 'view',
            'edit',
            'delete',
          ],
          filterNameActive: [],
        },
        // popup
        popupVisible: false,
        popupParams: {},
        // 附件
        fileDefaultFileList: [],
        fileFileList: [],
      }
    },
    methods: {

      goBack() {
        this.$router.go(-1)
      },

      save() {
        let params = this.$common.deepClone(this.params);
        params.devIssues = this.$common.deepClone(this.tableData);
        // params.bangcle_package_file = this.$common.deepClone(this.fileFileList);
        this.$emit('on-save', params);
      },

      submit() {
        let params = this.$common.deepClone(this.params);
        this.$refs.refForm.validate((valid) => {
          if (valid) {
            params.devIssues = this.$common.deepClone(this.tableData);
            // params.bangcle_package_file = this.$common.deepClone(this.fileFileList);
            this.$emit('on-submit', params);
          } else {
            return this.$message.error('操作失败');
          }
        });
      },

      add() {
        this.popupParams = {
          creator_id: this.user.id,
          creator: this.user.name,
          created_time: this.$common.getThisTime(),
        };
        this.popupVisible = true;
      },

      popupSubmit(params) {
        if (params._id) {
          let index;
          let td = this.tableData.find((td, i) => {
            index = i;
            return td._id === params._id
          });
          if (td) {
            this.$set(this.tableData, [index], params)
          } else {
            this.$set(this.tableData, [params._id - 1], params)
          }
        } else {
          params._id = this.table_id++;
          this.tableData.push(params);
        }
      },

      onDelete(params) {
        // console.log(params);
        this.tableData = this.tableData.filter(it => it._id !== params[0]._id);
      },

      onEdit(params) {
        // console.log(params);
        this.popupParams = this.$common.deepClone(params.row);
        this.popupVisible = true;
      },

      onFilterNameActive(params) {
        console.log(params)
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
        // 问题
        if (data.devIssues && data.devIssues.length) {
          this.tableData = this.$common.deepClone(data.devIssues);
          this.table_id = (this.tableData[this.tableData.length - 1]._id) + 1;
        }
        // 附件
        // if (data.bangcle_package_file && data.bangcle_package_file.length) {
        //   this.fileDefaultFileList = this.$common.deepClone(data.bangcle_package_file);
        //   this.fileFileList = this.$common.deepClone(data.bangcle_package_file);
        // }
        if (this.disabled) {
          this.tableOptions.active = [];
        }
      },

      init() {
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
