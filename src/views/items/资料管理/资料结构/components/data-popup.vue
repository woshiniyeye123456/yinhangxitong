<template>
  <el-dialog
    :title="title"
    :append-to-body="true"
    :visible.sync="dialogVisible"
    width="65%"
    :close-on-click-modal="false"
    class="dialog-default"
  >
    <el-form label-width="55px" class="default-search"
             :model="params" :rules="rules" ref="refForm">
      <el-form-item label="标题:" prop="title">
        <el-input
          type="text"
          v-model="params.title"
          placeholder="标题"
        ></el-input>
      </el-form-item>
      <el-form-item label="父级:" prop="parent_id">
        <el-cascader
          @change="change"
          v-model="parent_id"
          :options="options"
          :props="{ checkStrictly: true }"
          filterable
          clearable></el-cascader>
      </el-form-item>
      <el-form-item label="内容:">
        <markdown
          :height="600"
          v-model="params.content"
        ></markdown>
      </el-form-item>
      <el-form-item label="附件:">
        <text-upload
          :modal="false"
          :defaultFileList="defaultFileList"
          @update:successFileList="val => fileList = val"
          :maxImg="20"
        ></text-upload>
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
  import textUpload from '../../../components/text-upload'
  import Markdown from '../../../components/markDown/simple'

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
    components: {
      textUpload,
      Markdown,
    },
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
        // 附件
        defaultFileList: [],
        fileList: [],
      }
    },
    methods: {

      change(val) {
        if (val) {
          this.params.labels = [
            {
              data_label_id: val[val.length - 1]
            }
          ];
        }
      },

      closeDialog() {
        this.defaultFileList = [];
        this.fileList = [];
        this.parent_id = [];
        this.$emit("update:visible", false)
      },

      submit() {
        let params = this.$common.deepClone(this.params);
        this.$refs.refForm.validate((valid) => {
          if (valid) {
            if (this.fileList && this.fileList.length) {
              params.path = JSON.stringify(this.fileList);
            } else {
              params.path = ''
            }
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
        vars.key = 'data_label';
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
            this.options = this.$common.filterTree(data.data || []);
            if (this.params.labels) {
              this.parent_id = [];
              let labels = this.params.labels[0].path.split('.');
              labels.map(la => {
                if (la && la >= 0) {
                  this.parent_id.push(+la)
                }
              });
            }
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
          if (this.params.path) {
            this.defaultFileList = JSON.parse(this.params.path);
            this.fileList = JSON.parse(this.params.path);
          }
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
