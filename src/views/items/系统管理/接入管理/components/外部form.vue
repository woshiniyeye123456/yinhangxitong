<template>
  <el-form label-width="110px"
           :model="params" :rules="rules" ref="refForm">
    <el-card shadow="never" class="default-card">
      <div slot="header" class="clearfix">
        <span class="slot-title">基本信息</span>
      </div>
      <el-form-item label="系统编码:" prop="code">
        <el-input
          type="text"
          v-model="params.code"
          :disabled="disabled"
          :readonly="readonly"
          placeholder="系统编码"
        ></el-input>
      </el-form-item>
      <el-form-item label="系统名称:" prop="name">
        <el-input
          type="text"
          v-model="params.name"
          :disabled="disabled"
          :readonly="readonly"
          placeholder="系统名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="系统描述:" prop="des">
        <el-input
          type="text"
          v-model="params.des"
          :disabled="disabled"
          :readonly="readonly"
          placeholder="系统描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="端口区间:">
        <el-row :gutter="0">
          <el-col :span="11">
            <el-input-number
              :disabled="disabled"
              :readonly="readonly"
              v-model="port_start"
              controls-position="right"
              :min="0"
              @change="changeStart"
            ></el-input-number>
          </el-col>
          <el-col :span="2">
            <div class="text-center">~</div>
          </el-col>
          <el-col :span="11">
            <el-input-number
              :disabled="disabled"
              :readonly="readonly"
              v-model="port_end"
              controls-position="right"
              :min="1"
              @change="changeEnd"
            ></el-input-number>
          </el-col>
        </el-row>
      </el-form-item>
      <template v-if="readonly">
        <el-form-item label="脚本语言:" prop="script_lang">
          <el-input
            type="text"
            v-model="params.script_lang"
            :readonly="readonly"
          ></el-input>
        </el-form-item>
        <el-form-item label="接入脚本:" prop="script">
          <el-input
            v-model="params.script"
            :autosize="{ minRows: 32, maxRows: 32}"
            type="textarea"
            :readonly="readonly"
            resize="none"
          ></el-input>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="脚本语言:" prop="script_lang">
          <el-select
            :disabled="disabled"
            v-model="params.script_lang"
            placeholder="请选择:脚本语言"
            style="width: 100%"
            filterable
            autocomplete="off"
          >
            <el-option
              v-for="(item, index) in scriptList"
              :label="item"
              :value="item"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="接入脚本:" prop="script">
          <div class="codemirror-border">
            <codemirror v-model="params.script" :options="codeMirrorOptions"></codemirror>
          </div>
        </el-form-item>
      </template>
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
        v-if="!readonly"
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
      },
      readonly: {
        type: Boolean,
        default: false,
      }
    },
    computed: {},
    data() {
      return {
        codeMirrorOptions: {
          mode: 'php',
          tabSize: 2,
          lineNumbers: false,
          lineWrapping: true,
          viewportMargin: Infinity,
          extraKeys: {'Ctrl-Space': 'autocomplete'},
        },
        rules: {
          name: [{required: true, message: '请输入:系统名称', trigger: 'blur'}],
          des: [{required: true, message: '请输入:系统描述', trigger: 'blur'}],
          code: [{required: true, message: '请输入:编码', trigger: 'blur'}],
          script_lang: [{required: true, message: '请输入:脚本语言', trigger: 'blur'}],
          script: [{required: true, message: '请输入:接入脚本', trigger: 'blur'}],
        },
        port_start: 0,
        port_end: 1,
      }
    },
    methods: {

      changeStart(val) {
        if (this.port_end <= val) {
          this.port_end = val + 1;
        }
      },

      changeEnd(val) {
        if (this.port_start >= val) {
          this.port_start = val - 1;
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
            params.port_interval = this.port_start + ',' + this.port_end;
            if (params.id) {
              this.$emit('on-update', params);
            } else {
              this.$emit('on-submit', params);
            }
          } else {
            return this.$message.error('操作失败');
          }
        });
      },

      init() {
        // console.log(this.params);
        if (this.params.port_interval) {
          let port_interval = this.params.port_interval.split(',');
          if (port_interval) {
            this.port_start = port_interval[0];
            this.port_end = port_interval[1];
          }
        }
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
  .codemirror-border {
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    line-height: 32px;
  }
</style>
