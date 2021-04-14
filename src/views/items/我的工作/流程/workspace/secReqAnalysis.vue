<template>
  <el-card shadow="never" class="default-card">
    <div slot="header" class="clearfix">
      <span class="slot-title">工单面板</span>
    </div>
    <el-form label-width="120px" :model="params" :rules="rules" ref="refForm">
      <el-form-item label="需求分析说明书:">
        <text-upload :modal="false" :defaultFileList="fileDefaultFileList" @update:successFileList="val => fileFileList = val"
          :maxImg="20"></text-upload>
      </el-form-item>
      <!-- 参考分组 start -->
      <el-form-item label="参考分组:">
        <el-button type="primary" icon="el-icon-plus" circle @click="groupDialogVisible = true" :disabled="disabled"></el-button>
        <template v-if="disabled">
          <el-tag class="margin-left-10" v-for="(item, index) in editableTabs" :key="index" :effect="editableTabsValue === item.name ? 'dark':'plain'">
            <span class="tag-span" @click.stop="editableTabsValue = item.name">{{ item.group_name }}</span>
          </el-tag>
        </template>
        <template v-else>
          <el-tag class="margin-left-10" v-for="(item, index) in editableTabs" :key="index" :effect="editableTabsValue === item.name ? 'dark':'plain'"
            closable @close="handleClose(item)">
            <span class="tag-span" @click.stop="editableTabsValue = item.name">{{ item.group_name }}</span>
          </el-tag>
        </template>
      </el-form-item>
      <div class="text-right">
        <!-- <el-button
          size="mini"
          type="primary"
          @click="addTab(null)"
          :disabled="disabled"
        >
          添加基线组
        </el-button>-->
      </div>
      <template v-if="editableTabs && editableTabs.length">
        <div class="margin-top-5" v-for="(item, index) in editableTabs" :label="item.group_name" :name="item.name" :key="item.name"
          v-show="item.name === editableTabsValue">
          <el-card shadow="never" class="default-card margin-top-14">
            <div slot="header" class="clearfix">
              <span class="slot-title">基本信息</span>
              <div class="float-right" v-if="!disabled">
                <!-- <el-button type="primary" size="mini" @click="saveAsView">
                  另存视图
                </el-button>-->
              </div>
            </div>
            <el-form-item label="分组名称:">
              <el-input type="text" v-model="item.group_name" :readonly="item.readonly" :disabled="disabled"
                placeholder="分组名称"></el-input>
            </el-form-item>
          </el-card>
          <el-card shadow="never" class="default-card margin-top-14">
            <div slot="header" class="clearfix">
              <span class="slot-title">基线选择</span>
            </div>
            <transfer-data v-if="item.isReady" :disabled="disabled" v-model="item.baseline_ids" :setValue.sync="item.baselines"
              :orgin_ids="item.orgin_baseline_ids" :tableColumn="tableColumn"></transfer-data>
          </el-card>
        </div>
      </template>
      <popup-group title="参考分组" :value="params" :standardsList="standardsList" :viewsList="viewsList" v-if="groupDialogVisible"
        :visible.sync="groupDialogVisible" @on-submit="groupSubmit"></popup-group>
      <!-- 参考分组 end -->
      <div class="margin-top-10 text-right" v-show="!readonly">
        <el-button type="default" @click="goBack" size="small">返回</el-button>
        <el-button type="primary" @click="save" size="small" v-if="!disabled">保存</el-button>
        <el-button type="primary" @click="fileSaver" size="small">下载报告</el-button>
        <el-button type="primary" @click="view" size="small">查看报告</el-button>
        <el-button type="primary" @click="submit" size="small" v-if="!disabled">确认完成</el-button>
      </div>
    </el-form>
    <el-dialog title="报告详情" :append-to-body="true" :close-on-click-modal="true" :visible.sync="dialogVisible" width="75%"
      class="dialog-default">
      <el-row :gutter="12" v-if="dialogVisible">
        <el-col :span="6">
          <el-tree highlight-current :data="viewDownTableTabs" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </el-col>
        <el-col :span="18">
          <div v-html="report_details" v-if="report_details"></div>
        </el-col>
      </el-row>
      <!--<div v-html="reportDetails"></div>-->
      <div class="margin-top-20 text-right">
        <el-button type="default" @click="dialogVisible = false" size="small">确定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { mapGetters } from "vuex";
