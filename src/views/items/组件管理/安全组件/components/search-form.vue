<template>
  <el-form ref="refForm" label-width="92px" class="default-search">
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="padding-right-40">
          <el-form-item label="名称:">
            <el-input v-model="searchParams.name">
            </el-input>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="padding-right-40">
          <el-form-item label="版本号:">
            <el-input v-model="searchParams.version">
            </el-input>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="padding-right-40">
          <el-form-item label="来源:">
            <el-input v-model="searchParams.component_source">
            </el-input>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="padding-right-40">
          <el-form-item label="软件平台:">
            <el-select v-model="searchParams.software_platform_id" placeholder="请选择:软件平台" style="width: 100%"
              filterable autocomplete="off">
              <el-option v-for="item in softwarePlatList" :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="padding-right-40">
          <el-form-item label="标签:">
            <el-select v-model="searchParams.label_id" placeholder="请选择:标签" style="width: 100%" filterable autocomplete="off"
              multiple>
              <el-option v-for="item in componentLabelsList" :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="padding-right-40">
          <el-form-item label="登记时间:">
            <el-date-picker v-model="searchParams.created_time" type="date" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </div>
      </el-col>
      <!--<el-col :span="8">-->
      <!--<div class="padding-right-40">-->
      <!--<el-form-item label="更新时间:">-->
      <!--<el-date-picker-->
      <!--v-model="searchParams.updated_time"-->
      <!--type="date"-->
      <!--format="yyyy 年 MM 月 dd 日"-->
      <!--value-format="yyyy-MM-dd">-->
      <!--</el-date-picker>-->
      <!--</el-form-item>-->
      <!--</div>-->
      <!--</el-col>-->
      <el-col :span="8" style="margin:1px">
        <div class="">
          <el-button type="primary" size="small" @click="onSearch">
            搜索
          </el-button>
          <el-button type="default" size="small" @click="resetSearch">
            重置
          </el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import mixins from "../mixins";

export default {
  name: "searchForm",
  inject: {
    user: {
      from: "user",
      default: () => {
        return {};
      }
    }
  },
  mixins: [mixins],
  components: {},
  props: {},
  data() {
    return {
      searchParams: {
        name: "",
        label_id: []
      },
      softwarePlatList: [],
      componentLabelsList: []
    };
  },
  methods: {
    resetSearch() {
      // 重置搜索
      this.searchParams = {
        name: ""
      };
      this.onSearch();
    },

    onSearch() {
      this.searchParams.property_label_id = [];
      if (this.tags && this.tags.length) {
        this.tags.forEach(item => {
          this.searchParams.property_label_id.push(item.id);
        });
      }
      this.$emit("on-search", this.searchParams);
    },

    getSoftwarePlatform() {
      let vars = {};
      vars.key = "software_platform";
      vars.params = {
        conds: [],
        dims: [],
        order: ["id", "DESC"]
      };
      this.$api.get(vars, this, data => {
        // console.log(data);
        if (data) {
          this.softwarePlatList = data.data || [];
        }
      });
    },

    getComponentLabelsList() {
      let vars = {};
      vars.key = "component_label";
      vars.params = {
        conds: [],
        dims: [],
        order: ["id", "DESC"]
      };
      this.$api.get(vars, this, data => {
        // console.log(data);
        if (data) {
          this.componentLabelsList = data.data || [];
        }
      });
    },

    init() {
      this.getSoftwarePlatform();
      this.getComponentLabelsList();
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style scoped>
</style>
