<template>
  <el-form ref="refForm" label-width="105px" class="default-search">
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="padding-right-40">
          <el-form-item label="项目名称:">
            <el-input
              v-model="searchParams.application_name"
            >
            </el-input>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="padding-right-40">
          <el-form-item label="时间范围:">
            <el-date-picker
              @change="onChangeTimer"
              v-model="searchParams.$timer"
              type="daterange"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="padding-right-40">
          <el-form-item label="所属部门:">
            <el-select
              v-model="searchParams.project_id"
              placeholder="请选择:所属部门"
              style="width: 100%"
              filterable
              autocomplete="off"
            >
              <el-option
                v-for="(item, index) in departmentList"
                :label="item.name"
                :value="item.id"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="padding-right-40">
          <el-form-item label="所属产品经理:">
            <el-select
              v-model="searchParams.product_manager"
              placeholder="请选择:所属产品经理"
              style="width: 100%"
              filterable
              autocomplete="off"
            >
              <el-option
                v-for="(item, index) in productManagerList"
                :label="item.name"
                :value="item.id"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="">
          <el-button
            type="primary"
            size="small"
            @click="onSearch"
          >
            搜索
          </el-button>
          <el-button
            type="default"
            size="small"
            @click="resetSearch"
          >
            重置
          </el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
  import mixins from '../mixins'

  export default {
    name: "searchForm",
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
    props: {},
    data() {
      return {
        taskList: ['未完成50%'],
        searchParams: {
          name: '',
        },
        departmentList: [],
        productManagerList: [],
      }
    },
    methods: {

      onChangeTimer(timer) {
        // console.log(timer);
        if (timer.length) {
          this.searchParams.start_time = timer[0] + ' 00:00:00';
          this.searchParams.end_time = timer[1] + ' 23:59:59';
        }
      },

      resetSearch() { // 重置搜索
        this.searchParams = {
          name: '',
        };
        this.onSearch();
      },

      onSearch() {
        this.$emit('on-search', this.searchParams)
      },

      getDepartment() {
        let vars = {};
        vars.key = 'department';
        vars.params = {
          conds: [],
          dims: [],
          order: ['id', 'ASC'],
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data) {
            this.departmentList = data.data || [];
          }
        });
      },

      getManager() {
        let vars = {};
        vars.key = 'role';
        vars.params = {
          conds: [
            'name = 产品经理'
          ],
          dims: [],
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data && data.data && data.data[0]) {
            // 项目组成员
            this.productManagerList = data.data[0].accounts || [];
          }
        });
      },

      init() {
        this.getDepartment();
        this.getManager();
      }

    },
    mounted() {
      this.init();
    }
  }
</script>

<style scoped>

</style>
