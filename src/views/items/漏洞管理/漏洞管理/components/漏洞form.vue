<template>
  <el-form label-width="110px"
           :model="params" :rules="rules" ref="refForm">
    <el-card shadow="never" class="default-card">
      <div slot="header" class="clearfix">
        <span class="slot-title">基本信息</span>
      </div>
      <el-form-item label="漏洞编号:" prop="number">
        <el-input
          type="text"
          v-model="params.number"
          :disabled="disabled"
          placeholder="漏洞编号"
        ></el-input>
      </el-form-item>
      <el-form-item label="漏洞名称:" prop="name">
        <el-input
          type="text"
          v-model="params.name"
          :disabled="disabled"
          placeholder="漏洞名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="危害等级:" prop="harm_level">
        <el-select
          v-model="params.harm_level"
          placeholder="请选择:危害等级"
          style="width: 100%"
          :disabled="disabled"
          filterable
        >
          <el-option
            v-for="(item, index) in riskLevel"
            :label="item"
            :value="item"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联安全基线:" prop="baseline_id">
        <el-select
          v-model="params.baseline_id"
          placeholder="请选择:关联安全基线"
          style="width: 100%"
          :disabled="disabled"
          filterable
        >
          <el-option
            v-for="item in baselineList"
            :label="item.name + ` (${ item.source === 2 ? '自定义' : '标准库' })`"
            :value="item.id"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="风险描述:">
        <markdown
          :height="300"
          :disabled="disabled"
          v-model="params.risk_description"
        ></markdown>
      </el-form-item>
      <el-form-item label="发现过程描述:">
        <markdown
          :height="300"
          :disabled="disabled"
          v-model="params.discovery_process_des"
        ></markdown>
      </el-form-item>
      <el-form-item label="操作方法说明:">
        <markdown
          :height="300"
          :disabled="disabled"
          v-model="params.operation_method_description"
        ></markdown>
      </el-form-item>
      <el-form-item label="使用工具说明:">
        <markdown
          :height="300"
          :disabled="disabled"
          v-model="params.instructions_for_using_tools"
        ></markdown>
      </el-form-item>
      <el-form-item label="解决方案:">
        <markdown
          :height="300"
          :disabled="disabled"
          v-model="params.solution"
        ></markdown>
      </el-form-item>
    </el-card>
    <div class="margin-top-10 text-right">
      <el-button

        type="default"
        @click="goBack"
        size="small"
      >
        返回
      </el-button>
      <el-button

        type="primary"
        @click="submit"
        size="small"
        v-show="!disabled"
      >
        确认
      </el-button>
    </div>
  </el-form>
</template>

<script>
  import mixins from '../mixins'
  import textUpload from '../../../components/text-upload'
  import Tinymce from '@/components/Tinymce'
  import Markdown from '../../../components/markDown/simple'

  export default {
    name: "漏洞form",
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
      Tinymce,
      Markdown,
    },
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
          number: [{required: true, message: '请输入:漏洞编号', trigger: 'blur'}],
          name: [{required: true, message: '请输入:漏洞名称', trigger: 'blur'}],
          harm_level: [{required: true, message: '请输入:危害等级', trigger: 'blur'}],
          baseline_id: [{required: true, message: '请输入:关联安全基线', trigger: 'blur'}],
        },
        labels: [],
        loopholeList: [],
        props: {multiple: false},
        options: [],
        loophole_id: [],
        baselineList: [],
      }
    },
    methods: {

      change(val) {
        if (val && val.length) {
          this.params.loophole_id = val[val.length - 1];
        }
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
            if (this.labels && this.labels.length) {
              params.labels = [];
              this.labels.forEach(item => {
                params.labels.push({
                  loophole_label_id: item
                })
              });
            }
            if (params.id) {
              this.$emit('on-update', params);
            } else {
              this.$emit('on-submit', params);
            }
            this.$refs.refForm.resetFields();
          } else {
            return this.$message.error('操作失败');
          }
        });
      },

      // getLoophole() {
      //   let vars = {};
      //   vars.key = 'loophole_label';
      //   vars.params = {
      //     conds: [],
      //     dims: [],
      //     order: ['id', 'DESC'],
      //   };
      //   this.$api.get(vars, this, data => {
      //     // console.log(data);
      //     if (data) {
      //       this.loopholeList = data.data || [];
      //       if (this.params.labels) {
      //         this.labels = [];
      //         this.params.labels.forEach(item => {
      //           this.labels.push(item.id);
      //         })
      //       }
      //     }
      //   });
      // },

      // getTree() {
      //   let vars = {};
      //   vars.key = 'loophole_category';
      //   vars.params = {
      //     conds: [],
      //     dims: [],
      //     order: ['id', 'ASC'],
      //     hook: {
      //       is_cull: false,
      //     }
      //   };
      //   this.$api.get(vars, this, data => {
      //     // console.log(data);
      //     if (data) {
      //       this.options = this.$common.filterTree(data.data || [])
      //     }
      //   });
      // },

      getBaseline() {
        let vars = {};
        vars.key = 'baseline';
        vars.params = {
          conds: [
            'latest = true',
          ],
          dims: [],
          order: ['id', 'DESC'],
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data) {
            this.baselineList = data.data || [];
          }
        });
      },

      init() {
        // console.log(this.params);
        // this.getLoophole();
        // this.getTree();
        this.getBaseline();
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
