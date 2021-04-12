<template>
  <el-card shadow="never" class="default-card">
    <div slot="header" class="clearfix">
      <span class="slot-title">工单面板</span>
    </div>
    <el-row :gutter="14">
      <el-col
        v-for="(item, index) in panelData"
        :span="6"
        :key="index"
      >
        <panel-todo
          @handleSetLineChartData="activePanel(item)"
          :panelData="item"
        ></panel-todo>
      </el-col>
    </el-row>
    <el-form label-width="96px" class="margin-top-14">
      <el-form-item label="参考分组:">
        <el-tag
          class="margin-left-10"
          v-for="(item, index) in editableTabs"
          :key="index"
          :effect="editableTabsValue === item.name ? 'dark':'plain'"
        >
          <span
            class="tag-span"
            @click.stop="editableTabsValue = item.name"
          >
            {{ item.group_name }}
          </span>
        </el-tag>
      </el-form-item>
    </el-form>
    <div
      class="margin-top-5"
      v-for="(item, index) in editableTabs"
      :label="item.group_name"
      :name="item.name"
      :key="item.name"
      v-show="item.name === editableTabsValue"
    >
      <el-row :gutter="14">
        <el-col :span="12">
          <div class="border">
            <edit-table
              :tableColumn="tableColumn"
              :tableData="activeTableData"
              :tableOptions="tableOptions"
              @on-view="onView"
              @on-edit="onEdit"
              @on-filter-name-active="onFilterNameActive"
              @row-click="rowClick($event, item)"
            ></edit-table>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="border">
            <el-form label-width="90px"
                     v-if="item.rowParams">
              <el-form-item label="基线名称:">
                <el-input
                  v-model="item.rowParams.name"
                  readonly
                ></el-input>
              </el-form-item>
              <el-form-item label="安全类型:">
                <el-input
                  v-model="item.rowParams.security_scene"
                  readonly
                ></el-input>
              </el-form-item>
              <el-form-item label="内容描述:">
                <markdown
                  :disabled="true"
                  :isFull="true"
                  v-model="item.rowParams.security_description"
                >
                </markdown>
              </el-form-item>
              <el-form-item label="风险等级:">
                <el-input
                  v-model="item.rowParams.risk_level"
                  readonly
                ></el-input>
              </el-form-item>
              <el-form-item label="风险描述:">
                <markdown
                  :disabled="true"
                  :isFull="true"
                  v-model="item.rowParams.risk_description"
                >
                </markdown>
              </el-form-item>
              <el-form-item label="安全设计:">
                <markdown
                  :disabled="true"
                  :isFull="true"
                  v-model="item.rowParams._safety_design"
                >
                </markdown>
              </el-form-item>
              <el-form-item label="测试条件:">
                <markdown
                  :disabled="true"
                  :isFull="true"
                  v-model="item.rowParams._test_conditions"
                >
                </markdown>
              </el-form-item>
              <el-form-item label="测试步骤:">
                <markdown
                  :disabled="true"
                  :isFull="true"
                  v-model="item.rowParams._test_procedure"
                >
                </markdown>
              </el-form-item>
              <el-form-item label="预期结果:">
                <markdown
                  :disabled="true"
                  :isFull="true"
                  v-model="item.rowParams._expected_results"
                >
                </markdown>
              </el-form-item>
              <el-form-item label="结果描述:">
                <el-input
                  v-model="item.rowParams.result_des"
                  autosize
                  type="textarea"
                  resize="none"
                  :readonly="readonly"
                ></el-input>
              </el-form-item>
              <el-form-item label="检测结论:">
                <el-radio-group
                  v-model="item.rowParams.result"
                  :disabled="disabled"
                  @change="changeResult(item.rowParams)"
                >
                  <el-radio
                    v-for="(item, index) in results"
                    :label="item"
                    :key="index"
                  >{{ item }}
                  </el-radio>
                  <template v-if="item.rowParams.autoCheck">
                    <el-button
                      class="float-right"
                      type="primary"
                      @click="viewAutoDetails(item.rowParams)"
                      size="small"
                    >
                      查看检测报告
                    </el-button>
                  </template>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="附件:">
                <text-upload
                  :disabled="disabled"
                  :modal="false"
                  :defaultFileList="item.rowParams.files"
                  @update:successFileList="val => item.rowParams.files = val"
                  :maxImg="20"
                ></text-upload>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-form
      class="margin-top-20"
      label-width="120px"
      :model="params" :rules="rules" ref="refForm">
      <el-form-item label="检测结果:" prop="testSummary">
        <el-radio-group
          v-model="params.testSummary"
          :disabled="disabled"
        >
          <el-radio
            class="margin-right-10"
            v-for="(item, index) in statusList"
            :label="item"
            :key="index"
          >{{ item }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="检测结论:" prop="testResult">
        <el-input
          v-model="params.testResult"
          autosize
          type="textarea"
          :disabled="disabled"
          resize="none"
        ></el-input>
      </el-form-item>
      <el-form-item label="检测报告:">
        <text-upload
          :modal="false"
          :defaultFileList="filesDefaultFileList"
          @update:successFileList="val => filesFileList = val"
          :maxImg="20"
        ></text-upload>
      </el-form-item>
      <div class="margin-top-10 text-right" v-show="!readonly">
        <el-button
          type="default"
          @click="goBack"
          size="small"
        >
          返回
        </el-button>
        <el-button
          type="primary"
          @click="save"
          size="small"
          v-if="!disabled"
        >
          保存
        </el-button>
        <template
          v-if="params.testSummary === '通过'"
        >
          <el-button
            type="primary"
            @click="submit"
            size="small"
            v-if="!disabled"
          >
            确认完成
          </el-button>
        </template>
        <template
          v-else-if="params.testSummary === '不通过'"
        >
          <el-button
            type="primary"
            @click="jumpToNode"
            size="small"
            v-if="!disabled"
          >
            确认驳回
          </el-button>
        </template>
      </div>
    </el-form>
    <el-dialog
      title="检测报告详情"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      width="65%"
      :close-on-click-modal="false"
      class="dialog-default"
    >
      <el-card
        shadow="never"
        class="default-card margin-top-14"
        v-for="(item, index) in dialogDetails"
        :key="index"
      >
        <div slot="header" class="clearfix">
          <span class="slot-title">{{ item.title }}</span>
        </div>
        <table
          cellpadding="0"
          cellspacing="0"
          class="infotable"
        >
          <tbody>
          <tr
            v-for="(it, i) in item.detail"
            :key="i"
          >
            <th width="22%">{{ it.description }}</th>
            <td width="78%">
              <div v-html="it.text"></div>
            </td>
          </tr>
          </tbody>
        </table>
      </el-card>
      <div class="margin-top-10 text-right">
        <el-button
          type="default"
          @click="dialogVisible = false"
          size="small"
        >
          关闭
        </el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
  import textUpload from '../../../components/text-upload'
  import editTable from '../../../components/edit-table'
  import Markdown from '../../../components/markDown/simple'
  import panelTodo from '../components/panel-todo'

  import tongguo from '../../../../../img/icons/test/tongguo.png'
  import tongguo_active from '../../../../../img/icons/test/tongguo_active.png'
  import weitongguo from '../../../../../img/icons/test/weitongguo.png'
  import weitongguo_active from '../../../../../img/icons/test/weitongguo_active.png'
  import weizhixing from '../../../../../img/icons/test/weizhixing.png'
  import weizhixing_active from '../../../../../img/icons/test/weizhixing_active.png'
  import weicaozuo from '../../../../../img/icons/test/weicaozuo.png'
  import weicaozuo_active from '../../../../../img/icons/test/weicaozuo_active.png'

  export default {
    name: "test",
    inject: {
      user: {
        from: 'user',
        default: () => {
          return {}
        }
      }
    },
    components: {
      textUpload,
      editTable,
      Markdown,
      panelTodo,
    },
    props: {
      disabled: {
        type: Boolean,
        default: false,
      },
      workflow_id: {
        type: Number,
        default: 0,
      },
      node_name: {
        type: String,
        default: '',
      },
      task_id: {
        type: Number,
        default: 0,
      },
      data_saved: {
        type: Boolean,
        default: false,
      },
      readonly: false
    },
    computed: {
      activeTableData() {
        let newArr = [];
        if (this.editableTabs && this.editableTabs.length) {
          let activeArr = this.editableTabs.find(tb => tb.name === this.editableTabsValue);
          if (activeArr && activeArr.baselines) {
            newArr = activeArr.baselines.filter(bs => {
              if (this.filterTableData && this.filterTableData._active) {
                if (this.filterTableData.title === '未操作') {
                  return !bs.result
                } else {
                  return bs.result === this.filterTableData.title
                }
              } else {
                return true
              }
            })
          }
        }
        return newArr;
      },
    },
    data() {
      return {
        statusList: ['通过', '不通过'],
        rules: {
          testSummary: [{required: true, message: '请选择:检测结果', trigger: 'blur'}],
          testResult: [{required: true, message: '请输入:检测结论', trigger: 'blur'}],
        },
        // 其他附件
        filesDefaultFileList: [],
        filesFileList: [],
        params: {},
        // table
        tableColumn: [
          {
            prop: 'number',
            label: '基线编号',
            align: 'center',
            minWidth: '10',
          },
          {
            prop: 'name',
            label: '基线名称',
            align: 'center',
            minWidth: '18',
          },
          {
            prop: 'risk_level',
            label: '风险等级',
            align: 'center',
            minWidth: '8',
          },
          {
            prop: '_result',
            label: '执行结果',
            align: 'center',
            minWidth: '8',
            isRender: true,
          },
          // {
          //   prop: 'status',
          //   label: '状态',
          //   align: 'center',
          //   minWidth: '8',
          //   filters: [
          //     {value: '已启用', circleColor: '#00C5D4',},
          //     {value: '已过时', circleColor: '#FFE027',},
          //     {value: '开发中', circleColor: '#469CFF',},
          //     {value: '已作废', circleColor: '#FB731B',}
          //   ],
          //   isStatus: true
          // },
          // {
          //   prop: 'status',
          //   label: '状态',
          //   filters: [
          //     {text: '正常', value: '正常'},
          //     {text: '禁止', value: '禁止'}
          //   ],
          //   tagSuccessVal: '正常',
          //   scope: true
          // },
        ],
        tableData: [],
        tableOptions: {
          operationWidth: '120',
          // height: 'calc(100vh - 120px)',
          height: '553px',
          sequence: false,
          selection: false,
          loading: false,
          active: [
            // 'view',
            // 'edit',
            // 'delete',
          ],
          filterNameActive: [],
        },
        pages: 1,
        lines: 10,
        total: 0,
        results: [
          '通过',
          '不通过',
          '未执行',
        ],
        // editable
        editableTabsValue: '1',
        editableTabs: [],
        // tongji
        panelData: [
          {
            val: 0,
            title: '通过',
            duration: 1200,
            className: 'color-e5f1ff',
            decimals: 0,
            url: tongguo,
            active_url: tongguo_active,
          },
          {
            val: 0,
            title: '不通过',
            duration: 1400,
            className: 'color-ffe4e4',
            decimals: 0,
            url: weitongguo,
            active_url: weitongguo_active,
          },
          {
            val: 0,
            title: '未执行',
            duration: 1600,
            className: 'color-d5f4fd',
            decimals: 0,
            url: weizhixing,
            active_url: weizhixing_active,
          },
          {
            val: 0,
            title: '未操作',
            duration: 1800,
            className: 'color-feefd4',
            decimals: 0,
            url: weicaozuo,
            active_url: weicaozuo_active,
          },
        ],
        filterTableData: {},
        // 调查报告
        dialogVisible: false,
        dialogDetails: [],
      }
    },
    methods: {

      viewAutoDetails(params) {
        // console.log(params.details);
        this.dialogDetails = params.details;
        if (this.dialogDetails) {
          this.dialogVisible = true;
        }
      },

      statistical() {
        this.panelData.forEach(item => {
          item.val = 0;
        });
        this.editableTabs.forEach(item => {
          if (item.baselines && item.baselines.length) {
            item.baselines.forEach(bs => {
              if (bs.result === '通过') {
                this.panelData[0].val++;
              } else if (bs.result === '不通过') {
                this.panelData[1].val++;
              } else if (bs.result === '未执行') {
                this.panelData[2].val++;
              } else {
                this.panelData[3].val++;
              }
            })
          }
        });
      },

      activePanel(item) {
        this.panelData.forEach(panel => {
          if (item.title !== panel.title) {
            this.$set(panel, '_active', false);
          }
        });
        this.$set(item, '_active', !item._active);
        this.filterTableData = item;
      },

      changeResult(item) {
        this.setItemResult(item);
        this.statistical();
      },

      rowClick(row, rowItem) {
        // console.log(row);
        rowItem.rowParams = row;
        if (rowItem.rowParams.defense_test && rowItem.rowParams.defense_test.length) {
          rowItem.rowParams.defense_test.forEach(item => {
            rowItem.rowParams._test_methods = item.test_methods;
            rowItem.rowParams._safety_design = item.safety_design;
            rowItem.rowParams._test_conditions = item.test_conditions;
            rowItem.rowParams._test_procedure = item.test_procedure;
            rowItem.rowParams._expected_results = item.expected_results;
          });
        }
        rowItem.rowParams.files = rowItem.rowParams.files || [];
      },

      onView(params) {
        console.log(params)
      },

      onEdit(params) {
        console.log(params);
      },

      onFilterNameActive(params) {
        console.log(params)
      },

      goBack() {
        this.$router.go(-1)
      },

      save() {
        let params = this.$common.deepClone(this.params);
        params.testReport = this.$common.deepClone(this.filesFileList);
        let baselines = [];
        if (this.editableTabs && this.editableTabs.length) {
          this.editableTabs.forEach(item => {
            if (item.baselines && item.baselines.length) {
              item.baselines.forEach(bs => {
                bs.group = item.group_name;
                baselines.push(bs)
              })
            }
          });
        }
        params.baselines = baselines;
        this.$emit('on-save', params);
      },

      submit() {
        let params = this.$common.deepClone(this.params);
        this.$refs.refForm.validate((valid) => {
          if (valid) {
            params.testReport = this.$common.deepClone(this.filesFileList);
            let baselines = [];
            if (this.editableTabs && this.editableTabs.length) {
              this.editableTabs.forEach(item => {
                if (item.baselines && item.baselines.length) {
                  item.baselines.forEach(bs => {
                    bs.group = item.group_name;
                    baselines.push(bs)
                  })
                }
              });
            }
            for (let i = 0; i < baselines.length; i++) {
              let baseline = baselines[i];
              if (!baseline.result) {
                return this.$message.error('您有一条基线未选择检测结论!');
              }
            }
            params.baselines = baselines;
            this.$emit('on-submit', params);
          } else {
            return this.$message.error('操作失败');
          }
        });
      },

      jumpToNode() {
        let params = this.$common.deepClone(this.params);
        this.$refs.refForm.validate((valid) => {
          if (valid) {
            params.testReport = this.$common.deepClone(this.filesFileList);
            let baselines = [];
            if (this.editableTabs && this.editableTabs.length) {
              this.editableTabs.forEach(item => {
                if (item.baselines && item.baselines.length) {
                  item.baselines.forEach(bs => {
                    bs.group = item.group_name;
                    baselines.push(bs)
                  })
                }
              });
            }
            params.baselines = baselines;

            let vars = {
              task_id: this.task_id,
              actor: this.user.name,
              workflow_id: this.workflow_id,
              node_name: 'development',
              data: params,
            };
            vars.key = 'submitTaskAndJump';
            this.$api.wf(vars, this, () => {
              this.$message({
                type: 'success',
                message: '操作成功'
              });
              this.goBack();
            });
          } else {
            return this.$message.error('操作失败');
          }
        });
      },

      getTaskData() {
        let vars = {
          task_id: this.task_id,
          key: 'taskData',
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
          key: 'view',
          name: 'taskData',
        };
        this.$api.wf(vars, this, data => {
          if (data && data.data) {
            this.setData(data.data);
          }
        });
      },

      setItemResult(item) {
        if (item.result) {
          if (item.result === '通过') {
            this.$set(item, '_result', '<i class="el-icon-check" style="color: red;"></i>');
          } else if (item.result === '不通过') {
            this.$set(item, '_result', '<i class="el-icon-close" style="color: black;"></i>');
          } else if (item.result === '未执行') {
            this.$set(item, '_result', '<span style="color: gray;">未执行</span>');
          }
        } else {
          this.$set(item, '_result', '');
        }
        return item;
      },

      setData(data) {
        this.params = data;
        if (!this.params.testSummary) {
          this.$set(this.params, 'testSummary', '通过');
        }
        // 基线
        if (data.baselines) {
          this.editableTabs = [];
          data.baselines.forEach(item => {
            if (item._orginType !== 'del') {
              let tab = this.editableTabs.find(tab => {
                return (tab.group_name === item.group);
              });
              item = this.setItemResult(item);
              if (tab) {
                tab.baselines.push(item);
                tab.baseline_ids.push(item.id);
                tab.baseline_ids.push(item.id);
              } else {
                this.editableTabs.push({
                  group_name: item.group,
                  name: this.editableTabs.length + 1 + '',
                  isReady: false,
                  baseline_ids: [item.id],
                  baselines: [item],
                  rowParams: {},
                })
              }
            }
          });
        }
        // 附件
        if (data.testReport && data.testReport.length) {
          this.filesDefaultFileList = this.$common.deepClone(data.testReport);
          this.filesFileList = this.$common.deepClone(data.testReport);
        }
        this.statistical();
      },

      init() {
        if (this.data_saved) {
          this.getTaskData()
        } else {
          this.getView();
        }
      },

    },
    mounted() {
      this.init();
    },
  }
</script>

<style lang="scss" scoped>

  .tag-span {
    cursor: pointer;
  }

  .tag-span:hover {
    text-decoration: underline;
  }

  .infotable {
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
    border: 1px solid #d6d9dd;

    th {
      height: 40px;
      padding-left: 20px;
      padding-right: 20px;
      color: rgb(0, 0, 0);
      font-family: 微软雅黑;
      font-size: 12px;
      text-align: center;
      border-bottom: 1px solid rgb(229, 229, 229);
      border-right: 1px solid rgb(229, 229, 229);
    }

    td {
      height: 0px !important;
      border-bottom: 1px solid #e5e5e5;
      color: #525252;
      font-size: 12px;
      font-family: Arial, "微软雅黑";
      font-weight: 400;
      line-height: 25px;
      text-align: left;
      padding: 2px 15px;
      word-wrap: break-word;
      word-break: break-all;
    }
  }

</style>
