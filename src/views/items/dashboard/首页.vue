<template>
  <div>
    <el-row :gutter="20">
      <el-col :md="24" :lg="12" :xl="12">
        <div class="box1"></div>
      </el-col>
      <el-col :md="24" :lg="6" :xl="6">
        <echarts-card
          :cardTitle="'92.6K'"
          :secondTitle="'Revenue Generated'"
          :chartData="chartData1"
          :cardCircle="'rgba(40, 199, 111, 0.24)'"
        >
        </echarts-card>
      </el-col>
      <el-col :md="24" :lg="6" :xl="6">
        <echarts-card
          :cardTitle="'98.6K'"
          :secondTitle="'Revenue Generated'"
          :chartData="chartData2"
          :cardCircle="'rgba(255,160,68,.24)'"
        >
        </echarts-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="margin-top-20">
      <el-col :span="8">
        <div class="box1"></div>
      </el-col>
      <el-col :span="8">
        <div class="box2"></div>
      </el-col>
      <el-col :span="8">
        <time-line></time-line>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="margin-top-20">
      <el-col :span="24">
        <edit-table
          :tableData="tableData"
          :tableColumn="tableColumn"
          :tableOptions="tableOptions"
          :pages="pages"
          :lines="lines"
          :total="total"
        ></edit-table>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="margin-top-20">
      <el-col :span="24">
        <div class="box1"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import echartsCard from "../components/echarts-card.vue"
  import timeLine from "../components/time-line.vue"
  import editTable from '../components/edit-table';

  export default {
    name: '首页',
    components: {
      echartsCard,
      editTable,
      timeLine
    },
    data() {
      return {
        chartData1: {
          columns: ['日期', '访问用户'],
          rows: [
            {'日期': '1/1', '访问用户': 1393},
            {'日期': '1/2', '访问用户': 3530},
            {'日期': '1/3', '访问用户': 2923},
            {'日期': '1/4', '访问用户': 1723},
            {'日期': '1/5', '访问用户': 3792,},
            {'日期': '1/6', '访问用户': 4593}
          ],
        },
        chartData2: {
          columns: ['日期', '访问用户'],
          rows: [
            {'日期': '1/1', '访问用户': 1325},
            {'日期': '1/2', '访问用户': 5454},
            {'日期': '1/3', '访问用户': 9516},
            {'日期': '1/4', '访问用户': 4546},
            {'日期': '1/5', '访问用户': 1312,},
            {'日期': '1/6', '访问用户': 7897}
          ],
        },
        tableColumn: [
          {
            prop: 'name',
            label: '姓名',
            align: "center"
          },
        ],
        tableData: [
          {name: 'tom'},
          {name: 'marry'},
          {name: 'kewen'},
          {name: 'liya'},
          {name: 'kelus'},
        ],
        tableOptions: {
          sequence: true,
          selection: true,
          loading: false,
          active: [
            // 'view',
            'edit',
            'delete',
          ],
          filterNameActive: [
            // '编辑'
          ],
        },
        pages: 1,
        lines: 10,
        total: 0,
      }
    }
  }
</script>

<style scoped>
  .box1 {
    height: 242px;
    background: rgba(115, 103, 240, 1);
    border-radius: 6px;
  }

  .box2 {
    height: 242px;
    background: rgba(40, 199, 111, 1);
    border-radius: 6px;
  }

  .box3 {
    height: 242px;
    background: rgba(255, 160, 68, 1);
    border-radius: 6px;
  }
</style>
