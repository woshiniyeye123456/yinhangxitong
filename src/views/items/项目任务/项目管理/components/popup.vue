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
      <el-form-item label="项目名称:" prop="title">
        <el-input type="text" v-model="params.title"
                  placeholder="项目名称"></el-input>
      </el-form-item>
      <el-form-item label="项目描述:" prop="description">
        <el-input type="text" v-model="params.description"
                  placeholder="项目描述"></el-input>
      </el-form-item>
      <el-form-item label="技术平台:">
        <el-select
          v-model="params.technology_platform"
          placeholder="请选择:技术平台"
          style="width: 100%"
          filterable
          autocomplete="off"
        >
          <el-option
            v-for="(item, index) in technologyPlatform"
            :label="item"
            :value="item"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属组织:">
        <el-select
          v-model="params.organization_id"
          placeholder="请选择:所属组织"
          style="width: 100%"
          filterable
          autocomplete="off"
        >
          <el-option
            v-for="(item, index) in organizationList"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="授权组:">
        <el-select
          v-model="params.authorization_group_id"
          placeholder="请选择:授权组"
          style="width: 100%"
          filterable
          autocomplete="off"
        >
          <el-option
            v-for="(item, index) in authorizationGroupList"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          ></el-option>
        </el-select>
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
  import mixins from '../mixins'

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
      params: {
        type: Object,
        default() {
          return {
            name: '',
            coding: '',
          }
        }
      }
    },
    computed: {},
    data() {
      return {
        dialogVisible: false,
        rules: {
          name: [{required: true, message: '请输入:名称', trigger: 'blur'}],
          coding: [{required: true, message: '请输入:编码', trigger: 'blur'}],
        },
        organizationList: [],
        authorizationGroupList: [],
      }
    },
    methods: {

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

      getOrganization() {
        let vars = {};
        vars.key = 'organization';
        vars.params = {
          conds: [],
          dims: [],
          order: ['id', 'DESC'],
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data) {
            this.organizationList = data.data || [];
          }
        });
      },

      getAuthorizationGroup() {
        let vars = {};
        vars.key = 'authorization_group';
        vars.params = {
          conds: [],
          dims: [],
          order: ['id', 'DESC'],
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data) {
            this.authorizationGroupList = data.data || [];
          }
        });
      },

      init() {
        this.dialogVisible = this.visible;
        if (this.dialogVisible) {
          this.getOrganization();
          this.getAuthorizationGroup();
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
