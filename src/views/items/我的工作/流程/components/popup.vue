<template>
  <el-dialog
    :title="title"
    :append-to-body="true"
    :visible.sync="dialogVisible"
    width="550px"
    :close-on-click-modal="false"
    class="dialog-default"
  >
    <el-form label-width="86px" class="default-search"
             :model="searchParams" :rules="rules" ref="refForm">
      <el-form-item label="软件平台:">
        <el-select
          v-model="searchParams.software_platform_id"
          placeholder="请选择:软件平台"
          style="width: 100%"
          filterable
          autocomplete="off"
        >
          <el-option
            v-for="item in softwarePlatList"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="安全类型:">
        <el-input
          v-model="searchParams.security_scene"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="风险等级:">
        <el-checkbox-group v-model="searchParams.risk_level">
          <el-checkbox v-for="(item, index) in riskLevel" :label="item" :key="index">{{ item }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="执行方式:">
        <el-checkbox-group v-model="searchParams.automation">
          <el-checkbox v-for="(item, index) in runMode" :label="item" :key="index">{{ item }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
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
          @click="onSearch"
          size="small"
        >
          确认
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
  import mixins from './mixins'

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
    mixins: [
      mixins
    ],
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
    computed: {},
    data() {
      return {
        dialogVisible: false,
        rules: {
          name: [{required: true, message: '请输入:名称', trigger: 'blur'}],
          coding: [{required: true, message: '请输入:编码', trigger: 'blur'}],
        },
        searchParams: {
          risk_level: [],
          automation: [],
        },
        props: {multiple: true},
        options: [],
        attr_list: [],
        attr_id: [],
        softwarePlatList: [],
      }
    },
    methods: {

      change() {
        let nodes = this.$refs.cas.getCheckedNodes();
        this.attr_list = [];
        nodes.forEach(item => {
          if (item.isLeaf) {
            this.attr_list.push(item.data.id);
          }
        });
      },

      closeDialog() {
        this.$emit("update:visible", false)
      },

      onSearch() {
        if (this.attr_list.length) {
          this.searchParams.property_label_id = [];
          this.attr_list.forEach(item => {
            this.searchParams.property_label_id.push(item)
          })
        }
        this.$emit('on-search', this.searchParams);
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

      getSoftwarePlatform() {
        let vars = {};
        vars.key = 'software_platform';
        vars.params = {
          conds: [],
          dims: [],
          order: ['id', 'DESC'],
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data) {
            this.softwarePlatList = data.data || [];
          }
        });
      },

      init() {
        this.dialogVisible = this.visible;
        if (this.dialogVisible) {
          this.getSoftwarePlatform();
          this.getTree();
          this.attr_id = [];
          this.attr_list = [];
          this.searchParams = {
            risk_level: [],
            automation: [],
          };
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
