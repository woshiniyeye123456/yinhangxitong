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
             :rules="rules" ref="refForm">
      <el-form-item label="部门" prop="department">
        <el-cascader
          v-model="department_ids"
          :options="departmentList"
          :props="props"
          clearable
          filterable
          autocomplete="off"
        >
        </el-cascader>
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
    name: "department-popup",
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
    },
    computed: {
      pickerOptions() {
        return {
          disabledDate(time) {
            return time.getTime() < Date.now();
          },
        }
      },
    },
    data() {
      return {
        props: {
          checkStrictly: true,
          multiple: true,
          emitPath: false
        },
        dialogVisible: false,
        rules: {
          // code: [{required: true, message: '请输入验证码', trigger: 'blur'}],
        },
        department_ids: [],
        departmentList: [],
      }
    },
    methods: {

      closeDialog() {
        this.$emit("update:visible", false);
        this.department_ids = [];
      },

      submit() {
        this.$emit('on-submit', this.department_ids);
        this.$refs.refForm.resetFields();
        this.closeDialog();
      },

      getDepartment() {
        let vars = {};
        vars.key = 'department';
        vars.params = {
          conds: [
            'deleted = false'
          ],
          dims: [],
          order: ['id', 'ASC'],
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data) {
            this.departmentList = this.$common.filterTree(data.data || [])
          }
        });
      },

      init() {
        // console.log(this.params);
        this.dialogVisible = this.visible;
        if (this.dialogVisible) {
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
