<template>
  <el-card shadow="never" class="default-card">
    <div slot="header" class="clearfix">
      <span class="slot-title">
        工单面板
      </span>
    </div>
    <!--  -->
    <el-form label-width="180px">
      <el-form-item label="源码自动检测报告:">
        <template
          v-if="params.bangcleCodeChecker && params.bangcleCodeChecker.external_system"
        >
          <el-button
            type="primary"
            size="small"
            @click="viewReport('bangcleCodeChecker')"
          >
            查看源码自动检测报告
          </el-button>
        </template>
      </el-form-item>
      <template v-if="params.detection === '移动应用'">
        <el-form-item label="移动应用自动检测报告:">
          <template
            v-if="params.bangcleAppTest && params.bangcleAppTest.external_system"
          >
            <el-button
              type="primary"
              size="small"
              @click="viewReport('bangcleAppTest')"
            >
              查看移动应用自动检测报告
            </el-button>
          </template>
        </el-form-item>
      </template>
      <template v-else-if="params.detection === 'web应用'">
        <el-form-item label="web应用自动检测报告:">
          <template
            v-if="params.bangcleLoopholeChecker && params.bangcleLoopholeChecker.external_system"
          >
            <el-button
              type="primary"
              size="small"
              @click="viewReport('bangcleLoopholeChecker')"
            >
              查看web应用自动检测报告
            </el-button>
          </template>
        </el-form-item>
      </template>
    </el-form>
    <!--  -->
    <el-form label-width="120px"
             :model="params" :rules="rules" ref="refForm">
      <div>
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
                  <!--<el-form-item label="结果描述:">-->
                  <!--<el-input-->
                  <!--v-model="item.rowParams.result_des"-->
                  <!--autosize-->
                  <!--type="textarea"-->
                  <!--resize="none"-->
                  <!--:readonly="readonly"-->
                  <!--&gt;</el-input>-->
                  <!--</el-form-item>-->
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
                      <template v-if="item.rowParams.auto_check">
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
      </div>
      <div class="margin-top-10 text-right" v-show="!readonly">
        <el-button
          type="default"
          @click="goBack"
          size="small"
        >
          返回
        </el-button>
        <!--<el-button-->
        <!--type="primary"-->
        <!--@click="save"-->
        <!--size="small"-->
        <!--v-if="!disabled"-->
        <!--&gt;-->
        <!--保存-->
        <!--</el-button>-->
        <el-button
          type="primary"
          @click="submit"
          size="small"
          v-if="!disabled"
        >
          确认完成
        </el-button>
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
      <!--<el-card-->
      <!--shadow="never"-->
      <!--class="default-card margin-top-14"-->
      <!--v-for="(item, index) in dialogDetails"-->
      <!--:key="index"-->
      <!--&gt;-->
      <!--<div slot="header" class="clearfix">-->
      <!--<span class="slot-title">{{ item.title }}</span>-->
      <!--</div>-->
      <!--<table-->
      <!--cellpadding="0"-->
      <!--cellspacing="0"-->
      <!--class="infotable"-->
      <!--&gt;-->
      <!--<tbody>-->
      <!--<tr-->
      <!--v-for="(it, i) in item.detail"-->
      <!--:key="i"-->
      <!--&gt;-->
      <!--<th width="22%">{{ it.description }}</th>-->
      <!--<td width="78%">-->
      <!--<div v-html="it.text"></div>-->
      <!--</td>-->
      <!--</tr>-->
      <!--</tbody>-->
      <!--</table>-->
      <!--</el-card>-->
      <!--<div>-->
      <!--{{ JSON.stringify(detections) }}-->
      <!--</div>-->
      <JsonEditor
        v-if="detections"
        v-model="detections"
      ></JsonEditor>
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
  import JsonEditor from '../../../../../components/JsonEditor/index'

  import tongguo from '../../../../../img/icons/test/tongguo.png'
  import tongguo_active from '../../../../../img/icons/test/tongguo_active.png'
  import weitongguo from '../../../../../img/icons/test/weitongguo.png'
  import weitongguo_active from '../../../../../img/icons/test/weitongguo_active.png'
  import weizhixing from '../../../../../img/icons/test/weizhixing.png'
  import weizhixing_active from '../../../../../img/icons/test/weizhixing_active.png'
  import weicaozuo from '../../../../../img/icons/test/weicaozuo.png'
  import weicaozuo_active from '../../../../../img/icons/test/weicaozuo_active.png'

  export default {
    name: "manualReview",
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
      JsonEditor,
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
        rules: {
          url: [{required: true, message: '请输入:url', trigger: 'blur'}],
          testTools: [{required: true, message: '请输入:检测工具', trigger: 'change'}],
        },
        params: {},
        // 附件
        appDefaultFileList: [],
        appFileList: [],
        codePackageDefaultFileList: [],
        codePackageFileList: [],
        //
        activeName: '1',
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
        detections: '',
        dialogDetails: [],
        visible: false,
      }
    },
    methods: {

      viewReport(url) {
        if (url) {
          window.open(this.$common.win_origin + '/#/' + url + '?workflow_id=' + this.workflow_id);
        }
      },

      viewAutoDetails(params) {
        // console.log(params.details);
        // this.dialogDetails = params.details;
        this.detections = params.detections;
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

      goBack() {
        this.$router.go(-1)
      },

      save() {
        let params = this.$common.deepClone(this.params);
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
            this.$emit('on-submit', params);
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

      setData(data) {
        this.params = data;
        console.log(data);
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

  .wrap {

    body, html {
      background-color: #f3f3f3
    }

    body {
      overflow-y: scroll
    }

    fieldset, img {
      border: 0
    }

    address, caption, cite, code, dfn, th, var {
      font-style: normal;
      font-weight: 400
    }

    caption, th {
      text-align: left
    }

    q:after, q:before {
      content: ""
    }

    abbr, acronym {
      border: 0;
      font-variant: normal
    }

    input, select, textarea {
      font-weight: inherit
    }

    textarea {
      min-height: 40px
    }

    button::-moz-focus-inner, input::-moz-focus-inner, select::-moz-focus-inner {
      border: 0;
      padding: 0
    }

    legend {
      color: #000
    }

    code, kbd, pre, samp, tt {
      font-family: Consolas, Liberation Mono, Menlo, Courier, monospace;
      font-size: 12px;
      line-height: 18px
    }

    img, svg {
      vertical-align: top;
      overflow: visible
    }

    hr {
      margin: 4px 0;
      padding: 0;
      height: 1px;
      border: none;
      background-color: #e6e6e6
    }

    body, html {
      color: #444
    }

    body {
      font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
      font-size: 13px;
      line-height: 1.23076923
    }

    .h1, h1 {
      line-height: 24px;
      color: #444;
      font-size: 16px;
      font-weight: 400
    }

    .h1 img, .h1 svg, h1 img, h1 svg {
      vertical-align: middle;
      transform: translateY(-1px)
    }

    .h2, h2 {
      line-height: 24px;
      color: #444;
      font-size: 15px;
      font-weight: 400
    }

    .h2 img, .h2 svg, h2 img, h2 svg {
      vertical-align: middle;
      transform: translateY(-1px)
    }

    .h3, h3 {
      line-height: 24px;
      color: #444;
      font-size: 14px;
      font-weight: 600
    }

    .h3 img, .h3 svg, h3 img, h3 svg {
      vertical-align: middle;
      transform: translateY(-1px)
    }

    .h4, h4 {
      line-height: 24px;
      color: #444;
      font-size: 13px;
      font-weight: 600
    }

    .h4 img, .h4 svg, h4 img, h4 svg {
      vertical-align: middle;
      transform: translateY(-1px)
    }

    .h5, h5 {
      line-height: 24px;
      color: #444;
      font-size: 13px;
      font-weight: 600
    }

    .h5 img, .h5 svg, h5 img, h5 svg {
      vertical-align: middle;
      transform: translateY(-1px)
    }

    .h6, h6 {
      line-height: 24px;
      color: #444;
      font-size: 13px;
      font-weight: 600
    }

    .h6 img, .h6 svg, h6 img, h6 svg {
      vertical-align: middle;
      transform: translateY(-1px)
    }

    sup {
      vertical-align: text-top
    }

    sub {
      vertical-align: text-bottom
    }

    em {
      font-style: italic
    }

    strong {
      font-weight: 600
    }

    mark {
      background: 0 0;
      color: #444;
      font-weight: 700
    }

    blockquote {
      border-left: 3px solid #e6e6e6;
      padding: 0 8px;
      line-height: 1.5
    }

    blockquote cite {
      line-height: 1.5;
      color: #777;
      font-size: 12px
    }

    .small, small {
      font-size: 12px
    }

    .medium {
      font-size: 14px
    }

    .big {
      font-size: 16px
    }

    .huge {
      font-size: 24px
    }

    .zero-font-size {
      font-size: 0 !important
    }

    .text-left {
      text-align: left
    }

    .text-center {
      text-align: center
    }

    .text-right {
      text-align: right
    }

    .text-justify {
      text-align: justify
    }

    .text-top {
      vertical-align: top !important
    }

    .text-middle {
      vertical-align: middle !important
    }

    .text-bottom {
      vertical-align: bottom !important
    }

    .text-text-top {
      vertical-align: text-top !important
    }

    .text-text-bottom {
      vertical-align: text-bottom !important
    }

    .text-baseline {
      vertical-align: baseline !important
    }

    .text-ellipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap
    }

    .text-limited-small {
      max-width: 8vw
    }

    .text-limited, .text-limited-small {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap
    }

    .text-limited {
      max-width: 16vw
    }

    .text-uppercase {
      text-transform: uppercase
    }

    .text-lowercase {
      text-transform: lowercase
    }

    .text-no-transform {
      text-transform: none
    }

    .text-light {
      font-weight: 300 !important
    }

    .text-normal {
      font-weight: 400 !important
    }

    .text-bold {
      font-weight: 700 !important
    }

    .text-muted {
      color: #777
    }

    .text-muted-2 {
      color: #b4b4b4
    }

    .text-danger {
      color: #d4333f !important
    }

    .text-warning {
      color: #ed7d20 !important
    }

    .text-info {
      color: #4b9fd5 !important
    }

    .text-success {
      color: #0a0 !important
    }

    .monospaced {
      line-height: 18px;
      font-family: Consolas, Liberation Mono, Menlo, Courier, monospace;
      font-size: 12px
    }

    a {
      border-bottom: 1px solid #cae3f2;
      color: #236a97;
      cursor: pointer;
      outline: 0;
      text-decoration: none;
      transition: all .2s ease
    }

    a:active, a:focus, a:hover {
      color: #4b9fd5
    }

    .link-base-color {
      border-bottom: 1px solid #d0d0d0;
      color: #444
    }

    .link-base-color:active, .link-base-color:focus, .link-base-color:hover {
      color: #4b9fd5
    }

    .link-base-color:active, .link-base-color:focus, .link-base-color:hover {
      border-bottom-color: #cae3f2
    }

    .link-no-underline {
      border-bottom: none !important
    }

    .link-underline {
      border-bottom: 1px solid #cae3f2 !important
    }

    .link-with-icon {
      border-bottom: none
    }

    .link-with-icon > span:last-child {
      border-bottom: 1px solid #cae3f2
    }

    .link-checkbox {
      color: inherit;
      border-bottom: none
    }

    .link-checkbox.disabled, .link-checkbox.disabled label, .link-checkbox.disabled:hover {
      color: #777;
      cursor: not-allowed
    }

    .link-checkbox:active, .link-checkbox:focus, .link-checkbox:hover {
      color: inherit
    }

    .link-checkbox-control {
      display: inline-block;
      padding: 4px 0 5px;
      line-height: 16px
    }

    .link-active, a.active-link {
      border-bottom: none;
      cursor: default
    }

    a.text-muted {
      border-bottom: 1px solid #ddd;
      color: #777
    }

    a.text-muted:active, a.text-muted:focus, a.text-muted:hover {
      color: #5e5e5e
    }

    a.favorite-link:focus, a.set-homepage-link:focus, a.text-muted:focus {
      outline: 1px dotted #4b9fd5
    }

    table {
      border-collapse: collapse;
      border-spacing: 0
    }

    table.form td {
      padding: 2px 5px;
      vertical-align: top
    }

    table.form th {
      padding: 2px 5px;
      font-weight: 600
    }

    table.form td.keyCell {
      width: 1%;
      white-space: nowrap;
      text-align: right;
      font-weight: 700;
      vertical-align: top
    }

    table.form td img {
      vertical-align: bottom
    }

    table.spaced th {
      font-weight: 700;
      color: #333;
      padding: 4px 5px
    }

    table.spaced td {
      padding: 3px 5px;
      line-height: 18px
    }

    table.spaced td img {
      vertical-align: text-bottom
    }

    table.spacedicon th {
      font-weight: 700;
      color: #333;
      padding: 4px 5px
    }

    table.spacedicon td {
      padding: 0 5px;
      height: 24px
    }

    .thin {
      width: 1%
    }

    .spacer {
      width: 5px
    }

    .formError, .spacer {
      display: inline-block
    }

    .formError {
      background-color: #ed7d20;
      color: #000;
      padding: 0 5px
    }

    .table > thead > tr > th {
      border-top: 0;
      font-weight: 700;
      line-height: 16px;
      padding: 4px 5px;
      vertical-align: bottom
    }

    .table > tbody > tr > td {
      line-height: 16px;
      padding: 4px 5px;
      vertical-align: top
    }

    .table > tfoot > tr > td {
      font-size: 93%;
      color: #777;
      padding: 4px 5px
    }

    .table > tfoot > tr > td a {
      color: #777
    }

    .hoverable:hover {
      background-color: #cae3f2
    }

    .hoverable:hover a {
      color: #111
    }

    .odd {
      background-color: #fff
    }

    .even {
      background-color: #f5f5f5
    }

    .even.selected, .even.selected a, .even.selected span:not(.rating), .odd.selected, .odd.selected a, .odd.selected span:not(.rating) {
      background-color: #d9edf7;
      color: #444
    }

    .table-cell-doc {
      position: absolute;
      z-index: 3;
      right: -8px
    }

    th > .table-cell-doc {
      top: 50%;
      margin-top: -6px
    }

    td.sep {
      width: 10px
    }

    table.matrix tfoot td {
      padding: 3px 5px;
      line-height: 18px
    }

    table.data, table.spaced {
      width: 100%
    }

    table.data td.small, table.data th.small {
      padding: 0;
      white-space: nowrap
    }

    table.data > thead > tr > th {
      position: relative;
      vertical-align: top;
      line-height: 18px;
      padding: 8px 10px;
      border-bottom: 1px solid #e6e6e6;
      font-weight: 600
    }

    table.data > thead > tr > th > .small {
      display: block;
      line-height: 1.4;
      font-weight: 400
    }

    table.data > tfoot > tr > td {
      font-size: 93%;
      color: #777;
      padding: 5px
    }

    table.data > tbody > tr > td {
      position: relative;
      padding: 8px 10px;
      vertical-align: text-top;
      line-height: 16px
    }

    table.data > tbody > tr > td.text-middle {
      vertical-align: middle
    }

    .data thead tr.total {
      background-color: #efefef;
      font-weight: 400;
      border: 1px solid #ddd
    }

    .data thead tr.total th {
      font-weight: 400
    }

    .data td.blank, .data tr.blank, .data tr.blank > td {
      background-color: #fff !important;
      line-height: 15px
    }

    .data tr.highlight {
      background-color: #cae3f2
    }

    .data button, .data input, .data select {
      vertical-align: middle
    }

    table.data.condensed > tbody > tr > td {
      padding-top: 5px;
      padding-bottom: 5px
    }

    table.data tr.subheader th {
      font-size: 12px;
      border-bottom: none
    }

    table.data:not(.boxed-padding) > thead:after {
      display: block;
      line-height: 5px;
      content: "\200C"
    }

    table.data.boxed-padding > thead > tr > th {
      padding-top: 24px
    }

    table.data.boxed-padding > tbody > tr > td:first-child, table.data.boxed-padding > tbody > tr > td:last-child, table.data.boxed-padding > thead > tr > th:first-child, table.data.boxed-padding > thead > tr > th:last-child {
      width: 20px;
      padding: 8px 0
    }

    table.data.no-outer-padding > tbody > tr > td:first-child, table.data.no-outer-padding > thead > tr > th:first-child {
      padding-left: 0
    }

    table.data.no-outer-padding > tbody > tr > td:last-child, table.data.no-outer-padding > thead > tr > th:last-child {
      padding-right: 0
    }

    table.data.boxed-padding > thead + tbody > tr:first-child > td {
      padding-top: 16px
    }

    table.data.zebra-hover > tbody > tr:hover {
      background-color: #ecf6fe !important
    }

    table.data.zebra > tbody > tr.selected {
      background-color: #d9edf7 !important
    }

    table.data.zebra.zebra-inversed > tbody > tr:nth-child(odd), table.data.zebra:not(.zebra-inversed) > tbody > tr:nth-child(2n) {
      background-color: #f5f5f5
    }

    table#project-history tr > td {
      vertical-align: top
    }

    table.fixed {
      table-layout: fixed
    }

    table.fixed th.action-small {
      width: 30px
    }

    table.fixed th.action {
      width: 50px
    }

    ol, ul {
      padding-left: 0;
      list-style: none
    }

    .list-styled {
      margin-bottom: 10px;
      padding-left: 40px
    }

    .list-styled.no-padding {
      padding-left: 16px
    }

    ul.list-styled {
      list-style: disc
    }

    ol.list-styled {
      list-style: decimal
    }

    .list-inline {
      padding-left: 0;
      margin-left: -5px;
      list-style: none
    }

    .list-inline > li {
      display: inline-block;
      vertical-align: top;
      padding-right: 5px;
      padding-left: 5px
    }

    .list-spaced {
      margin-bottom: 10px;
      list-style: none
    }

    .list-spaced > li {
      margin-top: 10px
    }

    .list-item-checkable-link {
      cursor: pointer
    }

    .list-item-checkable-link:focus {
      outline: 0
    }

    .list-item-checkable-link.disabled {
      opacity: .7
    }

    .list-item-checkable-link.disabled a:before {
      background-color: #cdcdcd;
      border-color: #cdcdcd
    }

    dl {
      margin-top: 0;
      margin-bottom: 20px
    }

    dd, dt {
      line-height: 1.42857143
    }

    dt {
      font-weight: 700
    }

    dd {
      margin-left: 0
    }

    input[type=date], input[type=email], input[type=number], input[type=password], input[type=search], input[type=text], select, textarea {
      border: 1px solid #cdcdcd;
      box-sizing: border-box;
      border-radius: 2px;
      background: #fff;
      color: #444;
      transition: border-color .2s ease
    }

    input[type=date]:active, input[type=date]:focus, input[type=email]:active, input[type=email]:focus, input[type=number]:active, input[type=number]:focus, input[type=password]:active, input[type=password]:focus, input[type=search]:active, input[type=search]:focus, input[type=text]:active, input[type=text]:focus, select:active, select:focus, textarea:active, textarea:focus {
      border-color: #4b9fd5;
      box-shadow: none;
      outline: 0
    }

    input[type=date]:invalid, input[type=email]:invalid, input[type=number]:invalid, input[type=password]:invalid, input[type=search]:invalid, input[type=text]:invalid, select:invalid, textarea:invalid {
      box-shadow: none;
      outline: 0
    }

    input:-ms-input-placeholder, textarea:-ms-input-placeholder {
      color: #777
    }

    input::-ms-input-placeholder, textarea::-ms-input-placeholder {
      color: #777
    }

    input::placeholder, textarea::placeholder {
      color: #777
    }

    .is-valid > .Select-control, input[type=date].is-valid, input[type=email].is-valid, input[type=number].is-valid, input[type=password].is-valid, input[type=search].is-valid, input[type=text].is-valid, select.is-valid, textarea.is-valid {
      border-color: #0a0
    }

    .is-invalid > .Select-control, input[type=date].is-invalid, input[type=email].is-invalid, input[type=number].is-invalid, input[type=password].is-invalid, input[type=search].is-invalid, input[type=text].is-invalid, select.is-invalid, textarea.is-invalid {
      border-color: #d4333f
    }

    input.disabled, input:disabled, select.disabled, select:disabled, textarea.disabled, textarea:disabled {
      color: #bbb !important;
      border-color: #ddd !important;
      background: #ebebeb !important;
      cursor: not-allowed !important;
      pointer-events: none !important;
      box-shadow: none !important
    }

    input[type=date], input[type=email], input[type=number], input[type=password], input[type=search], input[type=text] {
      height: 24px;
      padding: 0 6px
    }

    input[type=search] {
      -webkit-appearance: textfield
    }

    input[type=search]::-webkit-search-decoration {
      -webkit-appearance: none
    }

    textarea {
      padding: 3px
    }

    textarea.width-100 {
      max-width: 100%
    }

    textarea.fixed-width {
      resize: vertical
    }

    select {
      height: 24px;
      line-height: 24px
    }

    .input-tiny {
      width: 60px !important
    }

    .input-small {
      width: 100px !important
    }

    .input-medium {
      width: 150px !important
    }

    .input-large {
      width: 200px !important
    }

    .input-super-large {
      width: 100% !important;
      max-width: 300px;
      min-width: 200px
    }

    .input-ghost {
      padding: 0 !important;
      border: none !important
    }

    .input-clear, .input-ghost {
      background-color: transparent !important
    }

    .input-code {
      font-family: Consolas, Liberation Mono, Menlo, Courier, monospace;
      font-size: 12px
    }

    em.mandatory {
      color: #a4030f;
      font-style: italic
    }

    .form-field {
      clear: both;
      display: block;
      padding-bottom: 16px
    }

    .form-field label {
      display: block;
      font-weight: 700;
      padding-bottom: 4px
    }

    .form-field-description {
      line-height: 1.4;
      color: #777;
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 2px
    }

    .form-field .Select, .form-field input[type=email], .form-field input[type=password], .form-field input[type=text], .form-field select, .form-field textarea {
      width: 250px
    }

    [class*=" icon-"], [class^=icon-] {
      line-height: 1;
      vertical-align: middle
    }

    a[class*=" icon-"], a[class^=icon-] {
      border-bottom: none
    }

    .icon-half-transparent {
      opacity: .5
    }

    .icon-gray {
      color: #999
    }

    .icon-gray path {
      fill: #999
    }

    .icon-color-link {
      color: #236a97
    }

    .icon-outline {
      transition: all .2s ease !important
    }

    .icon-outline path {
      stroke: #777;
      stroke-width: 1.41421356;
      stroke-opacity: 1;
      fill-opacity: 0;
      vector-effect: non-scaling-stroke;
      transition: all .2s ease
    }

    .icon-outline.is-filled path {
      fill: currentColor;
      stroke: currentColor;
      fill-opacity: 1
    }

    .nowrap, table.nowrap td, td.nowrap, th.nowrap {
      white-space: nowrap !important
    }

    table.hide-overflow td, td.hide-overflow, th.hide-overflow {
      text-overflow: ellipsis;
      overflow: hidden
    }

    .hidden {
      display: none !important;
      visibility: hidden !important
    }

    .invisible {
      visibility: hidden
    }

    .note {
      color: #777;
      font-size: 12px
    }

    .nudged-up {
      margin-top: -1px
    }

    .nudged-down {
      margin-top: 1px
    }

    .spacer {
      margin: 8px !important
    }

    .spacer-left {
      margin-left: 8px !important
    }

    .spacer-right {
      margin-right: 8px !important
    }

    .spacer-bottom {
      margin-bottom: 8px !important
    }

    .spacer-top {
      margin-top: 8px !important
    }

    .big-spacer {
      margin: 16px !important
    }

    .big-spacer-left {
      margin-left: 16px !important
    }

    .big-spacer-right {
      margin-right: 16px !important
    }

    .big-spacer-bottom {
      margin-bottom: 16px !important
    }

    .big-spacer-top {
      margin-top: 16px !important
    }

    .huge-spacer {
      margin: 40px !important
    }

    .huge-spacer-bottom {
      margin-bottom: 40px !important
    }

    .huge-spacer-top {
      margin-top: 40px !important
    }

    .huge-spacer-left {
      margin-left: 40px !important
    }

    .huge-spacer-right {
      margin-right: 40px !important
    }

    .little-spacer {
      margin: 4px !important
    }

    .little-spacer-left {
      margin-left: 4px !important
    }

    .little-spacer-right {
      margin-right: 4px !important
    }

    .little-spacer-bottom {
      margin-bottom: 4px !important
    }

    .little-spacer-top {
      margin-top: 4px !important
    }

    .padded {
      padding: 8px
    }

    .big-padded {
      padding: 16px !important
    }

    .padded-top {
      padding-top: 8px !important
    }

    .padded-right {
      padding-right: 8px !important
    }

    .padded-bottom {
      padding-bottom: 8px !important
    }

    .padded-left {
      padding-left: 8px !important
    }

    .little-padded-top {
      padding-top: 4px !important
    }

    .little-padded-right {
      padding-right: 4px !important
    }

    .little-padded-bottom {
      padding-bottom: 4px !important
    }

    .little-padded-left {
      padding-left: 4px !important
    }

    .big-padded-top {
      padding-top: 16px
    }

    .big-padded-right {
      padding-right: 16px
    }

    .huge-padded-top {
      padding-top: 40px
    }

    td.little-spacer-left {
      padding-left: 4px !important
    }

    td.little-spacer-right {
      padding-right: 4px !important
    }

    td.spacer-left {
      padding-left: 8px !important
    }

    td.spacer-right {
      padding-right: 8px !important
    }

    td.spacer-bottom {
      padding-bottom: 8px !important
    }

    td.spacer-top {
      padding-top: 8px !important
    }

    td.big-spacer-left, th.big-spacer-left {
      padding-left: 16px !important
    }

    td.big-spacer-right {
      padding-right: 16px !important
    }

    td.big-spacer-bottom {
      padding-bottom: 16px !important
    }

    td.big-spacer-top {
      padding-top: 16px !important
    }

    td.huge-spacer-right, th.huge-spacer-right {
      padding-right: 40px !important
    }

    .pull-left {
      float: left !important
    }

    .pull-right {
      float: right !important
    }

    .borderless {
      border: none !important
    }

    .bordered {
      border: 1px solid #e6e6e6
    }

    .bordered-left {
      border-left: 1px solid #e6e6e6
    }

    .bordered-right {
      border-right: 1px solid #e6e6e6
    }

    .bordered-bottom {
      border-bottom: 1px solid #e6e6e6
    }

    .bordered-top {
      border-top: 1px solid #e6e6e6
    }

    .overflow-hidden {
      overflow: hidden !important
    }

    .overflow-y-auto {
      overflow-y: auto !important
    }

    .max-width-100 {
      max-width: 100% !important
    }

    .width-100 {
      width: 100% !important
    }

    .width-80 {
      width: 80% !important
    }

    .width-60 {
      width: 60% !important
    }

    .width-55 {
      width: 55% !important
    }

    .width-50 {
      width: 50% !important
    }

    .width-40 {
      width: 40% !important
    }

    .width-30 {
      width: 30% !important
    }

    .width-25 {
      width: 25% !important
    }

    .width-20 {
      width: 20% !important
    }

    .width-15 {
      width: 15% !important
    }

    .width-10 {
      width: 10% !important
    }

    .abs-width-150 {
      width: 150px !important
    }

    .abs-width-240 {
      width: 240px !important
    }

    .abs-width-300 {
      width: 300px !important
    }

    .abs-width-400 {
      width: 400px !important
    }

    .abs-width-600 {
      width: 600px !important
    }

    .abs-height-100 {
      height: 100% !important
    }

    .max-height-100 {
      max-height: 100% !important
    }

    .justify {
      margin-bottom: -1em;
      text-align: justify
    }

    .justify:after, .justify > .ib {
      display: inline-block
    }

    .justify:after {
      width: 100%;
      content: " "
    }

    .first-letter-uppercase:first-letter {
      text-transform: uppercase
    }

    .disabled-pointer-events {
      pointer-events: none !important
    }

    .display-block {
      display: block !important
    }

    .display-inline-block {
      display: inline-block !important
    }

    .display-flex-row {
      display: flex !important;
      flex-direction: row
    }

    .display-flex-column {
      display: flex !important;
      flex-direction: column
    }

    .display-flex-center {
      display: flex !important;
      align-items: center
    }

    .display-flex-justify-start {
      display: flex !important;
      justify-content: flex-start !important
    }

    .display-flex-justify-center {
      display: flex !important;
      justify-content: center
    }

    .display-flex-justify-end {
      display: flex !important;
      justify-content: flex-end
    }

    .display-flex-space-around {
      display: flex !important;
      justify-content: space-around
    }

    .display-flex-space-between {
      display: flex !important;
      justify-content: space-between
    }

    .display-flex-stretch {
      display: flex !important;
      align-items: stretch
    }

    .display-flex-start {
      display: flex !important;
      align-items: flex-start
    }

    .display-flex-wrap {
      display: flex !important;
      flex-wrap: wrap
    }

    .display-inline-flex-baseline {
      display: inline-flex !important;
      align-items: baseline
    }

    .display-inline-flex-center {
      display: inline-flex !important;
      align-items: center
    }

    .position-absolute {
      position: absolute !important
    }

    .position-relative {
      position: relative !important
    }

    .rounded {
      border-radius: 2px
    }

    .flex-1 {
      flex: 1
    }

    .flex-1-0-auto {
      flex: 1 0 auto
    }

    .flex-0 {
      flex: 0 0 auto
    }

    .flex-grow {
      flex-grow: 1
    }

    .flex-shrink {
      flex-shrink: 1;
      min-width: 0
    }

    .space-between {
      justify-content: space-between !important
    }

    .new-loading {
      opacity: .5;
      transition: opacity .5s ease
    }

    .slash-separator {
      margin-left: 5px;
      margin-right: 5px
    }

    .slash-separator:after {
      content: "/";
      color: rgba(68, 68, 68, .3)
    }

    .horizontal-pipe-separator {
      display: flex;
      align-items: center;
      margin-top: 32px;
      margin-bottom: 32px
    }

    .horizontal-pipe-separator > .horizontal-separator {
      margin: 0 4px
    }

    .horizontal-separator {
      min-width: 16px;
      height: 1px;
      flex-grow: 1;
      background-color: #e6e6e6
    }

    .vertical-separator {
      width: 1px;
      min-height: 16px;
      flex-grow: 1;
      background-color: #e6e6e6
    }

    .vertical-pipe-separator {
      display: flex;
      flex-direction: column;
      margin-left: 60px;
      margin-right: 60px
    }

    .vertical-pipe-separator > .vertical-separator {
      margin: 4px auto
    }

    .capitalize {
      text-transform: capitalize !important
    }

    .cursor-pointer {
      cursor: pointer
    }

    .cursor-not-allowed {
      cursor: not-allowed !important
    }

    .no-outline, .no-outline:focus {
      outline: 0 !important
    }

    .bg-danger {
      background-color: #d4333f;
      color: #fff
    }

    .bg-warning {
      background-color: #ed7d20;
      color: #fff
    }

    .bg-info {
      background-color: #4b9fd5;
      color: #fff
    }

    .bg-success {
      background-color: #0a0;
      color: #fff
    }

    .bg-muted {
      background-color: #f3f3f3;
      color: inherit
    }

    .leak-box {
      background-color: #fbf3d5;
      border: 1px solid #f1e8cb;
      padding: 4px 6px
    }

    .shortcut-button {
      display: inline-block;
      min-width: 24px;
      height: 24px;
      line-height: 21px;
      padding: 0 4px;
      box-sizing: border-box;
      border: 1px solid #ccc;
      border-radius: 3px;
      background-image: linear-gradient(180deg, #f5f5f5, #eee);
      box-shadow: inset 0 1px 0 #fff, 0 1px 0 #ccc;
      color: #777;
      font-size: 11px;
      text-align: center
    }

    .shortcut-button-small {
      min-width: 16px;
      height: 16px;
      line-height: 14px;
      margin-left: 4px;
      margin-right: 4px
    }

    .identity-provider {
      line-height: 14px;
      padding: 2px 5px;
      border: 1px solid rgba(0, 0, 0, .15);
      border-radius: 3px;
      box-sizing: border-box;
      background-color: #236a97
    }

    .analysis-version, .identity-provider {
      display: inline-block;
      font-size: 12px;
      color: #fff
    }

    .analysis-version {
      vertical-align: middle;
      height: 20px;
      padding: 0 8px;
      background-color: #4b9fd5;
      border-radius: 2px;
      line-height: 20px;
      white-space: nowrap;
      text-align: center;
      font-weight: 700;
      letter-spacing: 0
    }

    .spinner {
      position: relative;
      vertical-align: middle;
      width: 16px;
      height: 16px;
      border: 2px solid #4b9fd5;
      border-radius: 50%;
      animation: spin .75s linear infinite
    }

    .spinner:after, .spinner:before {
      left: -2px;
      top: -2px;
      display: none;
      position: absolute;
      content: "";
      width: inherit;
      height: inherit;
      border: inherit;
      border-radius: inherit
    }

    .spinner, .spinner:after, .spinner:before {
      display: inline-block;
      box-sizing: border-box;
      border-color: #4b9fd5 transparent transparent;
      animation-duration: 1.2s
    }

    .spinner:before {
      transform: rotate(120deg)
    }

    .spinner:after {
      transform: rotate(240deg)
    }

    @keyframes spin {
      0% {
        transform: rotate(0)
      }
      to {
        transform: rotate(1turn)
      }
    }

    .global-loading {
      width: 300px;
      margin: 200px auto 0;
      white-space: nowrap
    }

    .global-loading-spinner {
      vertical-align: middle;
      width: 80px;
      height: 80px
    }

    .global-loading-text {
      display: inline-block;
      vertical-align: middle;
      margin-left: 30px;
      font-size: 36px;
      font-weight: 300
    }

    .issue-list {
      margin: 10px 0
    }

    .issue, .issue-list {
      /*max-width: 980px*/
    }

    .dropdown {
      position: relative;
      display: inline-block;
      vertical-align: middle
    }

    .dropdown-bottom-hint {
      line-height: 16px;
      margin-bottom: -5px;
      padding: 5px 10px;
      border-top: 1px solid #e6e6e6;
      background-color: #f3f3f3;
      color: #777;
      font-size: 11px
    }

    .menu {
      min-width: 160px;
      padding: 5px 0;
      list-style: none;
      font-size: 12px;
      text-align: left;
      background-color: #fff;
      background-clip: padding-box
    }

    .menu:focus {
      outline: 0
    }

    .menu.is-container {
      padding: 5px
    }

    .menu-item, .menu > li > a, .menu > li > button, .menu > li > span {
      display: block;
      padding: 4px 16px;
      line-height: 14px;
      clear: both;
      font-weight: 400;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap
    }

    .menu > li > a {
      color: #444;
      border-bottom: none;
      transition: none
    }

    .menu > li > button {
      color: #444;
      text-align: left;
      width: 100%
    }

    .menu > li > a.rich-item {
      display: flex;
      align-items: center;
      border: 1px solid #cdcdcd;
      border-radius: 4px;
      margin: 4px 10px;
      padding: 2px 8px;
      white-space: normal
    }

    .menu .divider {
      height: 1px;
      margin: 6px 0;
      overflow: hidden;
      background-color: #e6e6e6
    }

    .menu > li > a.disabled {
      color: #bbb !important;
      cursor: not-allowed !important;
      pointer-events: none !important
    }

    .menu > li > a.text-muted {
      color: #777
    }

    .menu > li > a:focus, .menu > li > a:hover, .menu > li > button:focus, .menu > li > button:hover {
      text-decoration: none;
      color: #444;
      background-color: #f3f3f3
    }

    .menu > .active > a, .menu > .active > a:focus, .menu > .active > a:hover, .menu > li > .active, .menu > li > .active:focus, .menu > li > .active:hover {
      color: #444;
      text-decoration: none;
      outline: 0;
      background-color: #f3f3f3
    }

    .menu .menu-vertically-limited, .menu.menu-vertically-limited {
      max-height: 300px;
      overflow-y: auto
    }

    .menu-vertically-limited.with-top-separator {
      border-top: 1px solid #e6e6e6
    }

    .menu-vertically-limited.with-bottom-separator {
      border-bottom: 1px solid #e6e6e6
    }

    .menu .menu-footer > a > span {
      border-bottom: 1px solid #cdcdcd;
      color: #777
    }

    .menu .menu-footer-note {
      opacity: 0;
      transition: opacity .3s ease
    }

    .menu .menu-footer.active .menu-footer-note {
      opacity: 1
    }

    .menu-search {
      position: relative;
      padding: 8px 16px 0
    }

    .menu-search .search-box, .menu-search .search-box-input {
      max-width: none;
      min-width: 240px
    }

    .menu-search ~ .menu > li > a:focus, .menu-search ~ .menu > li > a:hover {
      background-color: transparent
    }

    .menu-search ~ .menu > .active > a, .menu-search ~ .menu > .active > a:focus, .menu-search ~ .menu > .active > a:hover, .menu-search ~ .menu > li > .active, .menu-search ~ .menu > li > .active:focus, .menu-search ~ .menu > li > .active:hover {
      background-color: #f3f3f3
    }

    .menu-message {
      display: block;
      padding: 4px 16px;
      line-height: 16px
    }

    .menu-header {
      padding: 8px;
      font-size: 12px;
      color: #777;
      white-space: nowrap
    }

    .divider + .menu-header, .menu-header:first-child {
      padding-top: 3px
    }

    .white-page {
      background-color: #fff !important
    }

    .global-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 100vh
    }

    .page {
      position: relative;
      z-index: 2;
      padding: 10px 20px
    }

    .page:after, .page:before {
      display: table;
      content: "";
      line-height: 0
    }

    .page:after {
      clear: both
    }

    .page-limited {
      max-width: 1280px;
      margin-left: auto;
      margin-right: auto;
      padding-top: 20px;
      padding-bottom: 20px
    }

    .page-container {
      min-width: 1080px
    }

    .page-wrapper {
      box-sizing: border-box;
      flex: 1 0 auto
    }

    .page-wrapper-simple {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 100px 0
    }

    .page-simple {
      width: 400px;
      padding: 40px;
      border: 1px solid #e6e6e6;
      background-color: #fff
    }

    .page-header {
      position: relative;
      margin-bottom: 20px
    }

    .page-header:after, .page-header:before {
      display: table;
      content: "";
      line-height: 0
    }

    .page-header:after {
      clear: both
    }

    .page-header .spinner {
      position: relative;
      top: 3px;
      margin-left: 8px
    }

    .page-title {
      float: left;
      margin-bottom: 0;
      line-height: 24px
    }

    .page-actions {
      float: right;
      margin-bottom: 10px;
      margin-left: 10px;
      line-height: 24px;
      text-align: right
    }

    .page-actions .badge {
      margin: 3px 0
    }

    .page-actions .spinner {
      top: 0 !important
    }

    .page-description {
      float: left;
      clear: left;
      max-width: 800px;
      line-height: 1.5;
      margin-top: 6px
    }

    .page-footer {
      min-height: 60px;
      padding: 10px;
      line-height: 1.5;
      border-top: 1px solid #e6e6e6;
      box-sizing: border-box;
      background-color: #f3f3f3;
      color: #595959;
      font-size: 12px;
      text-align: center
    }

    .page-footer a {
      border-bottom: 1px solid #d0d0d0;
      color: #444
    }

    .page-footer a:active, .page-footer a:focus, .page-footer a:hover {
      border-bottom-color: #cae3f2;
      color: #4b9fd5
    }

    .sidebar-page #footer {
      padding-left: calc(50vw - 360px) !important
    }

    .sidebar-page #footer .page-footer-menu, .sidebar-page #footer div {
      max-width: 980px
    }

    .page-footer-menu-item {
      display: inline-block
    }

    .page-footer-menu-item + .page-footer-menu-item:before {
      content: "-";
      padding: 0 4px;
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none
    }

    .page-with-sidebar {
      display: flex
    }

    .page-main {
      flex-grow: 1
    }

    .page-sidebar {
      width: 30%
    }

    .page-sidebar, .page-sidebar-fixed {
      min-width: 300px;
      flex-shrink: 0;
      padding-left: 40px;
      box-sizing: border-box
    }

    .page-sidebar-fixed {
      width: 300px
    }

    .page-sidebar-sticky {
      width: 320px !important;
      padding-right: 0
    }

    .page-limited .page-sidebar-sticky {
      margin: -20px 0 -20px -20px;
      padding-right: 0 !important
    }

    .page-limited .page-sidebar-sticky .page-sidebar-sticky-inner {
      padding: 20px 0
    }

    .page-sidebar-sticky .page-sidebar-sticky-inner {
      position: fixed;
      z-index: 10;
      top: 30px;
      bottom: 0;
      left: 0;
      overflow: auto;
      width: calc(50vw - 357px);
      border-right: 1px solid #e6e6e6;
      box-sizing: border-box;
      background: #f3f3f3
    }

    @media (max-width: 1335px) {
      .page-sidebar-sticky .page-sidebar-sticky-inner {
        width: 310px
      }
    }

    .layout-page {
      display: flex;
      align-items: stretch;
      width: 100%;
      flex-grow: 1
    }

    .layout-page-filters {
      width: 260px;
      padding: 20px
    }

    .layout-page-main {
      flex-grow: 1;
      min-width: 740px;
      padding: 20px;
      z-index: 50
    }

    .layout-page-main-inner {
      position: relative;
      z-index: 2;
      min-width: 740px;
      max-width: 980px
    }

    .layout-page-side-outer {
      flex-grow: 0;
      flex-shrink: 0
    }

    .layout-page-side, .layout-page-side-outer {
      width: calc(50vw - 370px);
      background-color: #f3f3f3
    }

    .layout-page-side {
      position: fixed;
      z-index: 51;
      top: 30px;
      bottom: 0;
      left: 0;
      border-right: 1px solid #e6e6e6;
      overflow-y: auto;
      overflow-x: hidden
    }

    .layout-page-side-inner {
      width: 300px;
      margin-left: calc(50vw - 670px);
      background-color: #f3f3f3
    }

    .layout-page-header-panel, .layout-page-header-panel-inner {
      height: 56px;
      box-sizing: border-box
    }

    .layout-page-header-panel {
      margin-top: -20px
    }

    .layout-page-header-panel-inner {
      position: fixed;
      z-index: 30;
      line-height: 24px;
      padding-top: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e6e6e6;
      background-color: #f3f3f3
    }

    .layout-page-main-header {
      position: relative;
      z-index: 3;
      margin-bottom: 20px
    }

    .layout-page-main-header .component-name {
      line-height: 24px
    }

    .layout-page-main-header-inner {
      left: calc(50vw - 369px);
      right: 0;
      padding-left: 20px;
      padding-right: 20px
    }

    @media (max-width: 1320px) {
      .layout-page-side, .layout-page-side-outer {
        width: 300px
      }
      .layout-page-side-inner {
        margin-left: 0
      }
      .layout-page-main-header-inner {
        left: 301px
      }
      .sidebar-page #footer {
        padding-left: 310px !important
      }
    }

    .component-name {
      line-height: 16px;
      font-size: 12px
    }

    .component-name:after, .component-name:before {
      display: table;
      content: "";
      line-height: 0
    }

    .component-name:after {
      clear: both
    }

    .component-name-parent {
      float: left;
      margin-right: 20px
    }

    .component-name-parent:last-child {
      margin-right: 0
    }

    .component-name-path {
      float: left;
      clear: left
    }

    .component-name-parent + .component-name-path {
      margin-top: 4px
    }

    .component-name-favorite {
      margin-left: 4px;
      padding: 0
    }

    .list-group {
      margin-bottom: 20px;
      padding-left: 0
    }

    .list-group-item, button.list-group-item {
      position: relative;
      z-index: 2;
      display: block;
      margin-bottom: -1px;
      padding: 5px 10px;
      border: 1px solid transparent;
      width: 100%;
      box-sizing: border-box;
      text-align: left
    }

    .list-group-item.depth-1 {
      padding-left: 31px
    }

    .list-group-item.depth-2 {
      padding-left: 51px
    }

    .list-group-item.depth-3 {
      padding-left: 71px
    }

    .list-group-item:last-child {
      margin-bottom: 0
    }

    .list-group-item.active, .list-group-item.active:focus, .list-group-item.active:hover {
      z-index: 3;
      border-color: #4b9fd5 !important;
      background-color: #cae3f2
    }

    .list-group-item:hover {
      z-index: 3;
      border-color: #4b9fd5 !important
    }

    .list-group-item + .list-group-item {
      border-top-color: #e6e6e6
    }

    a.list-group-item {
      color: #444;
      transition: none
    }

    .list-group-item-heading {
      margin-top: 5px;
      margin-bottom: 5px
    }

    .list-group-item-heading:after {
      content: "";
      display: table;
      clear: both
    }

    .panel {
      padding: 10px
    }

    .panel:not(:last-child) {
      border-bottom: 1px solid #e6e6e6
    }

    .panel-vertical {
      padding-left: 0;
      padding-right: 0
    }

    .panel-white {
      border: 1px solid #e6e6e6;
      background-color: #fff
    }

    .panel-warning {
      border: 1px solid #faebcc;
      background-color: #fcf8e3;
      color: #8a6d3b
    }

    .badge {
      display: inline-block;
      padding: 4px;
      background-color: #e6e6e6;
      border-radius: 3px;
      font-size: 12px;
      font-weight: 600;
      color: #444;
      text-transform: uppercase;
      white-space: nowrap;
      line-height: 8px
    }

    .badge:empty {
      display: none
    }

    a.badge:active, a.badge:focus, a.badge:hover {
      color: #fff
    }

    a.badge {
      border-bottom: none
    }

    .list-group-item-heading > .badge {
      float: right;
      margin: 3px
    }

    .list-group-item-heading > .badge + .badge {
      margin-right: 5px
    }

    .badge-info {
      background-color: #d9edf7;
      color: #0e516f
    }

    .badge-success {
      background-color: #dff0d8;
      color: #215821
    }

    .badge-warning {
      background-color: #fcf8e3;
      color: #6f4f17
    }

    .badge-error {
      background-color: #f2dede;
      color: #862422
    }

    .counter-badge {
      color: #fff;
      background-color: #2e7cb5;
      font-size: 12px;
      padding: .3em .8em;
      border-radius: 1em
    }

    .counter-badge:empty {
      display: none
    }

    .columns {
      margin-left: -10px;
      margin-right: -10px;
      overflow: hidden
    }

    .columns:after, .columns:before {
      display: table;
      content: "";
      line-height: 0
    }

    .columns:after {
      clear: both
    }

    .column-half {
      float: left;
      width: 50%;
      padding: 0 10px;
      box-sizing: border-box
    }

    .column-half.column-one {
      margin: 0 25%
    }

    .flex-columns {
      display: flex
    }

    .flex-column + .flex-column {
      margin-left: 20px
    }

    .flex-column-full {
      width: 100%
    }

    .flex-column-half {
      width: 50%
    }

    .flex-column-third {
      width: 33.33333%
    }

    .boxed-group {
      margin-bottom: 20px;
      border: 1px solid #e6e6e6;
      border-radius: 2px;
      background-color: #fff
    }

    .boxed-group-centered {
      margin-left: auto;
      margin-right: auto;
      max-width: 500px
    }

    .boxed-group > h2 {
      line-height: 24px;
      padding: 16px 20px 0
    }

    .boxed-group > h2.boxed-title {
      padding: 0 0 8px;
      margin: 0;
      font-weight: 600
    }

    .boxed-group hr {
      height: 0;
      border-top: 1px solid #efefef;
      margin: 16px -20px
    }

    .boxed-group-header {
      position: relative;
      z-index: 10;
      padding: 16px 20px 0
    }

    .boxed-group-header > h2 {
      display: inline-block;
      vertical-align: middle;
      line-height: 24px
    }

    .boxed-group-actions {
      position: relative;
      z-index: 12;
      float: right;
      margin-top: 16px;
      margin-right: 20px
    }

    .boxed-group-inner {
      padding: 16px 20px
    }

    .boxed-group-inner:empty {
      padding-top: 0
    }

    .boxed-group-list {
      margin-top: -var(--gridSize);
      margin-bottom: -var(--gridSize)
    }

    .boxed-group-list > li {
      margin-left: -20px;
      margin-right: -20px;
      padding: 8px 20px
    }

    .boxed-group-accordion {
      margin-bottom: 8px;
      transition: border-color .3s ease
    }

    .boxed-group-accordion:not(.no-hover):hover {
      border-color: #4b9fd5
    }

    .boxed-group-accordion:not(.no-hover):hover .boxed-group-accordion-title {
      color: #4b9fd5
    }

    .boxed-group-accordion .boxed-group-header {
      cursor: pointer;
      padding-bottom: 16px
    }

    .boxed-group-accordion.not-clickable .boxed-group-header {
      cursor: default
    }

    .boxed-group-accordion.not-clickable .boxed-group-accordion-title > svg {
      display: none
    }

    .boxed-group-accordion-alert.boxed-group-accordion-alert {
      vertical-align: middle;
      margin-bottom: -6px;
      margin-top: -6px
    }

    .boxed-group-accordion .boxed-group-inner {
      padding-top: 0
    }

    .boxed-group-accordion-title {
      display: inline-flex;
      align-items: center;
      vertical-align: middle;
      font-weight: 700;
      transition: color .3s ease
    }

    .tabs {
      height: 20px;
      border-bottom: 1px solid #ddd;
      font-size: 93%
    }

    .tabs, .tabs li {
      margin: 0;
      padding: 0
    }

    .tabs li {
      display: inline;
      list-style-type: none;
      font-weight: 400;
      color: #777;
      vertical-align: baseline;
      white-space: nowrap;
      border: 0
    }

    .tabs li a {
      float: left;
      color: #777;
      vertical-align: bottom;
      height: 17px;
      margin: 0 1px 0 0;
      padding: 1px 5px;
      border-bottom: none;
      transition: none
    }

    .tabs li a.selected {
      text-decoration: none;
      color: #555 !important;
      font-weight: 700;
      margin: 0 1px 0 0
    }

    .markdown-tips {
      font-size: 12px;
      color: #777
    }

    .markdown, .rule-desc {
      line-height: 1.5
    }

    .cut-margins > .markdown-content > :first-child, .cut-margins > :first-child {
      margin-top: 0 !important
    }

    .cut-margins > .markdown-content > :last-child, .cut-margins > :last-child {
      margin-bottom: 0 !important
    }

    .markdown blockquote, .markdown h2, .markdown h3, .markdown h4, .markdown h5, .markdown h6, .markdown ol, .markdown p, .markdown pre, .markdown table, .markdown ul, .rule-desc blockquote, .rule-desc h2, .rule-desc h3, .rule-desc h4, .rule-desc h5, .rule-desc h6, .rule-desc ol, .rule-desc p, .rule-desc pre, .rule-desc table, .rule-desc ul {
      margin: 1em 0
    }

    .markdown h2, .rule-desc h2 {
      font-size: 16px;
      font-weight: 400
    }

    .markdown h3, .markdown h4, .markdown h5, .markdown h6, .rule-desc h3, .rule-desc h4, .rule-desc h5, .rule-desc h6 {
      font-size: 13px;
      font-weight: 600
    }

    .markdown code, .markdown pre, .rule-desc code, .rule-desc pre {
      font-family: Consolas, Liberation Mono, Menlo, Courier, monospace;
      font-size: 12px
    }

    .markdown pre, .rule-desc pre {
      padding: 10px;
      border-top: 1px solid #e6e6e6;
      border-bottom: 1px solid #e6e6e6;
      line-height: 18px;
      overflow: auto
    }

    .markdown code, .rule-desc code, code.rule {
      padding: .2em .45em;
      margin: 0;
      background-color: rgba(0, 0, 0, .06);
      border-radius: 3px;
      white-space: nowrap
    }

    .markdown pre > code, .rule-desc pre > code {
      padding: 0;
      background-color: transparent;
      white-space: pre
    }

    .markdown blockquote, .rule-desc blockquote {
      line-height: 1.5;
      padding-left: 15px;
      padding-right: 15px
    }

    .markdown ul, .rule-desc ul {
      padding-left: 40px;
      list-style: disc
    }

    .markdown li > ul, .rule-desc li > ul {
      margin: .3em 0
    }

    .markdown ol, .rule-desc ol {
      padding-left: 40px;
      list-style: decimal
    }

    .markdown table, .rule-desc table {
      min-width: 50%;
      border-collapse: collapse;
      border: 1px solid #e6e6e6
    }

    .markdown th, .rule-desc th {
      background-color: #f3f3f3;
      font-weight: 600;
      text-align: center
    }

    .markdown td, .markdown th, .rule-desc td, .rule-desc th {
      padding: 5px 10px;
      border: 1px solid #e6e6e6
    }

    .property p {
      margin-top: 10px
    }

    .coding-rules-detail-parameter pre, .property pre {
      display: inline-block;
      min-width: 100%;
      margin: 10px 0 !important;
      padding: 10px !important;
      border: 1px dashed #aaa;
      box-sizing: border-box;
      font-size: 12px;
      font-family: Consolas, Liberation Mono, Menlo, Courier, monospace
    }

    .coding-rules-detail-parameter blockquote, .property blockquote {
      margin-top: 10px;
      padding: 10px
    }

    .property ul {
      list-style-type: disc
    }

    .property ol, .property ul {
      list-style-position: inside;
      margin: 10px
    }

    .property ol {
      list-style-type: decimal
    }

    .width100 {
      width: 100%
    }

    textarea.width100 {
      width: 100%;
      box-sizing: border-box
    }

    .property {
      margin-bottom: 10px
    }

    .property h3 {
      float: none;
      max-width: 20em
    }

    .property > td, .property > th {
      vertical-align: top;
      padding: 10px
    }

    .property > th {
      text-align: right
    }

    .property table.data {
      width: 480px
    }

    .property textarea {
      vertical-align: text-top
    }

    .property .note {
      margin-top: 5px
    }

    @media print {
      .noprint {
        display: none !important
      }
      a {
        color: #444;
        border-bottom: none
      }
      .page-footer {
        display: none !important
      }
      body, html {
        background-color: #fff !important
      }
      .widget tfoot, .widget thead {
        display: table-row-group
      }
    }

    .code .a {
      color: olive
    }

    .code .c {
      color: #660e80;
      font-style: normal;
      font-weight: 700
    }

    .code .j {
      color: #666;
      font-style: normal
    }

    .code .cd, .code .cppd {
      color: #666;
      font-style: italic
    }

    .code .k {
      color: #0071ba;
      font-weight: 600
    }

    .code .s {
      color: #277b31;
      font-weight: 400
    }

    .code .h {
      color: navy;
      font-weight: 400
    }

    .code .p {
      color: #347235;
      font-weight: 400
    }

    .sym {
      cursor: hand;
      cursor: pointer
    }

    .highlighted {
      background-color: #cae3f2;
      animation: highlightedFadeIn .3s forwards
    }

    @keyframes highlightedFadeIn {
      0% {
        background-color: transparent
      }
      to {
        background-color: #cae3f2
      }
    }

    .clearfix:after, .clearfix:before {
      display: table;
      content: "";
      line-height: 0
    }

    .clearfix:after {
      clear: both
    }

    .issues-main-header .component-name {
      line-height: 24px
    }

    .issues-main-header-spinner {
      margin-right: 2px
    }

    .concise-issues-list-header-inner {
      width: 260px;
      text-align: center
    }

    .concise-issues-list-header .spinner {
      margin-top: 4px;
      margin-left: 1px;
      margin-right: 1px
    }

    .concise-issues-list-header-button {
      border: none
    }

    .concise-issues-list-header-button path {
      fill: #777;
      transition: fill .3s ease
    }

    .concise-issues-list-header-button:hover path {
      fill: #4b9fd5
    }

    .concise-issue-component {
      margin-top: 16px;
      margin-bottom: 4px;
      padding-left: 8px;
      padding-right: 8px;
      direction: rtl
    }

    .concise-issue-box {
      position: relative;
      z-index: 1;
      margin-bottom: 4px;
      padding: 7px;
      border: 2px solid #e6e6e6;
      background-color: #fff;
      cursor: pointer;
      transition: background-color .3s ease, border-color .3s ease
    }

    .concise-issue-box:hover {
      border: 2px dashed #4b9fd5
    }

    .concise-issue-box:focus {
      outline: none
    }

    .concise-issue-box.selected {
      z-index: 2;
      border: 2px solid #4b9fd5;
      cursor: default
    }

    .concise-issue-box-message {
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 700
    }

    .concise-issue-box-message:focus {
      outline: none
    }

    .concise-issue-box.selected .concise-issue-box-message {
      cursor: pointer
    }

    .concise-issue-box-attributes {
      margin-top: 8px;
      line-height: 16px;
      font-size: 12px;
      display: flex;
      align-items: flex-start;
      flex-wrap: wrap;
      justify-content: flex-start
    }

    .concise-issue-box:not(.selected) .location-index {
      background-color: #ccc
    }

    .concise-issue-locations {
      display: inline-block;
      margin-bottom: -4px;
      margin-left: 8px
    }

    .concise-issue-box-attributes > .location-index {
      margin-bottom: 4px;
      margin-right: 4px
    }

    .concise-issue-box-attributes > .concise-issue-expand {
      background-color: transparent;
      border: 1px solid #d18582;
      height: 16px;
      color: #d18582;
      font-weight: 700;
      font-size: 16px;
      line-height: 8px;
      padding-bottom: 6px
    }

    .concise-issue-box-attributes > .concise-issue-expand:hover {
      background-color: #d18582;
      color: #fff
    }

    .concise-issue-locations-navigator-location {
      position: relative;
      z-index: 3;
      display: inline-flex;
      align-items: flex-start;
      max-width: 100%;
      border: none
    }

    .concise-issue-locations-navigator-file {
      position: relative
    }

    .concise-issue-locations-navigator-file + .concise-issue-locations-navigator-file {
      margin-top: 12px
    }

    .concise-issue-locations-navigator-file:not(:last-child):before {
      position: absolute;
      display: block;
      width: 0;
      top: 13px;
      bottom: -16px;
      left: 4px;
      border-left: 1px dotted #d18582;
      content: ""
    }

    .concise-issue-location-file {
      height: 16px;
      padding-bottom: 4px;
      font-size: 12px;
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap
    }

    .concise-issue-location-file-circle, .concise-issue-location-file-circle-multiple, .concise-issue-location-file-circle-multiple:after, .concise-issue-location-file-circle-multiple:before {
      position: relative;
      top: 1px;
      display: inline-block;
      width: 9px;
      height: 9px;
      border: 1px solid #d18582;
      border-radius: 100%;
      box-sizing: border-box;
      background-color: #f2dede
    }

    .concise-issue-location-file-circle-multiple {
      top: -2px
    }

    .concise-issue-location-file-circle-multiple:before {
      position: absolute;
      z-index: 7;
      top: 2px;
      left: -1px;
      content: ""
    }

    .concise-issue-location-file-circle-multiple:after {
      position: absolute;
      z-index: 8;
      top: 5px;
      left: -1px;
      content: ""
    }

    .concise-issue-location-file-locations {
      padding-left: 16px
    }

    .concise-issue-location-file-more {
      border-color: rgba(209, 133, 130, .2);
      color: #d18582 !important;
      font-style: italic;
      font-weight: 400
    }

    .concise-issue-location-file-more:focus, .concise-issue-location-file-more:hover {
      border-color: rgba(209, 133, 130, .6)
    }

    .component-source-container {
      border: 1px solid #cdcdcd
    }

    .component-source-container + .component-source-container {
      margin-top: 8px
    }

    .component-source-container-header {
      background-color: #efefef;
      padding: 8px
    }

    .issues-my-issues-filter {
      margin-bottom: 24px;
      text-align: center
    }

    .issues-page-actions {
      display: inline-block;
      min-width: 80px;
      text-align: right
    }

    .issues .issue-list {
      min-width: 640px;
      width: 800px
    }

    .issues .issue {
      border: 2px solid transparent;
      cursor: pointer
    }

    .issues .issue:focus-within, .issues .issue:hover {
      border: 2px dashed #4b9fd5;
      transition: all .3s ease;
      outline: 0
    }

    .issues .issue a:focus, .issues .issue button:focus {
      box-shadow: none;
      outline: 1px dotted #4b9fd5
    }

    @media (max-width: 1320px) {
      .issues .issue-list {
        width: calc(60vw - 40px)
      }
    }

    .issue-location {
      display: inline-block;
      vertical-align: top;
      line-height: 18px;
      height: 18px;
      box-sizing: border-box;
      background-color: #f2dede;
      transition: background-color .3s ease
    }

    .issues-workspace-list-component {
      padding: 10px 10px 6px
    }

    .issues-workspace-list-item + .issues-workspace-list-item {
      margin-top: 5px
    }

    .issues-workspace-list-component + .issues-workspace-list-item {
      margin-top: 10px
    }

    .issues-workspace-list-item:first-child .issues-workspace-list-component {
      padding-top: 0
    }

    .issues-workspace-list-component + .issues-workspace-list-item {
      margin-top: 0
    }

    .issues-predefined-periods {
      display: flex
    }

    .issues-predefined-periods .search-navigator-facet {
      width: auto;
      margin-right: 4px
    }

    .bulk-change-radio-button {
      margin: 0 -4px;
      padding: 0 4px
    }

    .bulk-change-radio-button:hover {
      background-color: #f3f3f3
    }

    .navigation-keyboard-shortcuts > span {
      background-color: hsla(0, 0%, 78.4%, .5);
      border-radius: 16px;
      display: inline-block;
      font-size: 12px;
      height: 16px;
      padding: 4px 8px
    }

    .issue {
      position: relative;
      padding-top: 8px;
      padding-bottom: 8px;
      background-color: #f2dede;
      transition: all .3s ease, border 0s ease
    }

    .issue.hotspot {
      background-color: #eeeff4
    }

    .issue.selected {
      box-shadow: none;
      outline: none;
      border: 2px solid #4b9fd5 !important
    }

    .issue + .issue, .issue-container + .issue-container {
      margin-top: 5px
    }

    .issue.selected + .issue {
      border-top-color: transparent
    }

    .issue-row {
      display: flex;
      margin-bottom: 5px
    }

    .issue-row-meta {
      flex-grow: 0;
      padding-right: 5px;
      white-space: nowrap
    }

    .issue-message {
      flex-grow: 1;
      padding-left: 8px;
      padding-right: 8px;
      line-height: 18px;
      font-size: 13px;
      font-weight: 600;
      text-overflow: ellipsis
    }

    .issue-actions {
      justify-content: space-between;
      flex-wrap: wrap;
      padding-left: 8px
    }

    .issue-actions, .issue-meta-list {
      display: flex;
      align-items: center;
      margin: 0;
    }

    .issue-meta {
      line-height: 16px;
      font-size: 12px
    }

    .issue-meta + .issue-meta {
      margin-left: 8px
    }

    .issue-meta-label {
      display: inline-block;
      vertical-align: top;
      max-width: 180px;
      line-height: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap
    }

    .issue-see-rule {
      border-bottom: none;
      font-size: 12px
    }

    .issue-changelog {
      width: 450px;
      max-height: 320px;
      overflow: auto;
      white-space: normal
    }

    .issue-comments {
      margin-top: 5px;
      padding-left: 8px;
      font-size: 12px
    }

    .issue-comment {
      display: flex
    }

    .issue-comment + .issue-comment {
      margin-top: 4px
    }

    .issue-comment-author {
      max-width: 130px;
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis
    }

    .issue-comment-age, .issue-comment-author {
      flex-shrink: 0;
      line-height: 18px;
      color: #777;
      white-space: nowrap
    }

    .issue-comment-text {
      flex: 1;
      min-width: 0;
      margin-left: 5px;
      margin-right: 5px;
      line-height: 18px;
      line-height: 1.5;
      overflow: hidden;
      outline: none;
      word-break: break-all
    }

    .issue-comment-text.markdown pre {
      float: none;
      height: auto;
      margin: 0;
      padding: 8px;
      background-color: #e6e6e6;
      border: none;
      border-radius: 3px
    }

    .issue-comment-text.markdown br ~ pre {
      margin-top: 8px
    }

    .issue-comment-actions {
      flex-shrink: 0;
      padding-left: 5px;
      line-height: 18px;
      white-space: nowrap
    }

    .issue-comment-bubble-popup {
      width: 440px;
      font-size: 12px
    }

    .issue-comment-form-text textarea {
      width: 100%;
      max-width: 100%
    }

    .issue-comment-form-footer {
      margin-top: 5px;
      line-height: 22px
    }

    .issue-comment-form-footer:after, .issue-comment-form-footer:before {
      display: table;
      content: "";
      line-height: 0
    }

    .issue-comment-form-footer:after {
      clear: both
    }

    .issue-comment-form-actions {
      float: right
    }

    .issue-comment-form-tips {
      float: left
    }

    .issue-with-checkbox {
      padding-left: 24px
    }

    .issue-with-checkbox .issue-checkbox-container {
      display: flex;
      justify-content: center;
      align-items: center
    }

    .issue-checkbox-container {
      display: none;
      position: absolute;
      width: 28px;
      top: 0;
      bottom: 0;
      left: 0;
      border: none
    }

    .issue-checkbox-container:hover {
      background-color: rgba(0, 0, 0, .05)
    }

    .issue:not(.selected) .location-index {
      background-color: #999
    }

    .issue .menu:not(.issues-similar-issues-menu):not(.issue-changelog) {
      max-height: 120px;
      overflow: auto
    }

    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: middle;
      height: 24px;
      line-height: 22px;
      padding: 0 8px;
      border: 1px solid #236a97;
      border-radius: 2px;
      box-sizing: border-box;
      background: transparent;
      color: #236a97;
      font-weight: 600;
      font-size: 12px;
      text-decoration: none;
      cursor: pointer;
      outline: none;
      transition: border-color .2s ease, box-shadow .2s ease
    }

    .button.button-active, .button:hover {
      background: #236a97;
      color: #fff
    }

    .button:active {
      box-shadow: inset 0 3px 5px rgba(0, 0, 0, .125)
    }

    .button:focus {
      box-shadow: 0 0 0 3px rgba(35, 106, 151, .25)
    }

    .button-primary {
      background: #236a97;
      color: #fff
    }

    .button-primary:hover {
      background: #0e516f
    }

    .button.disabled {
      color: #bbb !important;
      border-color: #ddd !important;
      background: #ebebeb !important;
      cursor: not-allowed !important;
      box-shadow: none !important
    }

    .button-red {
      border-color: #d4333f;
      color: #d4333f
    }

    .button-red.active, .button-red:hover {
      background: #d4333f;
      color: #fff
    }

    .button-red:focus {
      box-shadow: 0 0 0 3px rgba(212, 51, 63, .25)
    }

    .button-success {
      border-color: #0a0;
      color: #0a0
    }

    .button-success.active, .button-success:hover {
      background: #0a0;
      color: #fff
    }

    .button-success:focus {
      box-shadow: 0 0 0 3px rgba(0, 170, 0, .25)
    }

    .button-link {
      display: inline-flex;
      height: auto;
      line-height: 1;
      margin: 0;
      padding: 0;
      border-radius: 0;
      background: transparent;
      color: #236a97;
      border: none;
      border-bottom: 1px solid #cae3f2;
      font-weight: 400;
      font-size: inherit;
      transition: border-color .2s ease, box-shadow .2s ease, color .2s ease, border-bottom .2s ease
    }

    .dropdown .button-link {
      border-bottom: none
    }

    .button-link:hover {
      background: transparent;
      color: #4b9fd5
    }

    .button-link:active, .button-link:focus {
      box-shadow: none;
      outline: 1px dotted #4b9fd5
    }

    .button-link.disabled {
      color: #777;
      background: transparent !important;
      cursor: default
    }

    .button-small {
      height: 20px;
      line-height: 18px;
      padding: 0 6px;
      font-size: 11px
    }

    .button-tiny {
      height: 16px;
      line-height: 16px;
      padding: 0 4px
    }

    .button-large {
      height: 32px;
      padding: 0 16px;
      font-size: 14px
    }

    .button-huge {
      flex-direction: column;
      padding: 16px;
      width: 200px;
      height: 200px;
      background-color: #fff;
      border: 1px solid #fff;
      border-radius: 3px;
      transition: all .2s ease;
      box-shadow: 0 1px 1px 1px #e6e6e6
    }

    .button-huge:active, .button-huge:focus, .button-huge:hover {
      background-color: #fff;
      color: #236a97;
      box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
      transform: translateY(-2px)
    }

    .button-group {
      display: inline-block;
      vertical-align: middle;
      font-size: 0;
      white-space: nowrap
    }

    .button-group > .button, .button-group > button {
      position: relative;
      z-index: 2;
      display: inline-block;
      vertical-align: middle;
      margin: 0;
      cursor: pointer
    }

    .button-group > .button.active:not(.disabled), .button-group > .button:active:not(.disabled), .button-group > .button:focus:not(.disabled), .button-group > .button:hover:not(.disabled) {
      z-index: 3
    }

    .button-group > .button.disabled {
      z-index: 1
    }

    .button-group > .button:not(:first-child) {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0
    }

    .button-group > .button:not(:last-child):not(.dropdown-toggle) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0
    }

    .button-group > .button + .button {
      margin-left: -1px
    }

    .button-group > a:not(.button) {
      vertical-align: middle;
      margin: 0 8px;
      font-size: 12px
    }

    .button-icon {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      vertical-align: middle;
      width: 24px;
      height: 24px;
      padding: 0;
      border: none;
      color: inherit
    }

    .button-icon.button-small {
      width: 20px;
      height: 20px;
      padding: 0
    }

    .button-icon.button-small svg {
      margin-top: 0
    }

    .button-icon.button-tiny {
      width: 16px;
      height: 16px;
      padding: 0
    }

    .button-icon.button-tiny svg {
      margin-top: 0
    }

    .button-icon:focus, .button-icon:hover {
      background-color: currentColor
    }

    .button-icon:not(.disabled):focus svg, .button-icon:not(.disabled):hover svg {
      color: #fff
    }

    .button.button-icon.disabled {
      background: transparent !important
    }

    .button-list {
      display: inline-flex;
      justify-content: space-between;
      height: auto;
      border: 1px solid #e6e6e6;
      padding: 8px;
      margin: 4px;
      color: #777;
      font-weight: 400
    }

    .button-list:hover {
      background-color: #fff;
      border-color: #4b9fd5;
      color: #236a97
    }

    .no-select {
      -webkit-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important
    }

  }
</style>
