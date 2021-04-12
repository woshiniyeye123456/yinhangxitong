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
  </div>
</template>

<script>
import searchForm from "./components/search-form";
import panelTodo from "./components/panel-todo";
import editTable from "../../components/edit-table";
import mixins from "./mixins";

export default {
  name: "yiwanjiegongzuo",
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
        operationWidth: "120",
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
        filterNameActive: ["工单详情"]
      },
      pages: 1,
      lines: 10,
      total: 0
    };
  },
  methods: {
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
      console.log(params);
      if (params.$active === "版本") {
        this.$router.push({
          name: "baselineLibraryVersion",
          query: {
            group_id: params.row.group_id
          }
        });
      } else if (params.$active === "工单详情") {
        this.$router.push({
          name: "workflowDetails",
          query: {
            workflow_id: params.row.workflow_id,
            workspace: params.row.node_name
          }
        });
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
        status: "已办结",
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
      this.tableOptions.loading = false;
      this.$api.wf(
        vars,
        this,
        data => {
          // console.log(data);
          if (data.data) {
            this.total = data.data.total;
            this.tableData = data.data.data || [];
            this.tableOptions.loading = false;
          }
        },
        () => {
          this.tableOptions.loading = false;
        }
      );
    },

    taskStatistics() {
      let vars = {
        actor: this.user.name,
        status: "已办结"
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

    init() {
      this.getListData();
    }
  },
  mounted() {
    this.init();
    this.taskStatistics();
  }
};
</script>

<style scoped>
</style>
