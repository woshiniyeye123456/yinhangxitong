<template>
  <el-card shadow="never" class="default-card">
    <div slot="header" class="clearfix">
      <span class="slot-title">属性标签</span>
      <div class="card-tip">
        <el-select
          class="chart-top no-border"
          v-model="status"
          placeholder="请选择: "
          filterable
          autocomplete="off"
        >
          <el-option
            v-for="item in listData"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          ></el-option>
        </el-select>
      </div>
    </div>
    <div
      :style="{'height': height}"
      @click="viewChart('安全类型', echartOptions1)"
    >
      <v-echart :autoresize="true" :options="echartOptions1"></v-echart>
    </div>
    <el-dialog
      :title="viewTitle"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      width="80%"
      :close-on-click-modal="false"
      class="dialog-default"
    >
      <div style="height: 600px;">
        <v-echart :autoresize="true" :options="viewOptions"></v-echart>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>

  export default {
    name: "属性对比图",
    props: {
      chartList: {
        type: Array,
        default() {
          return []
        }
      },
      height: {
        type: String,
        default: '217px',
      }
    },
    data() {
      return {
        viewTitle: '',
        viewOptions: {},
        dialogVisible: false,
        echartOptions1: {
          tooltip: {},
          legend: {
            left: 'center',
            bottom: 'bottom',
            data: []
          },
          grid: {
            top: '10%',
            left: "3%",
            right: "3%",
            bottom: "10%",
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: [],
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              show: false
            }
          },
          yAxis: {
            type: 'value',
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: 'rgb(214, 214, 214)',
                type: 'dashed'
              }
            }
          },
          series: [
            {
              data: [],
              type: 'bar',
              name: '处理任务数',
              barWidth: 14,
              itemStyle: {
                normal: {
                  color: "#51CEE3",// 定义柱形的背景色
                  barBorderRadius: [4, 4, 0, 0] //定义背景柱形的圆角
                }
              },
              backgroundStyle: {
                color: 'rgba(255,255,255,1)'
              }
            },
          ]
        },
        status: '',
        listData: [],
        obj: {},
      }
    },
    computed: {
      rowsValue() {
        if (this.status) {
          return this.obj[this.status] || [];
        } else {
          return []
        }
      }
    },
    methods: {

      viewChart(title, options) {
        this.viewTitle = title;
        this.viewOptions = options;
        this.dialogVisible = true;
      },

      init() {
        if (this.chartList.length) {
          let rows = [];
          let obj = {};
          this.chartList.forEach(item => {
            if (item.property_labels && item.property_labels.length) {
              item.property_labels.forEach(pl => {
                let id = +pl.path.split('.')[0];
                obj[id] = obj[id] || {};
                obj[id][pl.name] = obj[id][pl.name] || 0;
                obj[id][pl.name]++
              });
            }
          });
          for (let key in obj) {
            let o = obj[key];
            this.obj[key] = [];
            rows = [];
            for (let k in o) {
              rows.push({
                name: k,
                value: o[k]
              })
            }
            this.obj[key] = rows;
          }
        } else {
          this.obj = {};
        }
        this.setValue()
      },

      getList() {
        let vars = {};
        vars.key = 'property_label';
        vars.params = {
          conds: [],
          dims: [],
          order: ['id', 'ASC'],
          hook: {
            is_cull: true,
          }
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data) {
            this.listData = this.$common.filterTree(data.data || []);
            if (this.listData.length) {
              this.status = this.listData[0].id
            }
          }
        });
      },

      setValue() {
        this.echartOptions1.legend.data = [];
        this.echartOptions1.series[0].data = [];
        this.echartOptions1.series[0].data = this.obj[this.status] || [];
        if (this.obj[this.status]) {
          this.obj[this.status].forEach(item => {
            this.echartOptions1.legend.data.push(item.name);
          })
        }
      }

    },
    mounted() {
      this.init();
      this.getList();
    },
    watch: {
      chartList: {
        handler() {
          this.init();
        },
        deep: true,
      },
      status: {
        handler() {
          this.setValue()
        },
        deep: true,
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
