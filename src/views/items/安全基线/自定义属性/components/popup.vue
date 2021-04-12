<template>
  <el-dialog
    :title="title"
    :append-to-body="true"
    :visible.sync="dialogVisible"
    width="550px"
    :close-on-click-modal="false"
    class="dialog-default"
  >
    <el-form label-width="55px" class="default-search"
             :model="params" :rules="rules" ref="refForm">
      <el-form-item label="名称:" prop="name">
        <el-input type="text" v-model="params.name"
                  placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item label="父级:" prop="parent_id">
        <el-cascader
          :disabled="disabled"
          @change="change"
          v-model="parent_id"
          :options="options"
          :props="{ checkStrictly: true }"
          filterable
          clearable></el-cascader>
      </el-form-item>
      <div class="margin-top-10 text-right">
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
      params: {
        type: Object,
        default() {
          return {
            name: '',
            coding: '',
          }
        }
      },
      disabled: false,
    },
    computed: {},
    data() {
      return {
        dialogVisible: false,
        rules: {
          name: [{required: true, message: '请输入:名称', trigger: 'blur'}],
          coding: [{required: true, message: '请输入:编码', trigger: 'blur'}],
        },
        parent_id: [],
        options: [],
      }
    },
    methods: {

      change(val) {
        if (val && val.length) {
          this.params.parent_id = val[val.length - 1];
        } else {
          this.params.parent_id = 0;
        }
      },

      closeDialog() {
        this.$emit("update:visible", false)
      },

      submit() {
        let params = this.$common.deepClone(this.params);
        this.$refs.refForm.validate((valid) => {
          if (valid) {
            if (params.id) {
              this.$emit('on-update', params);
            } else {
              this.$emit('on-submit', params);
            }
            this.closeDialog();
            this.$refs.refForm.resetFields();
          } else {
            return this.$message.error('操作失败');
          }
        });
      },

      getTree() {
        let vars = {};
        vars.key = 'property_label';
        vars.params = {
          conds: [],
          dims: [],
          order: ['id', 'ASC'],
          hook: {
            is_cull: false,
          }
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data) {
            this.options = this.$common.filterTree(data.data || [])
          }
        });
      },

      init() {
        this.dialogVisible = this.visible;
        this.parent_id = [];
        if (this.params.parent_id) {
          this.parent_id = [this.params.parent_id];
        }
        if (this.dialogVisible) {
          this.getTree();
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
