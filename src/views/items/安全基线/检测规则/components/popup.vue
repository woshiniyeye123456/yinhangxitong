<template>
  <el-dialog
    :title="title"
    :append-to-body="true"
    :visible.sync="dialogVisible"
    width="550px"
    :close-on-click-modal="false"
    class="dialog-default"
  >
    <el-form label-width="105px" class="default-search"
             :model="params" :rules="rules" ref="refForm">
      <el-form-item label="规则名称" prop="name">
        <el-input type="text" v-model="params.name"
                  :disabled="disabled"
                  placeholder="规则名称"></el-input>
      </el-form-item>
      <el-form-item label="检测系统">
        <el-select
          v-model="params.external_system_id"
          placeholder="请选择:检测系统"
          style="width: 100%"
          filterable
          autocomplete="off"
        >
          <el-option
            v-for="item in externalSystemList"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="规则类型">
        <el-select
          v-model="params.type"
          placeholder="请选择:规则类型"
          style="width: 100%"
          filterable
          autocomplete="off"
        >
          <el-option
            v-for="item in externalType"
            :label="item"
            :value="item"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="命中规则描述:">
        <el-input
          v-model="params.description"
          :autosize="{ minRows: 6, maxRows: 6 }"
          type="textarea"
          :disabled="disabled"
          resize="none"
          placeholder="命中规则描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="提取规则描述:">
        <el-input
          v-model="params.t_description"
          :autosize="{ minRows: 6, maxRows: 6 }"
          type="textarea"
          :disabled="disabled"
          resize="none"
          placeholder="提取规则描述"
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
      }
    },
    computed: {},
    data() {
      return {
        dialogVisible: false,
        rules: {
          code: [{required: true, message: '请输入验证码', trigger: 'blur'}],
          name: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          real_name: [{required: true, message: '请输入名称', trigger: 'blur'}],
        },
        externalSystemList: [],
        externalType: [
          'JSON',
          'HTML',
          'XML',
          '正则表达式',
        ],
      }
    },
    methods: {

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

      getExternalSystem() {
        let vars = {};
        vars.key = 'external_system';
        vars.params = {
          conds: [],
          dims: [],
          order: ['id', 'DESC'],
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data) {
            this.externalSystemList = data.data || [];
          }
        });
      },

      init() {
        // console.log(this.params);
        this.dialogVisible = this.visible;
        if (this.dialogVisible) {
          this.getExternalSystem();
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
