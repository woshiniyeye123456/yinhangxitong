<template>
  <el-dialog
    :append-to-body="true"
    :visible.sync="dialogVisible"
    width="550px"
    :close-on-click-modal="false"
    class="dialog-default"
  >
    <el-form label-width="95px" class="default-search"
             :model="params" :rules="rules" ref="refForm">
      <el-form-item label="属性标签:">
        <el-cascader
          ref="cas"
          @change="change"
          v-model="attr_id"
          :options="options"
          :props="props"
          filterable
          autocomplete="off"
          clearable>
        </el-cascader>
      </el-form-item>
      <div class="margin-top-10 text-right">
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
    name: "attribute-popup",
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
      visible: {
        type: Boolean,
        default: false,
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
        params: {},
        props: {multiple: true},
        options: [],
        attr_list: [],
        attr_id: [],
      }
    },
    methods: {

      change() {
        let nodes = this.$refs.cas.getCheckedNodes();
        this.attr_list = [];
        nodes.forEach(item => {
          if (item.isLeaf) {
            this.attr_list.push(item);
          }
        });
      },

      closeDialog() {
        this.$emit("update:visible", false)
      },

      submit() {
        this.$emit('on-submit', this.attr_list);
        this.closeDialog();
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
        if (this.dialogVisible) {
          this.getTree();
          this.attr_id = [];
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
