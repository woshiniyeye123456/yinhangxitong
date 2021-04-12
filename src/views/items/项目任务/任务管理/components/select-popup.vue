<template>
  <el-dialog
    :title="title"
    :append-to-body="true"
    :visible.sync="dialogVisible"
    width="55%"
    :close-on-click-modal="false"
    class="dialog-default"
  >
    <el-form label-width="95px" class="default-search" :rules="rules" ref="refForm">
      <el-form-item label="人员" prop="accountNames">
        <el-select
          v-model="accountNames"
          placeholder="请选择:人员"
          style="width: 100%"
          filterable
          autocomplete="off"
          multiple
          @change="changeTeamMember"
        >
          <el-option
            v-for="item in accountList"
            :label="item.real_name + ' ( ' + item.department + ' - ' + item._role + ' ) '"
            :value="item.user"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <div class="margin-top-20 text-right">
        <el-button
          type="default"
          @click="closeDialog"
          size="small"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submit"
          size="small"
        >
          确认
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>

  export default {
    name: "popup",
    inject: {
      user: {
        from: 'user',
        default: () => {
          return {}
        }
      }
    },
    components: {},
    props: {
      title: {
        type: String,
        default: '',
      },
      visible: {
        type: Boolean,
        default: false,
      },
      value: {
        type: Array,
        default() {
          return []
        }
      },
    },
    computed: {},
    data() {
      return {
        dialogVisible: false,
        rules: {
          real_name: [{required: true, message: '请输入名称', trigger: 'blur'}],
        },
        accountNames: [],
        accountList: [],
        updateValue: [],
      }
    },
    methods: {

      changeTeamMember(names) {
        this.updateValue = [];
        if (names.length) {
          names.forEach(name => {
            let team = this.accountList.find(it => it.user === name);
            if (team) {
              this.updateValue.push(team);
            }
          });
        }
      },

      closeDialog() {
        this.$emit("update:visible", false);
        this.accountNames = [];
        this.updateValue = [];
        this.$refs.refForm.resetFields();
      },

      submit() {
        this.$emit('on-submit', this.updateValue);
        this.closeDialog();
      },

      getAccount() {
        let vars = {};
        vars.key = 'account';
        vars.params = {
          conds: [],
          dims: [],
          order: ['id', 'DESC'],
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data.data) {
            this.accountList = data.data || [];
            this.accountList.forEach(item => {
              item.user = item.name;
              item.name = item.real_name;
              let role = [];
              if (item.roles) {
                item.roles.forEach(item => {
                  role.push(item.name)
                })
              }
              item._role = role.join(',');
              if (item.departments) {
                let department = item.departments.find(d => d.id === item.department_id);
                if (department) {
                  item.department = department.name
                } else {
                  item.department = '';
                }
              }
            });
            this.changeTeamMember(this.accountNames);
          }
        });
      },

      init() {
        // console.log(this.params);
        this.dialogVisible = this.visible;
        if (this.dialogVisible) {
          this.getAccount();
          this.accountNames = this.value;
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
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
