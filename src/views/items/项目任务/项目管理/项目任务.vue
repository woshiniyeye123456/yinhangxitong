<template>
  <div class="default-box">
    <edit-table class="margin-top-8" :tableColumn="tableColumn" :tableData="tableData" :tableOptions="tableOptions"
      :pages="pages" :lines="lines" :total="total" @on-view="onView" @on-edit="onEdit" @on-filter-name-active="onFilterNameActive"
      @on-delete="onDelete" @change-page="changePage" @change-size="changeSize"></edit-table>
    <div class="margin-top-10 text-right">
      <el-button type="default" @click="goBack" size="small">
        返回
      </el-button>
    </div>
  </div>
</template>

<script>
import editTable from "../../components/edit-table";

export default {
  name: "renwuguanli",
  components: {
    editTable
  },
  computed: {},
  data() {
    return {
      // table
      tableColumn: [
        {
          prop: "task_name",
          label: "任务名称",
          align: "center",
          minWidth: "18"
        },
        {
          prop: "names",
          label: "当前执行者",
          align: "center",
          minWidth: "12"
        },
        // {
        //   prop: 'version',
        //   label: '项目名称',
        //   align: 'center',
        //   minWidth: '11',
        // },
        {
          prop: "created_time",
          label: "创建时间",
          align: "center",
          minWidth: "18"
        },
        {
          prop: "status",
          label: "流程状态",
          align: "center",
          minWidth: "10",
          filters: [
            // {value: '关闭', circleColor: '#00C5D4',},
            // {value: '已过时', circleColor: '#FFE027',},
            // {value: '开发中', circleColor: '#469CFF',},
            // {value: '已作废', circleColor: '#FB731B',}
            { value: "已关闭", circleColor: "gray" },
            { value: "已办结", circleColor: "green" },
            { value: "待处理", circleColor: "blue" },
            { value: "处理中", circleColor: "red" }
          ],
          isStatus: true
        }
        // {
        //   prop: 'status',
        //   label: '状态',
        //   filters: [
        //     {text: '正常', value: '正常'},
        //     {text: '禁止', value: '禁止'}
        //   ],
        //   tagSuccessVal: '正常',
        //   scope: true
        // },
      ],
      tableData: [],
      tableOptions: {
        operationWidth: "180",
        // height: 'calc(100vh - 120px)',
        // height: '100%',
        sequence: true,
        selection: false,
        loading: false,
        active: [
          "view"
          // 'edit',
          // 'delete',
        ],
        filterNameActive: [
          "流程"
          // '报告',
        ]
      },
      pages: 1,
      lines: 10,
      total: 0
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
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
      // console.log(params)
      this.$router.push({
        name: "viewTask",
        params: {
          params: params.row
        }
      });
    },

    onEdit(params) {
      // console.log(params);
      let vars = {};
      vars.key = "taskData";
      vars.task_id = params.row.ID;
      this.$api.wf(vars, this, data => {
        // console.log(data);
        if (data.data) {
          this.$router.push({
            name: "addTask",
            params: {
              params: data.data
            }
          });
        }
      });
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
      } else if (params.$active === "编辑") {
        let vars = {};
        vars.key = "taskData";
        vars.task_id = params.row.ID;
        this.$api.wf(vars, this, data => {
          // console.log(data);
          if (data.data) {
            this.$router.push({
              name: "addTask",
              params: {
                params: data.data
              }
            });
          }
        });
      } else if (params.$active === "查看") {
        let vars = {};
        vars.key = "taskData";
        vars.task_id = params.row.ID;
        this.$api.wf(vars, this, data => {
          // console.log(data);
          if (data.data) {
            this.$router.push({
              name: "viewTask",
              params: {
                params: data.data
              }
            });
          }
        });
      } else if (params.$active === "流程") {
        this.$router.push({
          name: "taskWorkflow",
          query: {
            id: params.row.instance_id
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
        key: "instances",
        project_id: this.id
      };
      this.tableOptions.loading = true;
      this.$api.ext(
        vars,
        this,
        data => {
          // console.log(data);
          if (data) {
            this.tableData = data.data || [];
          }
          this.tableOptions.loading = false;
        },
        () => {
          this.tableOptions.loading = false;
        }
      );
    },

    init() {
      this.getListData();
    }
  },
  created() {
    if (this.$route.query && this.$route.query.id) {
      this.id = this.$route.query.id;
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style scoped>
</style>
