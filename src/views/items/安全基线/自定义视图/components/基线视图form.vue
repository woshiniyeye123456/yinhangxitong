<template>
  <el-form label-width="110px"
           :model="params" :rules="rules" ref="refForm">
    <el-row :gutter="14">
      <el-col :span="10">
        <el-card shadow="never" class="default-card">
          <div slot="header" class="clearfix">
            <span class="slot-title">基本信息</span>
          </div>
          <el-form-item label="基线视图名称:" prop="name">
            <el-input
              type="text"
              v-model="params.name"
              :disabled="disabled"
              placeholder="基线视图名称"
            ></el-input>
          </el-form-item>
          <!--<el-form-item label="基线视图编号:" prop="coding">-->
            <!--<el-input-->
              <!--type="text"-->
              <!--v-model="params.coding"-->
              <!--:disabled="disabled"-->
              <!--placeholder="基线视图编号"-->
            <!--&gt;</el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="版本号:" prop="version">
            <el-input
              type="text"
              v-model="params.version"
              :disabled="disabled"
              placeholder="版本号"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注:" prop="note">
            <el-input
              v-model="params.note"
              :autosize="{ minRows: 7, maxRows: 7}"
              type="textarea"
              :disabled="disabled"
              resize="none"
              placeholder="备注"
            ></el-input>
          </el-form-item>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-row :gutter="14">
          <el-col :span="12">
            <jixianzongshu
              :panelData="panelData1"
            ></jixianzongshu>
          </el-col>
          <el-col :span="12">
            <zidonghualv
              :panelData="panelData2"
            ></zidonghualv>
          </el-col>
        </el-row>
        <el-row :gutter="14" class="margin-top-14">
          <el-col :span="12">
            <jixianbili
              height="213px"
              :chartList="chartList"
            ></jixianbili>
          </el-col>
          <el-col :span="12">
            <shuxingduibi
              height="213px"
              :chartList="chartList"
            ></shuxingduibi>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-card shadow="never" class="default-card margin-top-14">
      <div slot="header" class="clearfix">
        <span class="slot-title">引用参考</span>
      </div>
      <el-form-item label="参考视图:">
        <el-select
          v-model="viewValue"
          :disabled="disabled"
          style="width: 100%"
          multiple
          filterable
          autocomplete="off"
        >
          <el-option
            v-for="item in viewList"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!--<yinyongcankao-->
        <!--title="参考视图"-->
        <!--iconName="shitu_xjjxk"-->
        <!--:disabled="disabled"-->
        <!--v-model="viewValue"-->
        <!--:list="viewList"-->
      <!--&gt;</yinyongcankao>-->
    </el-card>
    <el-card shadow="never" class="default-card margin-top-14">
      <div slot="header" class="clearfix">
        <span class="slot-title">基线选择</span>
      </div>
      <transfer-data
        :disabled="disabled"
        v-if="isReady"
        v-model="dataList"
        :defaultValue="defaultValue"
        :tableColumn="tableColumn"
      ></transfer-data>
    </el-card>
    <el-card shadow="never" class="default-card margin-top-14">
      <div slot="header" class="clearfix">
        <span class="slot-title">视图附件</span>
      </div>
      <text-upload
        :modal="false"
        :defaultFileList="fileDefaultFileList"
        @update:successFileList="val => fileFileList = val"
        :maxImg="20"
      ></text-upload>
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
        v-if="!disabled"
      >
        确认
      </el-button>
    </div>
  </el-form>
</template>

