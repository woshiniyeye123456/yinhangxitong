<template>
  <div class="default-box">
    <el-row :gutter="14">
      <el-col :span="8">
        <panel-todo :panelData="panelData1"></panel-todo>
      </el-col>
      <el-col :span="8">
        <panel-todo :panelData="panelData2"></panel-todo>
      </el-col>
      <el-col :span="8">
        <panel-todo :panelData="panelData3"></panel-todo>
      </el-col>
    </el-row>
    <!-- search-form -->
    <search-form class="margin-top-14" @on-search="onSearch"></search-form>
    <edit-table class="margin-top-14" :tableColumn="tableColumn" :tableData="tableData" :tableOptions="tableOptions"
      :pages="pages" :lines="lines" :total="total" @on-view="onView" @on-edit="onEdit" @on-filter-name-active="onFilterNameActive"
      @on-delete="onDelete" @change-page="changePage" @change-size="changeSize"></edit-table>
    <!-- 转移工单 -->
    <el-dialog title="转移工单" :append-to-body="true" :close-on-click-modal="true" :visible.sync="dialogVisible" width="550px"
      class="dialog-default">
      <el-form label-width="85px" class="default-search" :model="dialogParams" :rules="dialogRules" ref="refForm">
        <el-form-item label="替换人">
          <el-select v-model="dialogParams.actor" placeholder="请选择:替换人" style="width: 100%" filterable>
            <el-option v-for="item in accountList" :label="item.real_name + ` ( ${item.name} ) ( ${item._department} )`"
              :value="item.name" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="margin-top-20 text-right">
        <el-button type="default" @click="dialogVisible = false" size="small">
          取消
        </el-button>
        <el-button type="primary" @click="dialogSubmit" size="small">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import searchForm from "./components/search-form";
import panelTodo from "./components/panel-todo";
import editTable from "../../components/edit-table";
import mixins from "./mixins";

