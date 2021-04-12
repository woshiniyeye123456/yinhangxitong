<template>
  <div class="default-box">
    <!-- search-form -->
    <search-form @on-search="onSearch"></search-form>
    <!-- act-top -->
    <act-top v-if="permissions.indexOf('新建') !== -1" @add="add"></act-top>
    <edit-table
      class="margin-top-8"
      :tableColumn="tableColumn"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :pages="pages"
      :lines="lines"
      :total="total"
      @on-view="onView"
      @on-edit="onEdit"
      @on-filter-name-active="onFilterNameActive"
      @on-delete="onDelete"
      @change-page="changePage"
      @change-size="changeSize"
    ></edit-table>
    <!-- popup -->
    <personnel-popup
      :visible.sync="showPersonnelDialog"
      :teamMembers="teamMembers"
      @changeMembers="changeMembers"
    ></personnel-popup>
  </div>
</template>

<script>
  import searchForm from "./components/search-form";
  import actTop from "./components/act-top";
  import personnelPopup from "./components/personnel-popup";
  import editTable from "../../components/edit-table";
  import mixins from "./mixins";

  export default {
    name: "任务管理",
    inject: {
      user: {
        from: "user",
        default: () => {
          return {};
        },
      },
    },
    components: {
      searchForm,
      actTop,
      editTable,
      personnelPopup,
    },
    mixins: [mixins],
    computed: {
      permissions() {
        return this.$route.meta.permissions || [];
      },
    },
    data() {
      return {
        // table
        tableColumn: [
          {
            prop: "requirement",
            label: "任务编号",
            align: "center",
            minWidth: "12",
          },
          {
            prop: "task_name",
            label: "任务名称",
            align: "center",
            minWidth: "12",
          },
          // {
          //   prop: 'subRequirement',
          //   label: '子需求编号',
          //   align: 'center',
          //   minWidth: '12',
          // },
          // {
          //   prop: 'subordinate',
          //   label: '从属关系',
          //   align: 'center',
          //   minWidth: '12',
          // },
          {
            prop: "status",
            label: "任务状态",
            align: "center",
            minWidth: "8",
            filters: [
              {value: "已受理", circleColor: "#00C5D4"},
              {value: "待受理", circleColor: "#FFE027"},
              {value: "任务退回", circleColor: "#FB731B"},
            ],
            isStatus: true,
          },
          {
            prop: "project_name",
            label: "所属项目",
            align: "center",
            minWidth: "12",
          },
          {
            prop: "pm",
            label: "项目经理",
            align: "center",
            minWidth: "12",
          },
          {
            prop: "taskOwner",
            label: "责任人",
            align: "center",
            minWidth: "12",
          },
          {
            prop: "names",
            label: "当前操作人",
            align: "center",
            minWidth: "12",
          },
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
            "view",
            // 'edit',
            // 'delete',
          ],
          filterNameActive: [],
        },
        pages: 1,
        lines: 10,
        total: 0,
        showPersonnelDialog: false,
        teamMembers: [],
        instance_id: 0,
      };
    },
    methods: {
      changeMembers(val) {
        let vars = {
          key: "updateTeamMembers",
          instance_id: this.instance_id,
          team_members: val,
        };
        this.$api.ext(vars, this, () => {
          this.goback();
        });
      },

      onSearch(searchParams) {
        this.searchParams = searchParams;
        this.initData();
      },

      add() {
        this.$router.push({
          name: "addTask",
        });
      },

      submit(params) {
        let loading = this.$loading({background: "rgba(0, 0, 0, 0.5)"});
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
              message: "操作成功",
            });
            this.goback();
          },
          () => {
            loading.close();
          }
        );
      },

      update(params) {
        let loading = this.$loading({background: "rgba(0, 0, 0, 0.5)"});
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
              message: "操作成功",
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
        params.forEach((item) => {
          ids.push(item.id);
        });
        let vars = {};
        vars.key = "baseline_library";
        vars.params = {
          ids: ids.join(","),
        };
        this.$api.del(vars, this, () => {
          this.$message({
            type: "success",
            message: "删除成功",
          });
          this.goback(true);
        });
      },

      onView(params) {
        // console.log(params);
        this.$router.push({
          name: "viewTask",
          params: {
            params: params.row,
          },
        });
      },

      onEdit(params) {
        // console.log(params);
        this.$router.push({
          name: "editTask",
          params: {
            params: params.row,
          },
        });
      },

      onFilterNameActive(params) {
        // console.log(params)
        if (params.$active === "版本") {
          this.$router.push({
            name: "baselineLibraryVersion",
            query: {
              group_id: params.row.group_id,
            },
          });
        } else if (params.$active === "编辑") {
          this.onEdit(params);
        } else if (params.$active === "查看") {
          this.onView(params);
        } else if (params.$active === "流程") {
          this.$router.push({
            name: "taskWorkflow",
            query: {
              id: params.row.instance_id,
            },
          });
        } else if (params.$active === "恢复") {
          this.$confirm("确认恢复吗?", "温馨提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
          })
            .then(() => {
              let vars = {
                workflow_id: params.row.instance_id,
                key: "resume",
              };
              this.$api.wf(vars, this, (data) => {
                this.getListData();
              });
            })
            .catch(() => {
            });
        } else if (params.$active === "关闭") {
          this.$confirm("确认关闭吗?", "温馨提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
          })
            .then(() => {
              let vars = {
                workflow_id: params.row.instance_id,
                key: "close",
              };
              this.$api.wf(vars, this, (data) => {
                this.getListData();
              });
            })
            .catch(() => {
            });
        } else if (params.$active === "人员") {
          let teamMembers = params.row.teamMembers;
          let obj = {};
          this.teamMembers = teamMembers.reduce((cur, next) => {
            if (!obj[next.user]) {
              next.roles = [
                {
                  name: next.role,
                },
              ];
              obj[next.user] = next;
              cur.push(next);
            } else {
              if (next.role) {
                obj[next.user].roles.push({
                  name: next.role,
                });
              }
            }
            return cur;
          }, []);
          this.instance_id = params.row.instance_id;
          this.showPersonnelDialog = true;
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
          name: this.user.name,
          lines: this.lines,
          pages: this.pages,
        };
        this.tableOptions.loading = true;
        if (this.searchParams) {
          for (let key in this.searchParams) {
            if (this.searchParams[key]) {
              vars[key] = this.searchParams[key];
            }
          }
        }
        this.$api.ext(
          vars,
          this,
          (data) => {
            // console.log(data);
            if (data) {
              this.total = data.data.total;
              this.tableData = data.data.data || [];
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
      },
    },
    created() {
      if (this.permissions.indexOf("关闭/恢复") !== -1) {
        this.tableOptions.filterNameActive.push({
          isSwitch: true, // isSwitch = true 不会取name, type的数据会执行handler函数的返回值的name,type
          // name: ['上架', '下架'],          // 不会在这里取数据
          // type: ['success', 'danger'],    // 不会在这里取数据
          handler: (data) => {
            if (data.status === "进行中") {
              return {
                name: "关闭",
                type: "danger",
              };
            } else if (data.status === "已关闭") {
              return {
                name: "恢复",
                type: "primary",
              };
            } else {
              return {
                name: "恢复",
                type: "primary",
                disabled: true,
              };
            }
          },
        });
      }
      // if (this.permissions.indexOf('人员') !== -1) {
      //   this.tableOptions.filterNameActive.push('人员')
      // }
    },
    mounted() {
      this.init();
    },
  };
</script>

<style scoped></style>
