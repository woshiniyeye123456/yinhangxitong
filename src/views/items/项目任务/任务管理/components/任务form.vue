<template>
  <el-form label-width="120px" :model="params" :rules="rules" ref="refForm">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="1">
        <div class="form-page-full">
          <el-card shadow="never" class="default-card margin-top-14">
            <div slot="header" class="clearfix">
              <span class="slot-title">基本信息</span>
            </div>
            <el-form-item label="任务名称:" prop="task_name">
              <el-input type="text" v-model="params.task_name" placeholder="任务名称" :disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="任务编号:" prop="requirement">
              <el-input type="text" v-model="params.requirement" placeholder="任务编号" :disabled="disabled"></el-input>
            </el-form-item>
            <!--<el-form-item label="子需求编号:" prop="subRequirement">-->
            <!--<el-input-->
            <!--type="text"-->
            <!--v-model="params.subRequirement"-->
            <!--placeholder="子需求编号"-->
            <!--:disabled="disabled"-->
            <!--&gt;</el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="从属关系:" prop="subordinate">-->
            <!--<el-radio-group-->
            <!--:disabled="disabled"-->
            <!--v-model="params.subordinate"-->
            <!--&gt;-->
            <!--<el-radio-->
            <!--class="margin-right-10"-->
            <!--v-for="(item, index) in subordinates"-->
            <!--:label="item"-->
            <!--:key="index"-->
            <!--&gt;{{ item }}-->
            <!--</el-radio>-->
            <!--</el-radio-group>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="主办产品经理:" prop="masterPM_id">-->
            <!--<el-select-->
            <!--v-model="params.masterPM_id"-->
            <!--placeholder="请选择:主办产品经理"-->
            <!--style="width: 100%"-->
            <!--:disabled="disabled"-->
            <!--@change="changeMasterPM"-->
            <!--filterable-->
            <!--&gt;-->
            <!--<el-option-->
            <!--v-for="item in masterPMList"-->
            <!--:label="item.name + ` ( ${item._department} ) ( ${item._role} )`"-->
            <!--:value="item.id"-->
            <!--:key="item.id"-->
            <!--&gt;</el-option>-->
            <!--</el-select>-->
            <!--</el-form-item>-->
            <el-form-item label="项目产品经理:" prop="pm_id">
              <el-select v-model="params.pm_id" placeholder="请选择:项目产品经理" style="width: 100%" :disabled="disabled"
                @change="changePM" filterable autocomplete="off">
                <el-option v-for="(item,index) in pmList" :label="item.real_name + ' ( ' + item.department_name + ' - ' + item.status + ' ) '"
                  :value="item.id" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属项目:" prop="project_id">
              <el-select v-model="params.project_id" placeholder="请选择:所属项目" style="width: 100%" :disabled="disabled"
                @change="changeProject" filterable autocomplete="off">
                <el-option v-for="(item,index) in projectList" :label="item._application_name" :value="item.id" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <template v-if="teamList && teamList.length">
              <el-form-item label="任务责任人:" prop="taskOwner_id">
                <el-select v-model="params.taskOwner_id" placeholder="请选择:任务责任人" style="width: 100%" :disabled="disabled"
                  @change="changeTaskOwner" filterable autocomplete="off">
                  <el-option v-for="(item,index) in teamList" :label="item.real_name + ' ( ' + item.department_name + ' - ' + item.status + ' - ' + item._roles + ' ) '"
                    :value="item.account_id" :key="index">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="参与人:">
                <el-select v-model="params.team_member_ids" placeholder="请选择:参与人" style="width: 100%" :disabled="disabled"
                  multiple @change="changeTeamMember" filterable autocomplete="off">
                  <el-option v-for="(item, index) in teamList" :label="item.real_name + ' ( ' + item.department_name + ' - ' + item.status + ' - ' + item._roles + ' ) '"
                    :value="item.account_id" :key="index">
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
            <el-form-item label="流程选择:" prop="workflow_id">
              <el-select v-model="params.workflow_id" placeholder="请选择:流程选择" style="width: 100%" :disabled="disabled"
                filterable autocomplete="off">
                <el-option v-for="(item, index) in flowList" :label="item.title" :value="item.id" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane label="任务风险等级评估" name="2">
        <div class="form-page-full">
          <el-form label-width="460px" :model="params" :rules="rules" ref="refForm">
            <el-card shadow="never" class="default-card">
              <div slot="header" class="clearfix">
                <span class="slot-title">技术类风险识别</span>
              </div>
              <el-form-item label="全选">
                <el-radio-group :disabled="disabled" v-model="value1" @change="changeAll($event, 'technicalRiskIdentification')">
                  <el-radio v-for="(item, index) in ['是', '否', '不确定']" :label="index" :key="index">{{ item }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-for="(item, index) in params.technicalRiskIdentification" :label="item.label" :key="index">
                <el-radio-group v-model="item.value" :disabled="disabled">
                  <el-radio v-for="(it, i) in item.list" :label="it.label" :key="i">{{ it.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-card>
            <el-card shadow="never" class="default-card margin-top-12">
              <div slot="header" class="clearfix">
                <span class="slot-title">非技术风险识别</span>
              </div>
              <el-form-item label="全选">
                <el-radio-group :disabled="disabled" v-model="value2" @change="changeAll($event, 'notTechnicalRiskIdentification')">
                  <el-radio v-for="(item, index) in ['是', '否', '不确定']" :label="index" :key="index">{{ item }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-for="(item, index) in params.notTechnicalRiskIdentification" :label="item.label" :key="index">
                <el-radio-group v-model="item.value" :disabled="disabled">
                  <el-radio v-for="(it, i) in item.list" :label="it.label" :key="i">{{ it.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-card>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="default-tool text-right margin-top-14">
      <el-button type="default" @click="goBack" size="small">
        返回
      </el-button>
      <el-button type="primary" @click="submit" size="small" v-if="!disabled">
        提交
      </el-button>
    </div>
  </el-form>
</template>

<script>
import textUpload from "../../../components/text-upload";
import jixianzongshu from "./基线总数";
import zidonghualv from "./自动化率";
import jixianbili from "./基线安全分类比例图";
import shuxingduibi from "./属性对比图";
import svgFlow from "../../../components/svg-flow";
import workAssigned from "./工作指派";

export default {
  name: "新建基线",
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
    jixianzongshu,
    zidonghualv,
    jixianbili,
    shuxingduibi,
    svgFlow,
    workAssigned
  },
  props: {
    params: {
      type: Object,
      default() {
        return {};
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {},
  data() {
    return {
      value1: "",
      value2: "",
      activeName: "1",
      projectList: [],
      flowList: [], // 流程列表
      rules: {
        task_name: [
          { required: true, message: "请输入:任务名称", trigger: "blur" }
        ],
        requirement: [
          { required: true, message: "请输入:任务编号", trigger: "blur" }
        ],
        subRequirement: [
          { required: true, message: "请输入:子需求编号", trigger: "blur" }
        ],
        subordinate: [
          { required: true, message: "请输入:从属关系", trigger: "blur" }
        ],
        masterPM: [
          { required: true, message: "请输入:主办产品经理", trigger: "blur" }
        ],
        pm_id: [
          { required: true, message: "请输入:项目产品经理", trigger: "blur" }
        ],
        project_id: [
          { required: true, message: "请输入:所属项目", trigger: "blur" }
        ],
        taskOwner_id: [
          { required: true, message: "请输入:任务责任人", trigger: "blur" }
        ],
        workflow_id: [
          { required: true, message: "请输入:流程选择", trigger: "blur" }
        ]
      },
      // 附件
      subordinates: ["主办", "协办"],
      teamList: [],
      pmList: [],
      masterPMList: []
    };
  },
  methods: {
    changeAll(index, key) {
      this.params[key].forEach(item => {
        this.$set(item, "value", item.list[index].label);
      });
    },

    selectTRI() {
      let vars = {};
      vars.key = "selectTri";
      this.$api.ext(vars, this, data => {
        // console.log(data);
        if (data.data) {
          if (
            !this.params.technicalRiskIdentification ||
            !this.params.technicalRiskIdentification.length
          ) {
            this.params.technicalRiskIdentification =
              data.data.technicalRiskIdentification;
          }
          if (
            !this.params.notTechnicalRiskIdentification ||
            !this.params.notTechnicalRiskIdentification.length
          ) {
            this.params.notTechnicalRiskIdentification =
              data.data.notTechnicalRiskIdentification;
          }
        }
      });
    },

    changeMasterPM(id) {
      this.params.masterPM_item = this.masterPMList.find(it => it.id === id);
      this.params.masterPM = this.params.masterPM_item.name;
    },

    changePM(id) {
      this.params.pm_item = this.pmList.find(it => it.id === id);
      this.params.pm = this.params.pm_item.name;
    },

    changeTeamMember(ids) {
      this.params.team_member = [];
      if (ids.length) {
        ids.forEach(id => {
          let team = this.teamList.find(it => it.account_id === id);
          if (team) {
            this.params.team_member.push(team);
          }
        });
      }
    },

    changeTaskOwner(id) {
      this.params.taskOwner_item = this.teamList.find(
        it => it.account_id === id
      );
      this.params.taskOwner = this.params.taskOwner_item.name;
    },

    changeProject(id) {
      this.params.project_item = this.projectList.find(it => it.id === id);
      this.params.project_name = this.params.project_item._application_name;
      this.params.teamName = this.params.project_item.data.project_name;
      let path = this.params.project_item.data.project_item.path;
      let vars = {};
      vars.key = "account_of_department";
      vars.params = {
        conds: ["path HAS_PREFIX " + path],
        dims: [],
        order: ["id", "DESC"]
      };
      let loading = this.$loading({ background: "rgba(0, 0, 0, 0.5)" });
      this.teamList = [];
      this.$set(this.params, "taskOwner_id", "");
      this.$set(this.params, "team_member_ids", []);
      this.$api.get(
        vars,
        this,
        data => {
          // console.log(data);
          if (data.data) {
            this.teamList = data.data;
            this.teamList.forEach(item => {
              if (item.roles && item.roles.length) {
                let _roles = [];
                item.roles.forEach(ro => {
                  _roles.push(ro.name);
                });
                item._roles = _roles.join(",");
              } else {
                item._roles = "";
              }
            });
          }
          loading.close();
        },
        () => {
          loading.close();
        }
      );
    },

    goBack() {
      this.$router.go(-1);
    },

    submit() {
      let params = this.$common.deepClone(this.params);
      this.$refs.refForm.validate(valid => {
        if (valid) {
          let trf = params.technicalRiskIdentification.find(item => {
            return !item.value;
          });
          if (trf) {
            return this.$message.warning("技术类风险识别未填写完毕");
          }
          let ntrf = params.notTechnicalRiskIdentification.find(item => {
            return !item.value;
          });
          if (ntrf) {
            return this.$message.warning("非技术类风险识别未填写完毕");
          }

          // teamMembers
          let teamMembers = [];
          if (params.team_member && params.team_member.length) {
            params.team_member.forEach(item => {
              if (item.roles && item.roles.length) {
                item.roles.forEach(rl => {
                  teamMembers.push({
                    name: item.real_name,
                    user: item.name,
                    role: rl.name,
                    department: item.department_name
                  });
                });
              }
            });
          }
          // console.log(teamMembers)
          teamMembers.push({
            name: this.user.real_name,
            user: this.user.name
          });
          params.teamMembers = teamMembers;
          let roles = ["安全专员", "测试人员", "开发人员", "需求分析师"];
          teamMembers.forEach(item => {
            roles = roles.filter(ro => {
              return ro !== item.role;
            });
          });
          if (roles.length) {
            return this.$message.error(
              `缺少流程需要的角色人员[${roles.join(",")}]`
            );
          }
          this.$emit("on-submit", params);
        } else {
          return this.$message.error("操作失败");
        }
      });
    },

    getProject() {
      return new Promise((resolve, reject) => {
        let vars = {
          key: "projects",
          // not_equal_status: '关闭',
          status: "进行中"
        };
        this.$api.wf(vars, this, data => {
          // console.log(data);
          if (data.data) {
            this.projectList = data.data.data || [];
            this.projectList.forEach(item => {
              item._application_name = item.data.application_name;
            });
          }
          resolve();
        });
      });
    },

    getWorkflow() {
      let vars = {};
      vars.key = "defines";
      this.$api.wf(vars, this, data => {
        // console.log(data);
        if (data) {
          this.flowList = data.data || [];
        }
      });
    },

    getPM() {
      let vars = {};
      vars.key = "account_of_department";
      vars.params = {
        conds: ["role_name IN [产品经理,产品经理助理]"],
        dims: []
      };
      this.$api.get(vars, this, data => {
        if (data) {
          this.pmList = data.data || [];
        }
      });
    },

    getMasterPM() {
      let vars = {};
      vars.key = "account";
      vars.params = {
        conds: [],
        dims: []
      };
      this.$api.get(vars, this, data => {
        // console.log(data);
        if (data) {
          this.masterPMList = data.data || [];
          this.masterPMList.forEach(item => {
            let _role = [];
            if (item.roles) {
              item.roles.forEach(item => {
                _role.push(item.name);
              });
            }
            item._role = _role.join(",");
            let _department = [];
            if (item.departments) {
              item.departments.forEach(item => {
                _department.push(item.name);
              });
            }
            item._department = _department.join(",");
          });
        }
      });
    },

    getManager() {
      let vars = {};
      vars.key = "account_of_department";
      vars.params = {
        conds: [],
        dims: [],
        order: ["id", "DESC"]
      };
      this.$api.get(vars, this, data => {
        // console.log(data);
        if (data.data) {
          this.teamList = data.data;
          this.teamList.forEach(item => {
            if (item.roles && item.roles.length) {
              let _roles = [];
              item.roles.forEach(ro => {
                _roles.push(ro.name);
              });
              item._roles = _roles.join(",");
            } else {
              item._roles = "";
            }
          });
        }
      });
    },

    async init() {
      // console.log(this.params)
      this.getPM();
      this.getMasterPM();
      this.getWorkflow();
      this.getManager();
      await this.getProject();
      this.selectTRI();
    }
  },
  mounted() {
    this.init();
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.form-page-full {
  height: calc(100vh - 55px - 46px - 60px - 42px - 20px);
  overflow-y: auto;
}
</style>