export default {
  name: "daibangongdan",
  inject: {
    user: {
      from: "user",
      default: () => {
        return {};
      }
    }
  },
  components: {
    searchForm,
    panelTodo,
    editTable
  },
  mixins: [mixins],
  computed: {
    ...mapGetters(["newMsg"])
  },
  data() {
    return {
      panelData1: {
        val: 0,
        title: "项目数",
        icon: "钱",
        duration: 2600,
        className: "icon-message",
        decimals: 0
      },
      panelData2: {
        val: 0,
        title: "任务数",
        icon: "钱",
        duration: 3600,
        className: "icon-message",
        decimals: 0
      },
      panelData3: {
        val: 0,
        title: "工单数",
        icon: "钱",
        duration: 4600,
        className: "icon-message",
        decimals: 0
      },
      // table
      tableColumn: [
        {
          prop: "title",
          label: "工单描述",
          align: "center",
          minWidth: "18"
        },
        {
          prop: "project_name",
          label: "所属项目",
          align: "center",
          minWidth: "18"
        },
        {
          prop: "task_name",
          label: "所属任务",
          align: "center",
          minWidth: "18"
        },
        {
          prop: "created_time",
          label: "创建时间",
          align: "center",
          minWidth: "18"
        },
        {
          prop: "updated_time",
          label: "最近操作时间",
          align: "center",
          minWidth: "18"
        },
        {
          prop: "status",
          label: "流程状态",
          align: "center",
          minWidth: "10"
        }
      ],
      tableData: [],
      tableOptions: {
        operationWidth: "240",
        // height: 'calc(100vh - 120px)',
        // height: '100%',
        sequence: true,
        selection: false,
        loading: false,
        active: [
          // 'view',
          // 'edit',
          // 'delete',
        ],
        filterNameActive: [
          "立即处理",
          "转移工单"
          // {
          //   isSwitch: true,                 // isSwitch = true 不会取name, type的数据会执行handler函数的返回值的name,type
          //   // name: ['上架', '下架'],          // 不会在这里取数据
          //   // type: ['success', 'danger'],    // 不会在这里取数据
          //   handler: (data) => {
          //     if (data.status === '已启用') {
          //       return {
          //         name: '作废',
          //         type: 'danger',
          //       }
          //     } else {
          //       return {
          //         name: '启用',
          //         type: 'success',
          //       }
          //     }
          //   }
          // },
        ]
      },
      pages: 1,
      lines: 10,
      total: 0,
      dialogVisible: false,
      dialogParams: {
        task_id: 0,
        actor: ""
      },
      dialogRules: {
        actor: [{ required: true, message: "请选择: 替换人", trigger: "blur" }]
      },
      accountList: []
    };
  },
  methods: {
    dialogSubmit() {
      let params = this.$common.deepClone(this.dialogParams);
      this.$refs.refForm.validate(valid => {
        if (valid) {
          // console.log(params);
          let loading = this.$loading({ background: "rgba(0, 0, 0, 0.5)" });
          let vars = params;
          vars.key = "transferTask";
          this.$api.wf(
            vars,
            this,
            () => {
              loading.close();
              this.$message({
                type: "success",
                message: "操作成功"
              });
              this.dialogVisible = false;
              this.transferTaskOfNode(params);
              this.goback();
            },
            () => {
              loading.close();
            }
          );
        } else {
          return this.$message.error("操作失败");
        }
      });
    },

    transferTaskOfNode(params) {
      let vars = {
        task_id: params.task_id,
        node_name: params.node_name,
        actor_user: params.actor,
        old_actor_user: this.user.name
      };
      vars.key = "transferTaskOfNode";
      this.$api.ext(vars, this);
    },

    onSearch(searchParams) {
      this.searchParams = searchParams;
      this.initData();
    },

    add() {
      this.$router.push({
        name: "addTask"
      });
    },

    submit(params) {
      let loading = this.$loading({ background: "rgba(0, 0, 0, 0.5)" });
      let vars = {};
      vars.key = "baseline_library";
      vars.params = params;
      this.$api.save(
        vars,
        this,
        () => {
          loading.close();
          this.$message({
            type: "success",
            message: "操作成功"
          });
          this.goback();
        },
        () => {
          loading.close();
        }
      );
    },

    update(params) {
      let loading = this.$loading({ background: "rgba(0, 0, 0, 0.5)" });
      let vars = {};
      vars.key = "baseline_library";
      vars.params = params;
      this.$api.update(
        vars,
        this,
        () => {
          loading.close();
          this.$message({
            type: "success",
            message: "操作成功"
          });
          this.goback();
        },
        () => {
          loading.close();
        }
      );
    },

    goback(v) {
      if (v) {
        this.initData();
      } else {
        this.getListData();
      }
      this.taskStatistics();
    },

    onDelete(params) {
      // console.log(params);
      let ids = [];
      params.forEach(item => {
        ids.push(item.id);
      });
      let vars = {};
      vars.key = "baseline_library";
      vars.params = {
        ids: ids.join(",")
      };
      this.$api.del(vars, this, () => {
        this.$message({
          type: "success",
          message: "删除成功"
        });
        this.goback(true);
      });
    },

    onView(params) {
      console.log(params);
    },

    onEdit(params) {
      console.log(params);
    },

    onFilterNameActive(params) {
      // console.log(params)
      if (params.$active === "立即处理") {
        this.$router.push({
          name: "workflow",
          query: {
            workflow_id: params.row.workflow_id
          },
          params: {
            node_name: params.row.node_name,
            node_id: params.row.node_id,
            task_id: params.row.ID,
            data_saved: params.row.data_saved,
            work_flow: params.row.work_flow
          }
        });
      } else if (params.$active === "转移工单") {
        // console.log(params.row);
        this.dialogParams = {
          task_id: params.row.ID,
          actor: "",
          node_name: params.row.node_name
        };
        this.dialogVisible = true;
      }
    },

    changePage(page) {
      this.pages = page;
      this.getListData();
    },

    changeSize(size) {
      this.lines = size;
      this.getListData();
    },

    initData() {
      this.pages = 1;
      this.lines = 10;
      this.getListData();
    },

    getListData() {
      let vars = {
        actor: this.user.name,
        status: "待处理",
        paging: this.pages + "," + this.lines
      };
      vars.key = "tasks";
      if (this.searchParams) {
        for (let key in this.searchParams) {
          if (this.searchParams[key]) {
            vars[key] = this.searchParams[key];
          }
        }
      }
      this.tableOptions.loading = true;
      this.$api.wf(
        vars,
        this,
        data => {
          // console.log(data);
          if (data.data) {
            this.total = data.data.total;
            this.tableData = data.data.data || [];
            this.$store.commit("SET_TODONUMBER", data.data.total || 0);
          }
          this.tableOptions.loading = false;
          this.$store.commit("SET_NEWMSG", false);
        },
        () => {
          this.tableOptions.loading = false;
          this.$store.commit("SET_NEWMSG", false);
        }
      );
    },

    taskStatistics() {
      let vars = {
        actor: this.user.name,
        status: "待处理"
      };
      vars.key = "taskStatistics";
      this.$api.wf(vars, this, data => {
        // console.log(data)
        if (data) {
          this.panelData1.val = data.data.projects || 0;
          this.panelData2.val = data.data.tasks || 0;
          this.panelData3.val = data.data.work_order || 0;
        }
      });
    },

    getAccount() {
      let vars = {};
      vars.key = "account";
      vars.params = {
        conds: [],
        dims: [],
        order: ["id", "DESC"]
      };
      this.$api.get(vars, this, data => {
        // console.log(data);
        if (data) {
          this.accountList = data.data || [];
          this.accountList.forEach(item => {
            let _role = [];
            if (item.roles) {
              item.roles.forEach(item => {
                _role.push(item.name);
              });
            }
            item._role = _role.join(",");
            let _department = [];
            if (item.departments) {
              item.departments.forEach(item => {
                _department.push(item.name);
              });
            }
            item._department = _department.join(",");
          });
        }
      });
    },

    init() {
      this.getListData();
    }
  },
  mounted() {
    this.init();
    this.taskStatistics();
    this.getAccount();
  },
  watch: {
    newMsg(val) {
      if (val) {
        this.getListData();
      }
    }
  }
};
</script>

<style scoped>
</style>
