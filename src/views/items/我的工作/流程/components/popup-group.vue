<template>
  <el-dialog :title="title" :append-to-body="true" :visible.sync="dialogVisible" v-if="dialogVisible" width="550px"
    :close-on-click-modal="false" @close="closeDialog" class="dialog-default">
    <el-form label-width="95px" class="default-search" :model="params" :rules="rules" ref="refForm">
      <el-form-item label="参考标准:">
        <el-select v-model="params.referenceStandards" :disabled="referenceStandardsFlag" @change="referenceStandardsFn"
          placeholder="请选择:参考标准" style="width: 100%" filterable autocomplete="off">
          <el-option v-for="item in standardsList" :label="item.name" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="参考视图:">
        <el-select v-model="params.referenceViews" :disabled="referenceViewsFlag" @change="referenceViewsFn"
          placeholder="请选择:参考视图" style="width: 100%" filterable autocomplete="off">
          <el-option v-for="item in viewsList" :label="item.name" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <div class="margin-top-20 text-right">
        <el-button type="default" @click="closeDialog" size="small">
          取消
        </el-button>
        <el-button type="primary" @click="submit" size="small">
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
      from: "user",
      default: () => {
        return {};
      }
    }
  },
  components: {},
  props: {
    title: {
      type: String,
      default: ""
    },
    visible: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default() {
        return {};
      }
    },
    standardsList: {
      type: Array,
      default() {
        return [];
      }
    },
    viewsList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {},
  data() {
    return {
      dialogVisible: false,
      referenceStandardsFlag: false,
      referenceViewsFlag: false,
      rules: {
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }]
      },
      params: {
        referenceStandards: [],
        referenceViews: []
      }
    };
  },
  methods: {
    closeDialog() {
      this.$emit("update:visible", false);
    },
    referenceStandardsFn() {
      console.log(this.params.referenceStandards);
      this.referenceViewsFlag = true;
    },
    referenceViewsFn() {
      console.log(this.params.referenceViews);
      this.referenceStandardsFlag = true;
    },
    submit() {
      let params = this.$common.deepClone(this.params);
      this.$refs.refForm.validate(valid => {
        if (valid) {
          // console.log(params);
          this.$emit("on-submit", params);
          this.$refs.refForm.resetFields();
          this.closeDialog();
        } else {
          return this.$message.error("操作失败");
        }
      });
    },

    init() {
      // console.log(this.params);
      this.dialogVisible = this.visible;
      if (this.dialogVisible) {
        this.params.referenceStandards = undefined;
        this.params.referenceViews = undefined;
        // this.params.referenceStandards =
        //   this.value.referenceStandards === undefined
        //     ? []
        //     : this.value.referenceStandards;
        // this.params.referenceViews =
        //   this.value.referenceViews === undefined
        //     ? []
        //     : this.value.referenceViews;
      }
    }
  },
  mounted() {
    this.init();
  },
  watch: {
    visible: {
      handler() {
        this.init();
      }
    },
    dialogVisible: {
      handler(val) {
        this.$emit("update:visible", val);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
