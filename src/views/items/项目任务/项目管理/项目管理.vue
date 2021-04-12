<template>
  <div class="default-box">
    <!-- search-form -->
    <search-form @on-search="onSearch"></search-form>
    <!-- act-top -->
    <act-top v-if="permissions.indexOf('新增') !== -1" @add="add" @project-report="projectReport"></act-top>
    <edit-table class="margin-top-8" :tableColumn="tableColumn" :tableData="tableData" :tableOptions="tableOptions"
      :pages="pages" :lines="lines" :total="total" @on-view="onView" @on-edit="onEdit" @on-filter-name-active="onFilterNameActive"
      @on-delete="onDelete" @change-page="changePage" @change-size="changeSize"></edit-table>
    <!-- popup -->
    <popup title="项目报表" :tableData="tableData" :visible.sync="visible"></popup>
  </div>
</template>

<script>
import searchForm from "./components/search-form";
import actTop from "./components/act-top";
import editTable from "../../components/edit-table";
import mixins from "./mixins";
import popup from "./components/项目报表";

export default {
  name: "xiangmuguanli",
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
    actTop,
    editTable,
    popup
  },
  mixins: [mixins],
  computed: {
    permissions() {
      return this.$route.meta.permissions || [];
    }
  },
  data() {
    return {
      // table
      tableColumn: [
        {
          prop: "_application_name",
          label: "名称",
          align: "center",
          minWidth: "14"
        },
        {
          prop: "_application_abbreviation",
          label: "描述",
          align: "center",
          minWidth: "14"
        },
        {
          prop: "task_count",
          label: "任务数",
          align: "center",
          minWidth: "14"
        },
        {
          prop: "$task",
          label: "进行任务占比",
          align: "center",
          minWidth: "14"
        },
        {
          prop: "status",
          label: "状态",
          align: "center",
          minWidth: "18"
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
        operationWidth: "440",
        // operationWidth: '290px',
        // height: 'calc(100vh - 120px)',
        // height: '100%',
        sequence: true,
        selection: false,
        loading: false,
        active: [
          "view",
          "edit"
          // 'delete',
        ],
        filterNameActive: [
          // {
          //   isSwitch: true,                 // isSwitch = true 不会取name, type的数据会执行handler函数的返回值的name,type
          //   // name: ['上架', '下架'],          // 不会在这里取数据
          //   // type: ['success', 'danger'],    // 不会在这里取数据
          //   handler: (data) => {
          //     if (data.status === '草稿') {
          //       return {
          //         name: '编辑',
          //         type: 'primary',
          //       }
          //     } else {
          //       return {
          //         name: '编辑',
          //         type: 'primary',
          //         disabled: true,
          //       }
          //     }
          //   }
          // },
          {
            isSwitch: true, // isSwitch = true 不会取name, type的数据会执行handler函数的返回值的name,type
            // name: ['上架', '下架'],          // 不会在这里取数据
            // type: ['success', 'danger'],    // 不会在这里取数据
            handler: data => {
              if (data.status === "关闭") {
                return {
                  name: "删除",
                  type: "warning"
                };
              } else {
                return {
                  name: "删除",
                  type: "warning",
                  disabled: true
                };
              }
            }
          },
          // {
          //   isSwitch: true,                 // isSwitch = true 不会取name, type的数据会执行handler函数的返回值的name,type
          //   // name: ['上架', '下架'],          // 不会在这里取数据
          //   // type: ['success', 'danger'],    // 不会在这里取数据
          //   handler: (data) => {
          //     if (data.status === '草稿') {
          //       return {
          //         name: '启动',
          //         type: 'primary',
          //       }
          //     } else if (data.status === '已启动') {
          //       return {
          //         name: '结束',
          //         type: 'danger',
          //       }
          //     } else {
          //       return {
          //         name: '结束',
          //         type: 'danger',
          //         disabled: true,
          //       }
          //     }
          //   }
          // },
          "任务",
          {
            isSwitch: true, // isSwitch = true 不会取name, type的数据会执行handler函数的返回值的name,type
            // name: ['上架', '下架'],          // 不会在这里取数据
            // type: ['success', 'danger'],    // 不会在这里取数据
            handler: data => {
              if (data.status === "关闭") {
                return {
                  name: "关闭",
                  type: "warning",
                  disabled: true
                };
              } else {
                return {
                  name: "关闭",
                  type: "warning"
                };
              }
            }
          },
          "安全画像"
        ]
      },
      pages: 1,
      lines: 10,
      total: 0,
      // popup
      visible: false,
      params: {}
    };
  },
  methods: {
    projectReport() {
      this.visible = true;
    },

    onSearch(searchParams) {
      this.searchParams = searchParams;
      this.initData();
    },

    add() {
      this.$router.push({
        name: "addProject"
      });
    },

    submit(params) {
      let loading = this.$loading({ background: "rgba(0, 0, 0, 0.5)" });
      let vars = {
        title: params.title,
        status: params.status,
        description: params.description,
        user: this.user.name,
        data: params
      };
      vars.key = "saveProject";
      this.$api.wf(
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
      let vars = params;
      vars.key = "saveProject";
      this.$api.wf(
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
      let vars = {
        ids: ids.join(",")
      };
      vars.key = "delProject";
      this.$api.wf(vars, this, () => {
        this.$message({
          type: "success",
          message: "删除成功"
        });
        this.goback(true);
      });
    },

    onView(params) {
      // console.log(params);
      this.$router.push({
        name: "viewProject",
        query: {
          id: params.row.id
        }
      });
    },

    onEdit(params) {
      // console.log(params);
      let varsPrams = params.row.data;
      varsPrams.id = params.row.id;
      this.$router.push({
        name: "editProject",
        params: {
          params: varsPrams
        }
      });
    },

    onFilterNameActive(params) {
      // console.log(params);
      if (params.$active === "编辑") {
        this.onEdit(params);
      } else if (params.$active === "删除") {
        this.$confirm("确认删除吗?", "温馨提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(() => {
            this.onDelete([params.row]);
          })
          .catch(() => {});
      } else if (params.$active === "启动") {
        let ps = {
          id: params.row.id,
          status: "已启动"
        };
        this.$confirm("确认启动吗?", "温馨提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(() => {
            this.update(ps);
          })
          .catch(() => {});
      } else if (params.$active === "结束") {
        let ps = {
          id: params.row.id,
          status: "结束"
        };
        this.$confirm("确认结束吗?", "温馨提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(() => {
            this.update(ps);
          })
          .catch(() => {});
      } else if (params.$active === "任务") {
        this.$router.push({
          name: "projectTask",
          query: {
            id: params.row.id
          }
        });
      } else if (params.$active === "关闭") {
        let ps = {
          id: params.row.id,
          status: "关闭"
        };
        this.$confirm("确认关闭吗?", "温馨提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(() => {
            this.update(ps);
          })
          .catch(() => {});
      } else if (params.$active === "安全画像") {
        this.$router.push({
          name: "securityPortrait",
          query: {
            id: params.row.id
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
      let vars = {};
      vars.key = "projects";
      this.tableOptions.loading = true;
      if (this.searchParams) {
        for (let key in this.searchParams) {
          if (this.searchParams[key]) {
            vars[key] = this.searchParams[key];
          }
        }
      }
      vars.paging = this.pages + "," + this.lines;
      this.$api.wf(
        vars,
        this,
        data => {
          // console.log(data);
          if (data.data) {
            this.total = data.data.total || 0;
            this.tableData = data.data.data || [];
            this.tableData.forEach(item => {
              let $task = 0;
              if (item.todo_task_count > 0 && item.task_count > 0) {
                $task = parseInt(
                  (item.todo_task_count / item.task_count) * 100
                );
              }
              item.$task = $task + "%";
              item._application_name = item.data.application_name;
              item._application_abbreviation =
                item.data.application_abbreviation;
            });
            this.tableOptions.loading = false;
          }
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
    // if (this.permissions.indexOf('查看') !== -1) {
    //   this.tableOptions.active.push('view')
    // }
    // if (this.permissions.indexOf('编辑') !== -1) {
    //   this.tableOptions.active.push('edit')
    // }
  },
  mounted() {
    this.init();
  }
};
</script>

<style scoped>
</style>
