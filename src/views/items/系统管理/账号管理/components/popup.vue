<template>
  <el-dialog
    :title="title"
    :append-to-body="true"
    :visible.sync="dialogVisible"
    width="550px"
    :close-on-click-modal="false"
    class="dialog-default"
  >
    <el-form label-width="95px" class="default-search"
             :model="params" :rules="rules" ref="refForm">
      <el-form-item label="账号" prop="name">
        <el-input
          autocomplete="off"
          type="text"
          v-model="params.name"
          :disabled="disabled"
          placeholder="账号"
        ></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="real_name">
        <el-input
          autocomplete="off"
          type="text"
          v-model="params.real_name"
          placeholder="姓名"
        ></el-input>
      </el-form-item>
      <el-form-item label="能力等级" prop="level">
        <el-select
          v-model="params.level"
          placeholder="请选择:能力等级"
          style="width: 100%"
          filterable
          autocomplete="off"
        >
          <el-option
            v-for="(item, index) in [1,2,3,4,5,6,7,8,9,10]"
            :label="item"
            :value="item"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select
          v-model="roles"
          placeholder="请选择:角色"
          style="width: 100%"
          multiple
          filterable
          autocomplete="off"
        >
          <el-option
            v-for="item in rolesList"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门" prop="department">
        <el-select
          v-model="params.department_id"
          placeholder="请选择:部门"
          style="width: 100%"
          filterable
          autocomplete="off"
        >
          <el-option
            v-for="item in departmentList"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="密码" prop="password" v-if="!hiddenPWD">
        <el-input
          type="password"
          autocomplete="off"
          v-model="params.password"
          placeholder="密码"
        ></el-input>
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
  import {validateUserName} from '@/utils/validate'

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
      disabled: {
        type: Boolean,
        default: false,
      },
      params: {
        type: Object,
        default() {
          return {}
        }
      },
      hiddenPWD: false,
    },
    computed: {},
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入账号'))
        } else if (!validateUserName(value)) {
          callback(new Error('请输入正确的账号,只能输入4-32位字母，数字，下划线，减号'))
        } else {
          callback()
        }
      };
      const validatePhone = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入手机号'))
        } else {
          callback()
        }
      };
      const validatePass = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入密码'))
        } else if (value.length < 5) {
          callback(new Error('密码不能小于5位'))
        } else {
          callback()
        }
      };
      const validatePWD = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('请输入密码'))
        } else if (value.length < 5) {
          callback(new Error('密码不能小于5位'))
        } else if (value !== this.params.password) {
          callback(new Error('两次密码不一致'))
        } else {
          callback()
        }
      };

      return {
        dialogVisible: false,
        rules: {
          phone: [{required: true, trigger: 'blur', validator: validatePhone}],
          code: [{required: true, message: '请输入验证码', trigger: 'blur'}],
          name: [{required: true, trigger: 'blur', validator: validateUsername}],
          real_name: [{required: true, message: '请输入名称', trigger: 'blur'}],
          password: [{required: true, trigger: 'blur', validator: validatePass}],
          password1: [{required: true, trigger: 'blur', validator: validatePWD}],
          level: [{required: true, message: '请输入能力等级', trigger: 'blur'}],
        },
        roles: [],
        rolesList: [],
        departments: [],
        departmentList: [],
      }
    },
    methods: {

      closeDialog() {
        this.$emit("update:visible", false)
        this.roles = [];
        this.departments = [];
      },

      submit() {
        let params = this.$common.deepClone(this.params);
        this.$refs.refForm.validate((valid) => {
          if (valid) {
            // console.log(params);
            if (this.roles) {
              let roles = [];
              this.roles.forEach(item => {
                roles.push({
                  role_id: item,
                })
              });
              params.roles = roles;
            }
            // if (this.departments) {
            //   let departments = [];
            //   this.departments.forEach(item => {
            //     departments.push({
            //       department_id: item,
            //       status: '正式',
            //     })
            //   });
            //   params.departments = departments;
            // }
            if (params.id) {
              delete params.created_time
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

      getRole() {
        let vars = {};
        vars.key = 'role';
        vars.params = {
          conds: [],
          dims: [],
          order: ['id', 'DESC'],
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data) {
            this.rolesList = data.data || [];
            if (this.params.roles) {
              this.roles = [];
              this.params.roles.forEach(item => {
                this.roles.push(item.id)
              })
            }
          }
        });
      },

      getDepartment() {
        let vars = {};
        vars.key = 'department';
        vars.params = {
          conds: [],
          dims: [],
          order: ['id', 'DESC'],
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data) {
            this.departmentList = data.data || [];
            if (this.params.departments) {
              this.departments = [];
              this.params.departments.forEach(item => {
                this.departments.push(item.id)
              })
            }
          }
        });
      },

      init() {
        // console.log(this.params);
        this.dialogVisible = this.visible;
        if (this.dialogVisible) {
          this.getRole();
          this.getDepartment();
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
