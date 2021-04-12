<template>
  <el-form label-width="86px"
           :model="params" :rules="rules" ref="refForm">
    <el-row :gutter="14">
      <el-col :span="10">
        <el-card shadow="never" class="default-card">
          <div slot="header" class="clearfix">
            <span class="slot-title">基本信息</span>
          </div>
          <el-form-item label="标准名称:" prop="name">
            <el-input
              type="text"
              v-model="params.name"
              :readonly="readonly"
            ></el-input>
          </el-form-item>
          <el-form-item label="基线数量:">
            <el-input
              type="text"
              v-model="params.count"
              :readonly="readonly"
            ></el-input>
          </el-form-item>
          <el-form-item label="创建人:">
            <el-input
              type="text"
              v-model="params.creator"
              :readonly="readonly"
            ></el-input>
          </el-form-item>
          <el-form-item label="创建时间:">
            <el-input
              type="text"
              v-model="params.created_time"
              :readonly="readonly"
            ></el-input>
          </el-form-item>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-row :gutter="14">
          <el-col :span="12">
            <jixianbili
              height="170px"
              :chartList="chartList"
            ></jixianbili>
          </el-col>
          <el-col :span="12">
            <shuxingduibi
              height="170px"
              :chartList="chartList"
            ></shuxingduibi>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-card shadow="never" class="default-card margin-top-14">
      <div slot="header" class="clearfix">
        <span class="slot-title">相关基线</span>
      </div>
      <edit-table
        :tableColumn="tableColumn"
        :tableData="showList"
        :tableOptions="tableOptions"
        :pages="pages"
        :lines="lines"
        :total="total"
        @on-view="onView"
        @change-page="changePage"
      ></edit-table>
    </el-card>
    <div class="margin-top-10 text-right">
      <el-button
        type="default"
        @click="goBack"
        size="small"
      >
        返回
      </el-button>
    </div>
  </el-form>
</template>

<script>
  import mixins from '../../components/mixins'
  import jixianzongshu from '../../components/基线总数'
  import zidonghualv from '../../components/自动化率'
  import jixianbili from '../../components/基线安全分类比例图'
  import shuxingduibi from '../../components/属性对比图'
  import transferData from '../../components/基线选择';
  import yinyongcankao from '../../components/引用参考';
  import editTable from '../../../components/edit-table'

  export default {
    name: "基线视图view",
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
    components: {
      jixianzongshu,
      zidonghualv,
      jixianbili,
      shuxingduibi,
      transferData,
      yinyongcankao,
      editTable,
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
      },
      readonly: {
        type: Boolean,
        default: false,
      }
    },
    computed: {
      showList() {
        let i = (this.pages - 1) * 10;
        if (this.tableData.length) {
          return this.tableData.slice(i, i + 10);
        } else {
          return []
        }
      },
    },
    data() {
      return {
        pages: 1,
        lines: 10,
        total: 0,
        tableColumn: [
          {
            prop: 'name',
            label: '基线名称',
            align: 'center',
          },
          {
            prop: 'risk_level',
            label: '风险等级',
            align: 'center',
            minWidth: '8',
          },
        ],
        tableData: [],
        tableOptions: {
          operationWidth: '120',
          sequence: true,
          selection: false,
          loading: false,
          active: [
            'view'
          ],
          filterNameActive: [],
        },
        viewList: [], // 参考视图
        safetyStandardValue: [], // 参考标准
        viewValue: [],  // 参考视图
        execution_way: [],
        rules: {
          // name: [{required: true, message: '请输入:名称', trigger: 'blur'}],
          // coding: [{required: true, message: '请输入:编码', trigger: 'blur'}],
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
        defaultValue: [],
        isReady: false,
        props: {multiple: true},
        options: [],
        attr_list: [],
        attr_id: [],
        softwarePlatList: [],
        securitySceneList: [],
        chartList: [],
      }
    },
    methods: {

      changePage(page) {
        this.pages = page;
      },

      onView(params) {
        this.$router.push({
          name: 'viewBaselineSSandC',
          query: {
            id: params.row.id
          }
        })
      },

      getSecurityScene() {
        let vars = {};
        vars.key = 'security_scene';
        vars.params = {
          conds: [],
          dims: [],
          order: ['id', 'DESC'],
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data) {
            this.securitySceneList = data.data || [];
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

      change() {
        let nodes = this.$refs.cas.getCheckedNodes();
        this.attr_list = [];
        nodes.forEach(item => {
          if (item.isLeaf) {
            this.attr_list.push(item.data.id);
          }
        });
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
            if (this.params.property_labels) {
              this.attr_id = [];
              this.attr_list = [];
              this.params.property_labels.forEach(item => {
                let ids = item.path.split('.');
                ids = ids.map(Number);
                ids.pop();
                this.attr_id.push(ids)
                this.attr_list.push(item.id)
              });
            }
          }
        });
      },

      goback() {
        this.$emit('go-back')
      },

      goBack() {
        this.$router.go(-1)
      },

      init() {
        if (this.params.baselines) {
          this.defaultValue = this.params.baselines || [];
          this.dataList = this.$common.deepClone(this.defaultValue);
        }
        // if (this.params.risk_levels) {
        //   this.risk_level = [];
        //   this.params.risk_levels.forEach(item => {
        //     this.risk_level.push(item.risk_level)
        //   })
        // }
        // if (this.params.execution_ways) {
        //   this.execution_way = [];
        //   this.params.execution_ways.forEach(item => {
        //     this.execution_way.push(item.execution_way)
        //   })
        // }
        // if (this.params.standards) {
        //   this.safetyStandardValue = this.$common.deepClone(this.params.standards);
        // }
        // if (this.params.views) {
        //   this.viewValue = this.$common.deepClone(this.params.views);
        // }
        // this.isReady = true;
        //
        // this.getTree();
        // this.getSoftwarePlatform();
        // this.getSecurityScene();

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
        let loading = this.$loading({background: 'transparent'});
        this.$nextTick(() => {
          this.isReady = true;
          setTimeout(() => {
            loading.close();
          }, 1000);
        })
      },

      calculateView() {
        let loading = this.$loading({background: 'transparent'});
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
                this.total = total;
                let number = 0;
                this.chartList = data.data || [];
                this.tableData = data.data || [];
                this.chartList.forEach(item => {
                  if (item.automation === '是') {
                    number++
                  }
                });
                this.panelData2.val = number / total * 100;
                loading.close();
              }
            }, () => {
              loading.close();
            });
          } else {
            this.chartList = [];
            this.panelData2.val = 0;
            loading.close();
          }
        })();
      },
    },
    mounted() {
      this.init();
    },
    watch: {
      safetyStandardValue: { // 参考标准
        handler() {
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
