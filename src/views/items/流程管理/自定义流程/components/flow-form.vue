<template>
  <el-form label-width="95px"
           :model="params" :rules="rules" ref="refForm">
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="节点名称:">
          <el-input
            readonly
            v-model="params.title"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="执行者:">
          <el-input
            readonly
            v-model="params.actor_desc"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
  import mixins from '../mixins'

  export default {
    name: "flow-form",
    inject: {
      user: {
        from: 'user',
        default: () => {
          return {}
        }
      }
    },
    components: {},
    mixins: [
      mixins,
    ],
    props: {
      params: {
        type: Object,
        default() {
          return {}
        }
      },
      disabled: {
        type: Boolean,
        default: false,
      }
    },
    computed: {},
    data() {
      return {
        rules: {
          name1: [{required: true, message: '请输入:名称', trigger: 'blur'}],
          coding: [{required: true, message: '请输入:编码', trigger: 'blur'}],
          version: [{required: true, message: '请输入:版本号', trigger: 'blur'}],
        },
        roles: [],
        externals: [],
      }
    },
    methods: {

      changeExternal() {
        this.$emit('change-external', this.params.external_system_id);
        this.$forceUpdate();
      },

      changeRole() {
        this.$emit('change-role', this.params.role_id);
        this.$forceUpdate();
      },

      goBack() {
        this.$router.go(-1)
      },

      goback() {
        this.$emit('go-back')
      },

      submit() {
        let params = this.$common.deepClone(this.params);
        this.$refs.refForm.validate((valid) => {
          if (valid) {
            this.$emit('on-submit', params);
          } else {
            return this.$message.error('操作失败');
          }
        });
      },

      getRoles() {
        let vars = {};
        vars.key = 'role';
        vars.params = {
          conds: [],
          dims: [],
          order: ['id', 'DESC'],
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data.data) {
            this.roles = data.data || [];
          }
        });
      },

      getExternals() {
        let vars = {};
        vars.key = 'external_system';
        vars.params = {
          conds: [],
          dims: [],
          order: ['id', 'DESC'],
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data.data) {
            this.externals = data.data || [];
          }
        });
      },

      init() {
        this.getRoles();
        // this.getExternals();
        // console.log(this.params);
      },

      clearDataFn() { // 清除选择框内容
        this.$refs.refForm.resetFields();
      },
    },
    mounted() {
      this.init();
    },
    watch: {
      clearData: {
        handler(val) {
          // console.log(val)
          if (val) {
            this.clearDataFn();
            this.$emit('clear-finish');
          }
        },
        deep: true
      },
    }
  }
</script>

<style scoped>

</style>
