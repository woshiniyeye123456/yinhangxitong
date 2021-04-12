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
    <ve-chart
      :height="height"
      :data="chartData"
      :settings="chartSettings"
      :extend="chartExtend"
      :colors="colors"
    ></ve-chart>
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
        status: '',
        listData: [],
        colors: ['#17AFE6'],
        chartData: {
          columns: ['name', '数量'],
          rows: [],
        },
        chartSettings: {
          type: 'histogram',
        },
        chartExtend: {
          // title: {
          //   text: '数量对比图',
          //   subtext: ''
          // },
          // xAxis: {
          //   show: false,
          // },
          yAxis: {
            show: false,
          },
          series: {
            barWidth: '24px',
          },
          label: {
            normal: {
              show: true,
              position: 'top',
              distance: 2,
              color: '#24273F',
              fontWeight: 500,
              fontFamily: 'PingFangSC-Medium,PingFang SC',
              fontSize: 12,
            },
          },
          legend: {
            show: false,
          },
          grid: {
            height: 145,
            show: false,
          },
          barWidth: '60%',
        },
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
                '数量': o[k]
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
        this.chartData.rows = this.obj[this.status] || [];
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