import textUpload from "../../../components/text-upload";
import transferData from "../components/基线选择";
import popupGroup from "../components/popup-group";
import FileSaver from "file-saver";

export default {
  name: "secReqAnalysis",
  inject: {
    user: {
      from: "user",
      default: () => {
        return {};
      }
    }
  },
  components: {
    textUpload,
    transferData,
    popupGroup
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    workflow_id: {
      type: Number,
      default: 0
    },
    node_name: {
      type: String,
      default: ""
    },
    task_id: {
      type: Number,
      default: 0
    },
    data_saved: {
      type: Boolean,
      default: false
    },
    readonly: false
  },
  computed: {
    ...mapGetters(["wfEditableTabs"]),
    viewDownTableTabs() {
      let tables = [];
      this.editableTabs.forEach(item => {
        let obj = this.$common.deepClone(item);
        if (obj.baselines && obj.baselines.length) {
          obj.baselines = obj.baselines.filter(bs => {
            return bs._orginType !== "del";
          });
        }
        tables.push(obj);
      });
      return tables;
    }
  },
  data() {
    return {
      groupDialogVisible: false,
      reportDetails: "",
      dialogVisible: false,
      tableColumn: [
        {
          prop: "name",
          label: "基线名称",
          align: "left",
          isPopover: true
        },
        {
          prop: "_software_plat",
          label: "软件平台",
          align: "center",
          minWidth: "12"
        }
      ],
      rules: {
        // name1: [{required: true, message: '请输入:名称', trigger: 'blur'}],
      },
      // 附件
      fileDefaultFileList: [],
      fileFileList: [],
      params: {
        referenceStandards: [],
        referenceViews: []
      },
      standardsList: [],
      viewsList: [],
      // tabs
      editableTabsValue: "1",
      editableTabs: [
        // {
        //   group_name: '分组名称 1',
        //   name: '1',
        //   isReady: true,
        //   baseline_ids: [],
        //   baselines: [],
        // },
      ],
      defaultProps: {
        children: "baselines",
        label: "group_name"
      },
      report_details: ""
    };
  },
  methods: {
    handleNodeClick(data) {
      // console.log(data);
      this.report_details = data._report_details;
    },

    saveAsView() {
      let params = this.editableTabs.find(
        it => it.name === this.editableTabsValue
      );
      // console.log(params);
      // console.log(this.params.referenceStandards, '标准');
      // console.log(this.params.referenceViews, '视图');
      // if (params.readonly === false) {
      //   // 标准
      //   this.$router.push({
      //     name: 'addSafetyStandard',
      //     params: {
      //       params: {
      //         creator_id: this.user.id,
      //         source: 2,
      //         baselines: params.baseline_ids,
      //         name: params.group_name,
      //         standards: this.params.referenceStandards,
      //       }
      //     }
      //   })
      // } else {
      //   // 视图
      //   this.$router.push({
      //     name: 'addSafetyStandard',
      //     params: {
      //       params: {
      //         creator_id: this.user.id,
      //         source: 2,
      //         baselines: params.baseline_ids,
      //         name: params.group_name,
      //         views: this.params.referenceViews,
      //       }
      //     }
      //   })
      // }

      // 储存 editableTabs
      this.$store.commit("SET_WFEDITABLETABS", this.editableTabs);

      // 视图
      this.$router.push({
        name: "addBaselineView",
        params: {
          params: {
            creator_id: this.user.id,
            source: 2,
            baselines: params.baseline_ids,
            name: params.group_name,
            views: this.params.referenceViews
          }
        }
      });
    },

    groupSubmit(params) {
      console.log(params);
      if (params.referenceStandards) {
        this.params.referenceStandards = params.referenceStandards;
        this.changeStandards(this.params.referenceStandards);
      }
      if (params.referenceViews) {
        this.params.referenceViews = params.referenceViews;
        this.changeViews(this.params.referenceViews);
      }
    },

    handleClose(item) {
      // console.log(item);
      this.removeTab(item.name);
    },

    changeStandards(id) {
      // 改为单选  之前多选逻辑不动  依旧是数组
      if (id) {
        let item = this.standardsList.find(e => e.id === id);
        let tab = this.editableTabs.find(tab => tab.group_name === item.name);
        console.log(item);
        if (!tab) {
          let save_orgin = true;
          this.addTab(item.name, item.baselines, save_orgin);
        }
      }
    },

    changeViews(id) {
      // 改为单选
      if (id) {
        let item = this.viewsList.find(e => e.id === id);
        let tab = this.editableTabs.find(tab => tab.group_name === item.name);
        if (!tab) {
          let save_orgin = true;
          this.addTab(item.name, item.baselines, save_orgin);
        }
      }
    },

    fileSaver() {
      let content = this.getBaselineView();
      let blob = new Blob([content], {
        type: "text/plain;charset=utf-8"
      });
      // FileSaver.saveAs(blob, this.$common.getThisTime() + ".doc");
      FileSaver.saveAs(
        blob,
        this.params.requirement + this.params.task_name + ".doc"
      );
    },

    getBaselineView() {
      this.reportDetails = "";
      // console.log(this.editableTabs)
      this.viewDownTableTabs.forEach((item, index) => {
        this.reportDetails += `<h1>${index + 1}. ${item.group_name}</h1>`;
        if (item.baselines && item.baselines.length) {
          item.baselines.forEach((line, i) => {
            line.group_name = line.name;
            line._report_details = this.$common.filterBaseline(
              line,
              null,
              i + 1
            );
            this.reportDetails += this.$common.filterBaseline(
              line,
              null,
              i + 1
            );
          });
        }
      });
      return this.reportDetails;
    },

    view() {
      this.getBaselineView();
      this.dialogVisible = true;
    },

    addTab(group_name, baseline_ids, save_orgin) {
      let readonly = false;
      if (group_name) {
        readonly = true;
      }
      baseline_ids = baseline_ids || [];
      let newTabName = "1";
      if (this.editableTabs && this.editableTabs.length) {
        newTabName =
          +this.editableTabs[this.editableTabs.length - 1].name + 1 + "";
      }
      group_name = group_name || "分组名称 " + newTabName;
      let tabRowData = {
        group_name,
        readonly,
        name: newTabName,
        isReady: true,
        baseline_ids,
        baselines: []
      };
      if (save_orgin) {
        // 是否储存原始基线id集， 参考视图或者参考标准情况下，需要储存该标准（视图）的原始基线
        tabRowData.orgin_baseline_ids = baseline_ids;
      }
      let arr = [];
      arr.push(tabRowData);
      this.$nextTick(() => {
        this.editableTabs = arr;
      });
      this.editableTabsValue = newTabName;
    },

    removeTab(targetName) {
      this.$confirm("确认删除吗?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          let tabs = this.editableTabs;
          let activeName = this.editableTabsValue;
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.name === targetName) {
                let nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                  activeName = nextTab.name;
                }
              }
            });
          }
          this.editableTabsValue = activeName;
          this.editableTabs = tabs.filter(tab => tab.name !== targetName);
        })
        .catch(() => {});
    },

    goBack() {
      // 清除缓存
      this.$store.commit("clear_WFEDITABLETABS");
      this.$router.go(-1);
    },

    save() {
      let params = this.$common.deepClone(this.params);
      params.requirementDoc = this.$common.deepClone(this.fileFileList);
      let baselines = [];
      if (this.editableTabs && this.editableTabs.length) {
        this.editableTabs.forEach(item => {
          if (item.baselines && item.baselines.length) {
            item.baselines.forEach(bs => {
              bs.group = item.group_name;
              baselines.push(bs);
            });
          }
        });
      }
      params.baselines = baselines;
      // 清除缓存
      this.$store.commit("clear_WFEDITABLETABS");
      this.$emit("on-save", params);
    },

    submit() {
      let params = this.$common.deepClone(this.params);
      this.$refs.refForm.validate(valid => {
        if (valid) {
          params.requirementDoc = this.$common.deepClone(this.fileFileList);
          let baselines = [];
          if (this.editableTabs && this.editableTabs.length) {
            this.editableTabs.forEach(item => {
              if (item.baselines && item.baselines.length) {
                item.baselines.forEach(bs => {
                  bs.group = item.group_name;
                  baselines.push(bs);
                });
              }
            });
          }
          params.baselines = baselines;
          // 清除缓存
          this.$store.commit("clear_WFEDITABLETABS");
          this.$emit("on-submit", params);
        } else {
          return this.$message.error("操作失败");
        }
      });
    },

    getTaskData() {
      let vars = {
        task_id: this.task_id,
        key: "taskData"
      };
      this.$api.wf(vars, this, data => {
        // console.log(data);
        if (data && data.data) {
          this.setData(data.data);
        }
      });
    },

    getView() {
      let vars = {
        workflow_id: this.workflow_id,
        key: "view",
        name: "taskData"
      };
      this.$api.wf(vars, this, data => {
        if (data && data.data) {
          this.setData(data.data);
        }
      });
    },

    setData(data) {
      // console.log(data)
      this.params = data;
      if (data.baselines && data.baselines.length) {
        this.editableTabs = [];
        data.baselines.forEach(item => {
          let tab = this.editableTabs.find(tab => {
            return tab.group_name === item.group;
          });
          if (tab) {
            tab.baselines.push(item);
            tab.baseline_ids.push(item.id);
            if (item._orginType === "del" || item._orginType === "orgin") {
              tab.orgin_baseline_ids.push(item.id);
            }
          } else {
            let pushTab = {
              group_name: item.group,
              name: this.editableTabs.length + 1 + "",
              isReady: false,
              baseline_ids: [item.id],
              baselines: [item],
              orgin_baseline_ids: []
            };
            if (item._orginType === "del" || item._orginType === "orgin") {
              pushTab.orgin_baseline_ids.push(item.id);
            }
            this.editableTabs.push(pushTab);
          }
        });
      }
      // console.log(this.editableTabs)
      // 附件
      if (data.requirementDoc && data.requirementDoc.length) {
        this.fileDefaultFileList = this.$common.deepClone(data.requirementDoc);
        this.fileFileList = this.$common.deepClone(data.requirementDoc);
      }

      // 读取 editableTabs
      if (this.wfEditableTabs && this.wfEditableTabs.length) {
        this.editableTabs = this.wfEditableTabs;
        this.editableTabs.forEach(item => {
          item.isReady = false;
        });
      }

      this.$nextTick(() => {
        this.editableTabs.forEach(item => {
          item.isReady = true;
        });
      });
    },

    getStandards() {
      let vars = {};
      vars.key = "safety_standard";
      vars.params = {
        conds: ["latest = true"],
        dims: []
      };
      this.$api.get(vars, this, data => {
        // console.log(data);
        if (data) {
          this.standardsList = data.data || [];
          console.log(this.standardsList);
        }
      });
    },

    getViews() {
      let vars = {};
      vars.key = "baseline_view";
      vars.params = {
        conds: ["latest = true"],
        dims: []
      };
      this.$api.get(vars, this, data => {
        // console.log(data);
        if (data) {
          this.viewsList = data.data || [];
        }
      });
    },

    init() {
      this.getStandards();
      this.getViews();
      if (this.data_saved) {
        this.getTaskData();
      } else {
        this.getView();
      }
      this.addTab(null);
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.tag-span {
  cursor: pointer;
}

.tag-span:hover {
  text-decoration: underline;
}
</style>
