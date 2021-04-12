<template>
  <el-form label-width="86px"
           :model="params" :rules="rules" ref="refForm">
    <el-card shadow="never" class="default-card">
      <div slot="header" class="clearfix">
        <span class="slot-title">基本信息</span>
      </div>
      <!-- 编辑 -->
      <template v-if="params.id">
        <el-form-item label="创建时间:">
          <el-input
            disabled
            v-model="params.created_time"
          ></el-input>
        </el-form-item>
        <el-form-item label="创建者:">
          <el-input
            disabled
            v-model="params.creator"
          ></el-input>
        </el-form-item>
        <el-form-item label="基线编码:">
          <el-input
            disabled
            v-model="params.number"
          ></el-input>
        </el-form-item>
      </template>
      <el-form-item label="基线名称:" prop="name">
        <el-input
          type="text"
          v-model="params.name"
          :disabled="disabled"
          placeholder="基线名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="版本号:" prop="version">
        <el-input
          type="text"
          v-model="params.version"
          :disabled="disabled"
          placeholder="版本号"
        ></el-input>
      </el-form-item>
      <el-form-item label="安全类型:" prop="security_scene_id">
        <el-select
          v-model="params.security_scene_id"
          placeholder="请选择:安全类型"
          style="width: 100%"
          :disabled="disabled"
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
      <el-form-item label="风险等级:">
        <el-radio-group v-model="params.risk_level">
          <el-radio
            v-for="(item, index) in riskLevel"
            :label="item"
            :key="index"
            :disabled="disabled"
          >{{ item }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!--<el-form-item label="是否自动化:">-->
      <!--<el-radio-group v-model="params.automation">-->
      <!--<el-radio-->
      <!--v-for="(item, index) in yesorno"-->
      <!--:label="item"-->
      <!--:key="index"-->
      <!--:disabled="disabled"-->
      <!--&gt;{{ item }}-->
      <!--</el-radio>-->
      <!--</el-radio-group>-->
      <!--</el-form-item>-->
      <el-form-item label="内容描述:">
        <markdown
          :height="300"
          :disabled="disabled"
          v-model="params.security_description"
        ></markdown>
      </el-form-item>
      <el-form-item label="风险描述:">
        <markdown
          :height="300"
          :disabled="disabled"
          v-model="params.risk_description"
        ></markdown>
      </el-form-item>
    </el-card>
    <el-card shadow="never" class="default-card margin-top-14">
      <div slot="header" class="clearfix">
        <span class="slot-title">安全及测试</span>
      </div>
      <template v-for="(item, index) in defenseTest">
        <el-form-item label="软件平台:">
          <el-select
            v-model="item.software_plat"
            placeholder="请选择:软件平台"
            style="width: 100%"
            multiple
            :disabled="disabled"
            @change="change"
            filterable
            autocomplete="off"
          >
            <el-option
              v-for="item in softwarePlatList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
              :disabled="item.$active"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="安全设计:">
          <markdown
            :height="300"
            :disabled="disabled"
            v-model="item.safety_design"
          ></markdown>
        </el-form-item>
        <el-form-item label="测试条件:">
          <markdown
            :height="300"
            :disabled="disabled"
            v-model="item.test_conditions"
          ></markdown>
        </el-form-item>
        <el-form-item label="测试步骤:">
          <markdown
            :height="300"
            :disabled="disabled"
            v-model="item.test_procedure"
          ></markdown>
        </el-form-item>
        <el-form-item label="预期结果:">
          <markdown
            :height="300"
            :disabled="disabled"
            v-model="item.expected_results"
          ></markdown>
        </el-form-item>
        <el-form-item label="测试工具:">
          <el-select
            v-model="item.tool"
            placeholder="请选择:测试工具"
            style="width: 100%"
            multiple
            :disabled="disabled"
            filterable
            autocomplete="off"
          >
            <el-option
              v-for="item in toolList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </template>
    </el-card>
    <el-card shadow="never" class="default-card margin-top-14">
      <div slot="header" class="clearfix">
        <span class="slot-title">属性标签</span>
      </div>
      <div v-show="!disabled">
        <div
          class="dashed-btn"
          @click="addAttribute"
        >
          <img src="../../../../../img/tianjia_biaoqian.png">
          标签
        </div>
      </div>
      <template v-for="(item, index) in propertyLabel">
        <el-form-item
          class="tags-item margin-top-20"
          v-if="item.tags && item.tags.length > 0" :label="item.label" :key="index">
          <el-tag
            v-for="(tag, i) in item.tags"
            type="info"
            :key="tag.name + '' + i"
            :closable="!disabled"
            :disable-transitions="false"
            @close="handleClose(index, i)">
            {{ tag.name }}
          </el-tag>
        </el-form-item>
      </template>
    </el-card>
    <el-card shadow="never" class="default-card margin-top-14">
      <div slot="header" class="clearfix">
        <span class="slot-title">基线关联</span>
      </div>
      <el-form-item label="参考资料:">
        <el-select
          v-model="datas"
          placeholder="请选择:参考资料"
          style="width: 100%"
          multiple
          filterable
          autocomplete="off"
          :disabled="disabled"
        >
          <el-option
            v-for="item in dataList"
            :label="item.title"
            :value="item.id"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联漏洞:">
        <el-select
          v-model="loopholes"
          placeholder="请选择:关联漏洞"
          style="width: 100%"
          multiple
          filterable
          autocomplete="off"
          :disabled="disabled"
        >
          <el-option
            v-for="item in loopholeList"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="参考组件:">
        <el-select
          v-model="components"
          placeholder="请选择:参考组件"
          style="width: 100%"
          multiple
          filterable
          autocomplete="off"
          :disabled="disabled"
        >
          <el-option
            v-for="item in componentList"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-card>
    <el-card shadow="never" class="default-card margin-top-14">
      <div slot="header" class="clearfix">
        <span class="slot-title">检测规则</span>
        <div class="float-right" v-if="!disabled">
          <el-button
            size="mini"
            type="primary"
            @click="addTab"
          >
            新增检测系统
          </el-button>
        </div>
      </div>
      <el-tabs
        v-model="editableTabsValue"
        type="border-card"
        closable
        @tab-remove="removeTab"
      >
        <el-tab-pane
          v-for="(item, index) in editableTabs"
          :label="item.label"
          :name="item.name"
          :key="item.name"
        >
          <el-form-item label="检测系统:">
            <el-select
              v-model="item.external_system_id"
              placeholder="请选择:检测系统"
              style="width: 100%"
              :disabled="disabled"
              @change="changeExternalSystem($event, index)"
              filterable
              autocomplete="off"
            >
              <el-option
                v-for="it in externalSystemList"
                :label="it.name"
                :value="it.id"
                :key="it.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="检测条件:">
            <el-radio-group v-model="item.logic">
              <el-radio
                v-for="(it, i) in logics"
                :label="it.val"
                :key="i"
                :disabled="disabled"
              >{{ it.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="检测规则:">
            <el-select
              v-model="item.detection_rule_ids"
              placeholder="请选择:检测规则"
              style="width: 100%"
              multiple
              :disabled="disabled"
              filterable
              autocomplete="off"
            >
              <el-option
                v-for="it in item.rulesList"
                :label="it.name"
                :value="it.id"
                :key="it.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 选择属性 -->
    <attribute-popup
      title="属性标签"
      @on-submit="attributeSubmit"
      :visible.sync="attributeVisible"
    ></attribute-popup>
    <div class="margin-top-10 text-right">
      <el-button
        type="default"
        @click="goback"
        size="small"
      >
        返回
      </el-button>
      <el-button
        type="primary"
        @click="submit"
        size="small"
        v-show="!disabled"
      >
        确认
      </el-button>
    </div>
  </el-form>
</template>

<script>
  import mixins from '../../components/mixins'
  import attributePopup from './attribute-popup'
  import ruleAttributePopup from './rule-attribute-popup'
  import Markdown from '../../../components/markDown/simple'

  function getAncestor(o) {
    if (o.parent) {
      return getAncestor(o.parent)
    }
    return o
  }

  export default {
    name: "新建基线",
    inject: {
      user: {
        from: 'user',
        default: () => {
          return {}
        }
      }
    },
    components: {
      attributePopup,
      ruleAttributePopup,
      Markdown,
    },
    mixins: [
      mixins,
    ],
    props: {
      params: {
        type: Object,
        default() {
          return {}
        }
      },
      disabled: {
        type: Boolean,
        default: false,
      }
    },
    computed: {
      disAddRow() {
        return this.computedDifs();
      }
    },
    data() {
      return {
        selection: [],
        tool_id: '',
        ruleAttributeVisible: false,
        checkTools: [],
        logic: '',
        logics: [
          {
            val: 1,
            label: 'AND',
          },
          {
            val: 2,
            label: 'OR',
          },
        ],
        rules: {
          name: [{required: true, message: '请输入:名称', trigger: 'blur'}],
          version: [{required: true, message: '请输入:版本号', trigger: 'blur'}],
          security_scene_id: [{required: true, message: '请选择:安全类型', trigger: 'change'}],
        },
        propertyLabel: [],
        attributeVisible: false,
        securitySceneList: [],
        softwarePlatList: [],
        toolList: [],
        defenseTest: [
          {
            tool: [],
            software_plat: [],
            defensive_measures: '',
            test_methods: '',
            test_conditions: '',
            test_procedure: '',
            expected_results: '',
            safety_design: '',
          }
        ],
        datas: [],
        dataList: [],
        loopholes: [],
        loopholeList: [],
        components: [],
        componentList: [],
        externalSystemList: [],
        // tabs
        editableTabsValue: '1',
        editableTabs: [
          {
            label: '',
            name: '1',
            logic: 1,
            detection_rule_ids: [],
            rulesList: [],
          },
        ],
      }
    },
    methods: {
      changeExternalSystem(id, index) {
        let es = this.externalSystemList.find(es => es.id === id);
        let it = this.editableTabs[index];
        // console.log(es);
        // console.log(it);
        it.label = es.name;
        this.getDetectionRule(it, es.id);
      },

      getDetectionRule(it, id) {
        let vars = {};
        vars.key = 'detection_rule';
        vars.params = {
          conds: [
            'external_system_id = ' + id,
          ],
          dims: [],
          order: ['id', 'DESC'],
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data) {
            it.rulesList = data.data || [];
            it.detection_rule_ids = [];
          }
        });
      },

      addTab() {
        let newTabName = (+this.editableTabsValue) + 1 + '';
        this.editableTabs.push({
          label: '',
          name: newTabName,
          logic: 1,
          detection_rule_ids: [],
          rulesList: [],
        });
        this.editableTabsValue = newTabName;
      },

      removeTab(targetName) {
        this.$confirm('确认删除吗?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
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
        }).catch(() => {

        });
      },

      changeTool() {
        this.selection = [];
      },

      ruleAttributeSubmit(selection) {
        let newArr = this.selection.concat(selection);
        this.selection = [];
        newArr.forEach(item => {
          if (!this.selection.find(se => se.id === item.id)) {
            this.selection.push(item)
          }
        });
      },

      ruleAddAttribute() {
        this.ruleAttributeVisible = true
      },

      ruleHandleClose(i) {
        this.selection.splice(i, 1);
        this.$forceUpdate();
      },

      computedDifs() {
        if (this.defenseTest.length && this.softwarePlatList.length) {
          this.softwarePlatList.forEach(item => {
            item.$active = false;
            this.defenseTest.forEach(dit => {
              if (dit.software_plat.indexOf(item.id) !== -1) {
                item.$active = true;
              }
            });
          });
          let num = 0;
          this.softwarePlatList.forEach(item => {
            if (item.$active) {
              num++;
            }
          });
          return num >= this.softwarePlatList.length
        }
        return true
      },

      attributeSubmit(list) {
        // console.log(list);
        list.forEach(item => {
          let ancestor = getAncestor(item);
          // console.log(ancestor);
          this.propertyLabel.forEach(at => {
            if (at.label === ancestor.label) {
              let res = at.tags.some(tg => {
                if (tg.id === item.data.id) {
                  return true
                }
              });
              if (!res) {
                at.tags.push(item.data)
              }
            }
          })
        });
      },

      addAttribute() {
        this.attributeVisible = true
      },

      handleClose(pi, ci) {
        this.propertyLabel[pi].tags.splice(ci, 1);
        this.$forceUpdate();
      },

      addRow() {
        this.defenseTest.push({
          software_plat: [],
          tool: [],
          defensive_measures: '',
          test_methods: '',
          test_conditions: '',
          test_procedure: '',
          expected_results: '',
          safety_design: '',
        })
      },

      delRow(index) {
        this.defenseTest.splice(index, 1);
        this.$forceUpdate();
      },

      goBack() {
        this.$router.go(-1)
      },

      goback() {
        this.$emit('go-back')
      },

      submit() {
        let params = this.$common.deepClone(this.params);
        this.$refs.refForm.validate((valid) => {
          if (valid) {
            params.defense_test = [];
            if (this.defenseTest && this.defenseTest.length) {
              this.defenseTest.forEach(item => {
                let obj = {};
                obj.defensive_measures = item.defensive_measures;
                obj.test_methods = item.test_methods;
                obj.test_conditions = item.test_conditions;
                obj.test_procedure = item.test_procedure;
                obj.expected_results = item.expected_results;
                obj.safety_design = item.safety_design;
                if (item.software_plat) {
                  obj.soft_plats = [];
                  item.software_plat.forEach(sp => {
                    obj.soft_plats.push({
                      software_platform_id: sp
                    })
                  });
                }
                if (item.tool) {
                  obj.tool = [];
                  item.tool.forEach(to => {
                    obj.tool.push({
                      tool_id: to
                    })
                  });
                }
                params.defense_test.push(obj)
              });
            }
            let property_label = [];
            this.propertyLabel.forEach(item => {
              if (item.tags && item.tags.length) {
                item.tags.forEach(it => {
                  property_label.push({
                    property_label_id: it.id
                  })
                })
              }
            });
            params.property_label = property_label;
            let data_libraries = [];
            this.datas.forEach(item => {
              data_libraries.push({
                data_library_id: item
              })
            });
            params.data_libraries = data_libraries;
            let loopholes = [];
            this.loopholes.forEach(item => {
              loopholes.push({
                loophole_id: item
              })
            });
            params.loopholes = loopholes;
            let security_components = [];
            this.components.forEach(item => {
              security_components.push({
                security_component_id: item
              })
            });
            params.security_components = security_components;
            if (this.selection && this.selection.length) {
              params.check_tools = [];
              this.selection.forEach(item => {
                params.check_tools.push({
                  check_tool_rule_id: item.id,
                  logic: this.logic
                })
              })
            }

            // 规则
            if (this.editableTabs && this.editableTabs.length) {
              let rules = [];
              this.editableTabs.forEach(item => {
                if (item.detection_rule_ids) {
                  item.detection_rule_ids.forEach(id => {
                    rules.push({
                      external_system_id: item.external_system_id,
                      logic: item.logic,
                      detection_rule_id: id,
                    })
                  });
                }
              });
              params.rules = rules;
            }

            if (params.id) {
              delete params.id
            }
            this.$emit('on-submit', params);
          } else {
            return this.$message.error('操作失败');
          }
        });
      },

      getSecurityScene() {
        let vars = {};
        vars.key = 'security_scene';
        vars.params = {
          conds: [
            'latest = true',
            'customer_id = ' + this.user.id,
          ],
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

      getSoftwarePlatform() {
        return new Promise((resolve, reject) => {
          let vars = {};
          vars.key = 'software_platform';
          vars.params = {
            conds: [
              'latest = true',
              'customer_id = ' + this.user.id,
            ],
            dims: [],
            order: ['id', 'DESC'],
          };
          this.$api.get(vars, this, data => {
            // console.log(data);
            if (data) {
              this.softwarePlatList = data.data || [];
              resolve();
            }
          });
        })
      },

      getTool() {
        return new Promise((resolve, reject) => {
          let vars = {};
          vars.key = 'tool';
          vars.params = {
            conds: [
              'latest = true',
              'customer_id = ' + this.user.id,
            ],
            dims: [],
            order: ['id', 'DESC'],
          };
          this.$api.get(vars, this, data => {
            // console.log(data);
            if (data) {
              this.toolList = data.data || [];
            }
            resolve();
          });
        })
      },

      getPropertyLabel() {
        let vars = {};
        vars.key = 'property_label';
        vars.params = {
          conds: [
            'parent_id = 0'
          ],
          dims: [],
          order: ['id', 'DESC'],
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data) {
            this.propertyLabel = data.data || [];
            this.propertyLabel.forEach(item => {
              item.tags = [];
              item.label = item.name
            });
            // console.log(this.propertyLabel)
            if (this.params.id && this.params.property_labels) {
              this.params.property_labels.forEach(it => {
                let id = +it.path.split('.')[0];
                let label = this.propertyLabel.find(lb => {
                  if (lb.path !== it.path) {
                    return lb.id === id
                  } else {
                    return false
                  }
                });
                if (label) {
                  label.tags.push(it);
                }
              })
            }
          }
        });
      },

      getDatas() {
        let vars = {};
        vars.key = 'data_library';
        vars.params = {
          conds: [
            'latest = true',
            'customer_id = ' + this.user.id,
          ],
          dims: [],
          order: ['id', 'DESC'],
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data) {
            this.dataList = data.data || [];
            if (this.params.data_libraries) {
              this.datas = [];
              this.params.data_libraries.forEach(item => {
                this.datas.push(item.id)
              });
            }
          }
        });
      },

      getLoopholes() {
        let vars = {};
        vars.key = 'loophole';
        vars.params = {
          conds: [
            'latest = true',
            'customer_id = ' + this.user.id,
          ],
          dims: [],
          order: ['id', 'DESC'],
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data) {
            this.loopholeList = data.data || [];
            if (this.params.loopholes) {
              this.loopholes = [];
              this.params.loopholes.forEach(item => {
                this.loopholes.push(item.id)
              });
            }
          }
        });
      },

      getComponents() {
        let vars = {};
        vars.key = 'security_component';
        vars.params = {
          conds: [
            'latest = true',
            'customer_id = ' + this.user.id,
          ],
          dims: [],
          order: ['id', 'DESC'],
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data) {
            this.componentList = data.data || [];
            if (this.params.security_components) {
              this.components = [];
              this.params.security_components.forEach(item => {
                this.components.push(item.id)
              });
            }
          }
        });
      },

      getCheckTools() {
        let vars = {};
        vars.key = 'check_tool';
        vars.params = {
          conds: [],
          dims: [],
          order: ['id', 'DESC'],
        };
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data) {
            this.checkTools = data.data || [];
            if (this.params.check_tools && this.params.check_tools[0]) {
              this.tool_id = this.params.check_tools[0].tool_id;
              this.logic = this.params.check_tools[0].logic;
              this.selection = this.params.check_tools;
            }
          }
        });
      },

      getExternalSystem() {
        return new Promise((resolve, reject) => {
          let vars = {};
          vars.key = 'external_system';
          vars.params = {
            conds: [],
            dims: [],
            order: ['id', 'DESC'],
          };
          this.$api.get(vars, this, data => {
            // console.log(data);
            if (data) {
              this.externalSystemList = data.data || [];
            }
            resolve()
          });
        })
      },

      getTableRules(ru) {
        return new Promise((resolve, reject) => {
          let tabs = this.editableTabs.find(ta => {
            return ta.external_system_id === ru.external_system_id
          });
          if (tabs) {
            tabs.detection_rule_ids.push(ru.detection_rule_id);
            resolve();
          } else {
            let vars = {};
            vars.key = 'detection_rule';
            vars.params = {
              conds: [
                'external_system_id = ' + ru.external_system_id,
              ],
              dims: [],
              order: ['id', 'DESC'],
            };
            this.$api.get(vars, this, data => {
              // console.log(data);
              if (data) {
                let rulesList = data.data || [];
                this.editableTabs.push({
                  external_system_id: ru.external_system_id,
                  label: ru.external_system,
                  name: this.editableTabs.length + 1 + '',
                  logic: ru.logic,
                  detection_rule_ids: [ru.detection_rule_id],
                  rulesList,
                });
              }
              resolve();
            })
          }
        })
      },

      async init() {

        this.getSecurityScene();
        this.getPropertyLabel();
        this.getDatas();
        this.getLoopholes();
        this.getComponents();
        this.getCheckTools();

        await this.getExternalSystem();

        if (this.params.rules) {
          this.editableTabs = [];
          for (let i = 0; i < this.params.rules.length; i++) {
            let ru = this.params.rules[i];
            await this.getTableRules(ru);
          }
        }

        await this.getSoftwarePlatform();
        await this.getTool();

        if (this.params.id && this.params.defense_test) {
          this.defenseTest = [];
          this.params.defense_test.forEach(item => {
            if (item.soft_plats) {
              this.$set(item, 'software_plat', []);
              item.soft_plats.forEach(sp => {
                item.software_plat.push(sp.id)
              });
            }
            if (item.tools) {
              this.$set(item, 'tool', []);
              item.tools.forEach(sp => {
                item.tool.push(sp.id)
              });
            }
            this.defenseTest.push(item)
          });
        }
        this.$nextTick(() => {
          let dft_pg = document.getElementsByClassName('default-page');
          if (dft_pg && dft_pg[0]) {
            dft_pg[0].scrollTop = 0
          }
        })
        // console.log(this.params);
        // console.log(this.editableTabs);
        // console.log(this.editableTabsValue);
      },

      clearDataFn() { // 清除选择框内容
        this.propertyLabel.forEach(item => {
          item.tags = [];
        });
        this.$refs.refForm.resetFields();
      },

      change() {
        this.computedDifs();
        this.$forceUpdate();
      },
    },
    mounted() {
      this.init();
    },
    watch: {
      clearData: {
        handler(val) {
          // console.log(val)
          if (val) {
            this.clearDataFn();
            this.$emit('clear-finish');
          }
        },
        deep: true
      },
    }
  }
</script>

<style lang="scss" scoped>
  .dashed-btn {
    width: 80px;
    height: 32px;
    line-height: 30px;
    background: rgba(245, 246, 250, 1);
    border-radius: 4px;
    border: 1px dashed rgba(0, 197, 212, 1);
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 197, 212, 1);
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    > img {
      padding-right: 5px;
    }

  }
</style>
