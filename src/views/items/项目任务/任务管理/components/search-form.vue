<template>
  <el-form ref="refForm" label-width="105px" class="default-search">
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="padding-right-40">
          <el-form-item label="任务名称:">
            <el-input
              v-model="searchParams.task_name"
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
          <el-form-item label="执行状态:">
            <el-select
              v-model="searchParams.status"
              placeholder="请选择:执行状态"
              style="width: 100%"
              filterable
              autocomplete="off"
            >
              <el-option
                v-for="(item, index) in statusList"
                :label="item"
                :value="item"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="padding-right-40">
          <el-form-item label="所属部门:">
            <el-select
              v-model="searchParams.department_id"
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
          <el-form-item label="所属需求组:">
            <el-select
              v-model="searchParams.project_id"
              placeholder="请选择:所属需求组"
              style="width: 100%"
              filterable
              autocomplete="off"
            >
              <el-option
                v-for="(item, index) in projectList"
                :label="item._application_name"
                :value="item.id"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="padding-right-40">
          <el-form-item label="所属负责人:">
            <el-select
              v-model="searchParams.taskOwner_id"
              placeholder="请选择:所属负责人"
              style="width: 100%"
              filterable
              autocomplete="off"
            >
              <el-option
                v-for="(item, index) in accountList"
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
              v-model="searchParams.pm_id"
              placeholder="请选择:所属产品经理"
              style="width: 100%"
              filterable
              autocomplete="off"
            >
              <el-option
                v-for="(item, index) in accountList"
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
          <el-form-item label="所属安全专员:">
            <el-select
              v-model="searchParams.security_specialist"
              placeholder="请选择:所属安全专员"
              style="width: 100%"
              filterable
              autocomplete="off"
            >
              <el-option
                v-for="(item, index) in accountList"
                :label="item.name"
                :value="item.name"
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
        accountList: [],
        projectList: [],
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

      getAccount() {
        let vars = {};
        vars.key = 'account';
        vars.params = {
          conds: [],
          dims: [],
          order: ['id', 'ASC'],
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data) {
            this.accountList = data.data || [];
          }
        });
      },

      getProject() {
        let vars = {};
        vars.key = 'projects';
        this.$api.wf(vars, this, data => {
          // console.log(data);
          if (data.data) {
            this.projectList = data.data.data || [];
            this.projectList.forEach(item => {
              item._application_name = item.data.application_name;
            })
          }
        });
      },

      init() {
        this.getDepartment();
        this.getAccount();
        this.getProject();
      }

    },
    mounted() {
      this.init();
    }
  }
</script>

<style scoped>

</style>
