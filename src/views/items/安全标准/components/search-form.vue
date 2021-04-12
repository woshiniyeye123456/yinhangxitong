<template>
  <el-form ref="refForm" label-width="82px" class="default-search">
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="padding-right-10">
          <el-form-item label="名称:">
            <el-input
              v-model="searchParams.name"
            >
            </el-input>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="padding-right-10">
          <el-form-item label="软件平台:">
            <el-select
              v-model="searchParams.software_platform_id"
              placeholder="请选择:软件平台"
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
        <div class="padding-right-10">
          <!--<el-form-item label="安全类型:">-->
          <!--<el-input-->
          <!--v-model="searchParams.security_scene"-->
          <!--&gt;-->
          <!--</el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="安全类型:">
            <el-select
              v-model="searchParams.security_scene_id"
              placeholder="请选择:安全类型"
              style="width: 100%"
              filterable
              autocomplete="off"
            >
              <el-option
                v-for="item in securitySceneList"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="padding-right-10">
          <el-form-item label="风险等级:">
            <el-radio-group v-model="searchParams.risk_level">
              <el-radio
                class="margin-right-10"
                v-for="(item, index) in riskLevel"
                :label="item"
                :key="index"
              >{{ item }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="padding-right-10">
          <el-form-item label="属性标签:">
            <!--<div class="gq-tag-inner" @click="addAttribute">-->
            <!--<el-tag-->
            <!--v-for="(tag, i) in tags"-->
            <!--:key="tag.name + '' + i"-->
            <!--closable-->
            <!--:disable-transitions="false"-->
            <!--@close.stop="handleClose(i)">-->
            <!--{{ tag.name }}-->
            <!--</el-tag>-->
            <!--</div>-->
            <el-select
              v-model="selectModel"
              style="width: calc(100% - 40px)"
              placeholder=""
            >
              <el-option
                v-for="(item, index) in tags"
                :label="item.name"
                :value="item.name"
                :key="index"
                disabled
              >
                <span style="float: left">{{ item.name }}</span>
                <span
                  class="tag_close"
                  @click.stop="handleClose(index)"
                >
                  <i class="el-icon-close"></i>
                </span>
              </el-option>
            </el-select>
            <span
              class="tag_add"
              @click="addAttribute"
            >
              <i class="el-icon-plus"></i>
            </span>
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
    <!-- 选择属性 -->
    <attribute-popup
      @on-submit="attributeSubmit"
      :visible.sync="attributeVisible"
    ></attribute-popup>
  </el-form>
</template>

<script>
  import mixins from './mixins'
  import attributePopup from './attribute-popup'

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
    components: {
      attributePopup
    },
    props: {},
    data() {
      return {
        selectModel: '',
        searchParams: {
          name: '',
          automation: [],
        },
        softwarePlatList: [],
        securitySceneList: [],
        tags: [],
        attributeVisible: false,
      }
    },
    methods: {

      attributeSubmit(list) {
        // console.log(list);
        this.tags = [];
        list.forEach(item => {
          this.tags.push(item.data);
        });
      },

      handleClose(i) {
        this.tags.splice(i, 1);
      },

      addAttribute() {
        this.attributeVisible = true
      },

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
          automation: [],
        };
        this.tags = [];
        this.onSearch();
      },
      onSearch() {
        this.searchParams.property_label_id = [];
        if (this.tags.length) {
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

      init() {
        this.getSoftwarePlatform();
        this.getSecurityScene();
      }

    },
    mounted() {
      this.init();
    }
  }
</script>

<style scoped>
  .tag_add {
    color: #00C5D4;
    cursor: pointer;
    font-size: 22px;
    height: 22px;
    width: 22px;
    line-height: 22px;
    border-radius: 50%;
    vertical-align: middle;
    transform: scale(.8);
    text-align: center;
    position: relative;
    display: inline-block;
  }

  .tag_close {
    float: right;
    background-color: #C0C4CC;
    color: #FFF;
    cursor: pointer;
    font-size: 22px;
    height: 22px;
    width: 22px;
    line-height: 22px;
    border-radius: 50%;
    vertical-align: middle;
    transform: scale(.8);
    text-align: center;
    position: relative;
    display: inline-block;
  }

  .tag_close:hover {
    background-color: red;
  }

</style>
