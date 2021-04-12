<template>
  <el-dialog
    title="人员"
    :append-to-body="true"
    :visible.sync="dialogVisible"
    width="65%"
    :close-on-click-modal="false"
    class="dialog-default"
  >
    <div class="default-tool">
      <el-button type="primary" size="small" @click="add" icon="el-icon-circle-plus-outline">
        添加成员
      </el-button>
    </div>
    <edit-table
      :tableColumn="tableColumn"
      :tableData="tableData"
      :tableOptions="tableOptions"
      @on-filter-name-active="onFilterNameActive"
    ></edit-table>
    <div class="margin-top-20 text-right">
      <el-button
        type="primary"
        @click="updateTeamMembers"
        size="small"
      >
        确认操作
      </el-button>
    </div>
    <!-- popup -->
    <select-popup
      title="人员"
      :value="selectValue"
      :visible.sync="selectVisible"
      @on-submit="selectSubmit"
    ></select-popup>
  </el-dialog>
</template>

<script>
  import editTable from '../../../components/edit-table'
  import selectPopup from './select-popup'

  export default {
    name: "personnel-popup",
    inject: {
      user: {
        from: 'user',
        default: () => {
          return {}
        }
      }
    },
    components: {
      editTable,
      selectPopup,
    },
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      teamMembers: {
        type: Array,
        default() {
          return []
        }
      }
    },
    computed: {},
    data() {
      return {
        dialogVisible: false,
        // table
        tableColumn: [
          {
            prop: 'user',
            label: '账号',
            align: 'center',
            minWidth: '12',
          },
          {
            prop: 'name',
            label: '姓名',
            align: 'center',
            minWidth: '12',
          },
          {
            prop: '_role',
            label: '角色',
            align: 'center',
            minWidth: '12',
          },
          {
            prop: 'department',
            label: '部门',
            align: 'center',
            minWidth: '12',
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
            // 'edit',
            // 'delete',
          ],
          filterNameActive: [
            {
              isSwitch: true,                 // isSwitch = true 不会取name, type的数据会执行handler函数的返回值的name,type
              // name: ['上架', '下架'],          // 不会在这里取数据
              // type: ['success', 'danger'],    // 不会在这里取数据
              handler: () => {
                return {
                  name: '替换成员',
                  type: 'primary',
                }
              }
            },
            {
              isSwitch: true,                 // isSwitch = true 不会取name, type的数据会执行handler函数的返回值的name,type
              // name: ['上架', '下架'],          // 不会在这里取数据
              // type: ['success', 'danger'],    // 不会在这里取数据
              handler: () => {
                return {
                  name: '删除成员',
                  type: 'danger',
                }
              }
            },
          ],
        },
        selectValue: [],
        selectVisible: false,
        isAdd: false,
      }
    },
    methods: {

      updateTeamMembers() {
        let teamMembers = [];
        if (this.tableData && this.tableData.length) {
          this.tableData.forEach(item => {
            if (item.roles && item.roles.length) {
              item.roles.forEach(rl => {
                teamMembers.push({
                  name: item.name,
                  user: item.user,
                  role: rl.name,
                  department: item.department,
                })
              })
            }
          })
        }
        let roles = [
          "安全专员",
          "测试人员",
          "开发人员",
          "需求分析师"
        ];
        teamMembers.forEach(item => {
          roles = roles.filter(ro => {
            return ro !== item.role
          });
        });
        if (roles.length) {
          return this.$message.error(`缺少流程需要的角色人员[${ roles.join(',') }]`);
        }
        this.$emit('changeMembers', teamMembers);
        this.closeDialog();
      },

      selectSubmit(teamMembers) {
        let tables = this.tableData.filter(it => this.selectValue.indexOf(it.user) === -1).concat(teamMembers);
        let obj = {};
        this.tableData = tables.reduce((cur, next) => {
          if (!obj[next.user]) {
            obj[next.user] = next;
            cur.push(next)
          }
          return cur;
        }, []);
      },

      add() {
        this.selectValue = [];
        this.selectVisible = true;
      },

      onFilterNameActive(params) {
        // console.log(params)
        if (params.$active === '替换成员') {
          this.selectValue = [params.row.user];
          this.selectVisible = true;
        } else if (params.$active === '删除成员') {
          this.$confirm('确认删除吗?', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
            this.tableData.splice(params.$index, 1);
          }).catch(() => {

          });
        }
      },

      closeDialog() {
        this.$emit("update:visible", false);
      },

      submit() {
        let params = this.$common.deepClone(this.params);
        this.$refs.refForm.validate((valid) => {
          if (valid) {
            // console.log(params);
            if (params.id) {
              this.$emit('on-update', params);
            } else {
              this.$emit('on-submit', params);
            }
            this.$refs.refForm.resetFields();
            this.closeDialog();
          } else {
            return this.$message.error('操作失败');
          }
        });
      },

      init() {
        // console.log(this.params);
        this.dialogVisible = this.visible;
        if (this.dialogVisible) {
          this.tableData = this.$common.deepClone(this.teamMembers);
          this.tableData.forEach(item => {
            let _role = [];
            item.roles.forEach(ro => {
              _role.push(ro.name);
            });
            item._role = _role.join(';')
          });
          this.tableData = this.tableData.filter(item => {
            return (item._role && item.department)
          });
        }
      },

    },
    mounted() {
      this.init();
    },
    watch: {
      visible: {
        handler() {
          this.init();
        },
      },
      dialogVisible: {
        handler(val) {
          this.$emit('update:visible', val)
        },
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>
