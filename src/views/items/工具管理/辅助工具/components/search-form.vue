<template>
  <el-form ref="refForm" label-width="92px" class="default-search">
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="padding-right-40">
          <el-form-item label="编号:">
            <el-input
              v-model="searchParams.number"
            >
            </el-input>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="padding-right-40">
          <el-form-item label="名称:">
            <el-input
              v-model="searchParams.name"
            >
            </el-input>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="padding-right-40">
          <el-form-item label="危害:">
            <el-input
              v-model="searchParams.harm_level"
            >
            </el-input>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="padding-right-40">
          <el-form-item label="分类:">
            <el-select
              v-model="searchParams.category_id"
              placeholder="请选择:分类"
              style="width: 100%"
              filterable
              autocomplete="off"
            >
              <el-option
                v-for="item in softwarePlatList"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="padding-right-40">
          <el-form-item label="标签:">
            <el-input
              v-model="searchParams.asdfas"
            >
            </el-input>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="padding-right-40">
          <el-form-item label="登记时间:">
            <el-date-picker
              v-model="searchParams.created_time"
              type="date"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="padding-right-40">
          <el-form-item label="关联基线:">
            <el-input
              v-model="searchParams.sdfgdsfgdfgs"
            >
            </el-input>
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
        searchParams: {
          name: '',
        },
        softwarePlatList: [],
      }
    },
    methods: {

      resetSearch() { // 重置搜索
        this.searchParams = {
          name: '',
        };
        this.onSearch();
      },

      onSearch() {
        this.searchParams.property_label_id = [];
        if (this.tags && this.tags.length) {
          this.tags.forEach(item => {
            this.searchParams.property_label_id.push(item.id)
          })
        }
        this.$emit('on-search', this.searchParams)
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

      init() {
        this.getSoftwarePlatform();
      }

    },
    mounted() {
      this.init();
    }
  }
</script>

<style scoped>

</style>