<script>
  import jixianzongshu from '../../components/基线总数'
  import zidonghualv from '../../components/自动化率'
  import jixianbili from '../../components/基线安全分类比例图'
  import shuxingduibi from '../../components/属性对比图'
  import transferData from '../../components/基线选择'
  import yinyongcankao from '../../components/引用参考'
  import textUpload from '../../../components/text-upload'

  export default {
    name: "新建基线",
    inject: {
      user: {
        from: 'user',
        default: () => {
          return {}
        }
      }
    },
    components: {
      jixianzongshu,
      zidonghualv,
      jixianbili,
      shuxingduibi,
      transferData,
      yinyongcankao,
      textUpload,
    },
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
        baselineLibraryList: [],  // 参考基线库
        viewList: [], // 参考视图
        baselineLibraryValue: [], // 参考基线库
        viewValue: [],  // 参考视图
        rules: {
          name: [{required: true, message: '请输入:名称', trigger: 'blur'}],
          coding: [{required: true, message: '请输入:编号', trigger: 'blur'}],
          version: [{required: true, message: '请输入:版本号', trigger: 'blur'}],
        },
        selectList: [],
        activeName: 'first',
        panelData1: {
          val: 0,
          title: '基线总数',
          icon: '钱',
          duration: 2600,
          className: 'icon-message',
          decimals: 0,
        },
        panelData2: {
          val: 0,
          title: '自动化率',
          icon: '钱',
          duration: 3600,
          className: 'icon-message',
          decimals: 2,
          prepend: '',
          append: '%',
        },
        // transfer-data
        dataList: [],
        tableColumn: [
          {
            prop: 'name',
            label: '基线名称',
            align: 'left',
          },
          {
            prop: 'risk_level',
            label: '风险等级',
            align: 'center',
          },
          {
            prop: 'security_scene',
            label: '安全类型',
            align: 'center',
            minWidth: '18',
          },
          {
            prop: '_software_plat',
            label: '软件平台',
            align: 'center',
          },
          // {
          //   prop: 'status',
          //   label: '状态',
          //   filters: [
          //     {text: '正常', value: '正常'},
          //     {text: '禁止', value: '禁止'}
          //   ],
          //   tagSuccessVal: '正常',
          //   scope: true
          // },
        ],
        defaultValue: [],
        isReady: false,
        chartList: [],
        // 附件
        fileDefaultFileList: [],
        fileFileList: [],
      }
    },
    methods: {

      goBack() {
        this.$router.go(-1)
      },

      submit() {
        let params = this.$common.deepClone(this.params);
        this.$refs.refForm.validate((valid) => {
          if (valid) {
            if (this.dataList && this.dataList.length) {
              params.baseline = [];
              this.dataList.forEach(item => {
                params.baseline.push({
                  baseline_id: item
                })
              })
            }
            if (this.viewValue && this.viewValue.length) {  // 基线库
              params.quotes = params.quotes || [];
              this.viewValue.forEach(item => {
                params.quotes.push({
                  view_id: item,
                })
              })
            }
            if (this.fileList && this.fileList.length) {
              params.files = JSON.stringify(this.fileList);
            } else {
              params.files = ''
            }
            if (params.id) {
              delete params.id
            }
            this.$emit('on-submit', params);
          } else {
            return this.$message.error('操作失败');
          }
        });
      },


      init() {
        // console.log(this.params)
        this.getBaselineLibrary();
        this.getBaselineView();

        if (this.params.baselines) {
          this.defaultValue = this.params.baselines || [];
          this.dataList = this.$common.deepClone(this.defaultValue);
        }
        if (this.params.libraries) {
          this.baselineLibraryValue = this.$common.deepClone(this.params.libraries);
        }
        if (this.params.views) {
          this.viewValue = this.$common.deepClone(this.params.views);
        }
        // 附件
        if (this.params.files) {
          this.fileDefaultFileList = JSON.parse(this.params.files);
          this.fileFileList = JSON.parse(this.params.files);
        }
        this.isReady = true;
      },

      getBaselineLibrary() {
        let vars = {};
        vars.key = 'baseline_library';
        vars.params = {
          conds: [
            'latest = true'
          ],
          dims: [],
          order: ['id', 'DESC'],
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data) {
            this.baselineLibraryList = data.data || [];
          }
        });
      },

      getBaselineView() {
        let vars = {};
        vars.key = 'baseline_view';
        vars.params = {
          conds: [
            'latest = true'
          ],
          dims: [],
          order: ['id', 'DESC'],
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data) {
            this.viewList = data.data || [];
          }
        });
      },

      getBaselineLibraryCite() {  // 参考基线库
        let vars = {};
        vars.key = 'baseline_library';
        vars.params = {
          conds: [],
          dims: [],
          order: ['id', 'DESC'],
        };
        if (this.baselineLibraryValue.length) {
          if (this.baselineLibraryValue.length === 1) {
            vars.params.conds.push(
              'id = ' + this.baselineLibraryValue[0]
            )
          } else {
            vars.params.conds.push(
              'id IN [' + this.baselineLibraryValue.join(',') + ']'
            )
          }
          this.$api.get(vars, this, data => {
            // console.log(data);
            if (data) {
              let baselines = [];
              data.data.forEach(item => {
                if (item.baselines) {
                  baselines.push(...item.baselines)
                }
              });
              this.initDataList(baselines)
            }
          });
        }
      },

      getViewCite() {  // 参考视图
        let vars = {};
        vars.key = 'baseline_view';
        vars.params = {
          conds: [],
          dims: [],
          order: ['id', 'DESC'],
        };
        if (this.viewValue.length) {
          if (this.viewValue.length === 1) {
            vars.params.conds.push(
              'id = ' + this.viewValue[0]
            )
          } else {
            vars.params.conds.push(
              'id IN [' + this.viewValue.join(',') + ']'
            )
          }
          this.$api.get(vars, this, data => {
            // console.log(data);
            if (data) {
              let baselines = [];
              data.data.forEach(item => {
                if (item.baselines) {
                  baselines.push(...item.baselines)
                }
              });
              this.initDataList(baselines)
            }
          });
        }
      },

      initDataList(data) {
        this.dataList.push(...data);
        this.defaultValue = [...new Set(this.dataList)];
        this.dataList = this.$common.deepClone(this.defaultValue);
        // console.log(this.dataList);
        this.isReady = false;
        let loading = this.$loading({background: 'rgba(0, 0, 0, 0.5)'});
        this.$nextTick(() => {
          this.isReady = true;
          setTimeout(() => {
            loading.close();
          }, 1000);
        })
      },

      calculateView() {
        // console.log(this.dataList);
        // 基线总数
        (() => {
          this.panelData1.val = this.dataList.length;
        })();
        // 自动化率 // 基线安全类型分类比例图
        (() => {
          let vars = {};
          vars.key = 'baseline';
          vars.params = {
            conds: [],
            dims: [],
          };
          if (this.dataList.length) {
            if (this.dataList.length === 1) {
              vars.params.conds.push(
                'id = ' + this.dataList[0]
              )
            } else {
              vars.params.conds.push(
                'id IN [' + this.dataList.join(',') + ']'
              )
            }
            this.$api.get(vars, this, data => {
              if (data) {
                // console.log(data.data);
                let total = data.data.length;
                let number = 0;
                this.chartList = data.data || [];
                this.chartList.forEach(item => {
                  if (item.automation === '是') {
                    number++
                  }
                });
                this.panelData2.val = number / total * 100;
              }
            });
          } else {
            this.chartList = [];
            this.panelData2.val = 0;
          }
        })();
      },

    },
    mounted() {
      this.init();
    },
    watch: {
      baselineLibraryValue: { // 参考基线库
        handler() {
          this.getBaselineLibraryCite();
        },
        deep: true
      },
      viewValue: {  // 参考视图
        handler() {
          this.getViewCite();
        },
        deep: true
      },
      dataList: {   // 计算视图
        handler() {
          this.$common.debounce(this.calculateView, 500)()  // 防止重复
        },
        deep: true
      }
    }
  }
</script>

<style scoped>

</style>
