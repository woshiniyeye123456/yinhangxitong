<template>
  <el-dialog
    :title="title"
    :append-to-body="true"
    :visible.sync="dialogVisible"
    width="75%"
    :close-on-click-modal="false"
    class="dialog-default"
  >
    <el-row :gutter="12" v-if="dialogVisible">
      <el-col :span="6">
        <el-card shadow="never">
          <div class="height-550">
            <el-tree
              highlight-current
              :data="treeData"
              :props="defaultProps"
              @node-click="handleNodeClick"
            ></el-tree>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card shadow="never">
          <div v-if="renderData" style="position: relative">
            <div class="download-files">
              <el-button type="primary" size="small" @click="fileSaver">
                下载报告
              </el-button>
              <el-button
                type="primary"
                @click="saveAs"
                size="small"
              >
                下载PDF
              </el-button>
            </div>
            <div class="height-550">
              <div ref="download-wrap">
                <br><br><br><br><br><br><br><br><br>
                <br><br><br><br><br><br><br><br><br>
                <h1 style="text-align: center">统计报告</h1>
                <br><br><br><br><br><br><br><br><br>
                <br><br><br><br><br><br><br><br><br>
                <!-- 项目统计 -->
                <h2>项目统计</h2>
                <p>项目名称： {{ renderData.project_name }}</p>
                <table border="1" cellspacing="0" cellpadding="0" style="width: 100%">
                  <colgroup>
                    <col name="table-label" width="200">
                    <col name="table-content">
                  </colgroup>
                  <tbody>
                  <tr>
                    <td rowspan="1" colspan="1">
                      <div style="padding: 5px">任务总数</div>
                    </td>
                    <td rowspan="1" colspan="1">
                      <div style="padding: 5px">{{ renderData.task_count }}</div>
                    </td>
                  </tr>
                  <tr>
                    <td rowspan="1" colspan="1">
                      <div style="padding: 5px">项目参与总人数</div>
                    </td>
                    <td rowspan="1" colspan="1">
                      <div style="padding: 5px">{{ renderData.participate }}</div>
                    </td>
                  </tr>
                  <tr>
                    <td rowspan="1" colspan="1">
                      <div style="padding: 5px">漏洞总数</div>
                    </td>
                    <td rowspan="1" colspan="1">
                      <div style="padding: 5px">{{ renderData.loophole_count }}</div>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <!-- 任务统计 -->
                <h2>任务统计</h2>
                <template v-for="item in renderData.tasks">
                  <p>任务名称： {{ item.task_name }}</p>
                  <p>人员统计</p>
                  <table border="1" cellspacing="0" cellpadding="0" style="width: 100%">
                    <colgroup>
                      <col name="table-label" width="200">
                      <col name="table-content">
                    </colgroup>
                    <tbody>
                    <tr>
                      <td rowspan="1" colspan="1">
                        <div style="padding: 5px">人员类型</div>
                      </td>
                      <td rowspan="1" colspan="1">
                        <div style="padding: 5px">人员及能力等级</div>
                      </td>
                    </tr>
                    <tr
                      v-for="(it, i) in item.team_members"
                      :key="it + i"
                    >
                      <td rowspan="1" colspan="1">
                        <div style="padding: 5px">{{ i }}</div>
                      </td>
                      <td rowspan="1" colspan="1">
                        <div style="padding: 5px">
                          <span v-for="sp in it">{{ sp.real_name }}({{ sp.level }})</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td rowspan="1" colspan="1">
                        <div style="padding: 5px">人员总数</div>
                      </td>
                      <td rowspan="1" colspan="1">
                        <div style="padding: 5px">{{ getTotal(item.team_members) }}</div>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                  <p>基线统计</p>
                  <table border="1" cellspacing="0" cellpadding="0" style="width: 100%">
                    <colgroup>
                      <col name="table-label" width="200">
                      <col name="table-content">
                    </colgroup>
                    <tbody>
                    <tr>
                      <td rowspan="1" colspan="1">
                        <div style="padding: 5px">总基线数量</div>
                      </td>
                      <td rowspan="1" colspan="1">
                        <div style="padding: 5px">{{ item.baseline_count }}</div>
                      </td>
                    </tr>
                    <tr>
                      <td rowspan="1" colspan="1">
                        <div style="padding: 5px">通过基线数</div>
                      </td>
                      <td rowspan="1" colspan="1">
                        <div style="padding: 5px">{{ item.through_baseline_count }}</div>
                      </td>
                    </tr>
                    <tr>
                      <td rowspan="1" colspan="1">
                        <div style="padding: 5px">不通过基线数</div>
                      </td>
                      <td rowspan="1" colspan="1">
                        <div style="padding: 5px">{{ item.not_through_baseline_count }}</div>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                  <p>漏洞统计</p>
                  <table border="1" cellspacing="0" cellpadding="0" style="width: 100%">
                    <colgroup>
                      <col name="table-label" width="200">
                      <col name="table-content">
                    </colgroup>
                    <tbody>
                    <tr>
                      <td rowspan="1" colspan="1">
                        <div style="padding: 5px">风险等级</div>
                      </td>
                      <td rowspan="1" colspan="1">
                        <div style="padding: 5px">漏洞数量</div>
                      </td>
                    </tr>
                    <tr>
                      <td rowspan="1" colspan="1">
                        <div style="padding: 5px">高</div>
                      </td>
                      <td rowspan="1" colspan="1">
                        <div style="padding: 5px">{{ getLoopholeSta(item.loophole_sta).high }}</div>
                      </td>
                    </tr>
                    <tr>
                      <td rowspan="1" colspan="1">
                        <div style="padding: 5px">中</div>
                      </td>
                      <td rowspan="1" colspan="1">
                        <div style="padding: 5px">{{ getLoopholeSta(item.loophole_sta).middle }}</div>
                      </td>
                    </tr>
                    <tr>
                      <td rowspan="1" colspan="1">
                        <div style="padding: 5px">低</div>
                      </td>
                      <td rowspan="1" colspan="1">
                        <div style="padding: 5px">{{ getLoopholeSta(item.loophole_sta).low }}</div>
                      </td>
                    </tr>
                    <tr>
                      <td rowspan="1" colspan="1">
                        <div style="padding: 5px">合计</div>
                      </td>
                      <td rowspan="1" colspan="1">
                        <div style="padding: 5px">{{ getLoopholeSta(item.loophole_sta).total }}</div>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                  <template
                    v-for="lp in item.loopholes"
                  >
                    <markdown
                      :disabled="true"
                      :isFull="true"
                      v-model="lp._loopholes"
                    >
                    </markdown>
                  </template>
                </template>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div class="margin-top-20 text-right">
      <el-button
        type="primary"
        @click="closeAll"
        size="small"
      >
        关闭
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import FileSaver from 'file-saver';
  import html2pdf from 'html2pdf.js'
  import mixins from '../mixins'
  import Markdown from '../../../components/markDown/simple'

  export default {
    name: "项目报表",
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
      Markdown,
    },
    props: {
      title: {
        type: String,
        default: '',
      },
      visible: {
        type: Boolean,
        default: false,
      },
      tableData: {
        type: Array,
        default() {
          return []
        }
      }
    },
    computed: {},
    data() {
      return {
        dialogVisible: false,
        treeData: [],
        defaultProps: {
          children: 'tasks',
          label: 'task_name'
        },
        renderData: null,
      }
    },
    methods: {

      saveAs() {
        let loading = this.$loading({background: 'rgba(0, 0, 0, 0.5)'});
        let element = this.$refs['download-wrap'];
        let opt = {
          width: element.scrollWidth,
          height: element.scrollHeight,
          margin: 1,
          image: {type: 'jpeg', quality: 0.98},
          html2canvas: {scale: 2},
          jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'}
        };
        html2pdf().set(opt).from(element).save(this.renderData.project_name + this.$common.getThisTime() + '.pdf').then(() => {
          loading.close();
        });
      },

      fileSaver() {
        let content = '<html><body>';
        content += this.$refs['download-wrap'].innerHTML;
        content += '</body></html>'
        let blob = new Blob([content], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, this.renderData.project_name + this.$common.getThisTime() + ".doc");
      },

      closeAll() {
        this.dialogVisible = false;
        this.renderData = null;
      },

      getLoopholes(params) {
        let content = '';
        // console.log(this.params);
        content = '';
        // row
        content += '# ' + params.name + '\r\n\r\n';
        // row
        content += '## 漏洞编号\r\n';
        content += params.number + '\r\n\r\n';
        // row
        content += '## 危害等级\r\n';
        content += params.harm_level + '\r\n\r\n';
        // row
        if (params.baseline) {
          content += '## 关联安全基线\r\n';
          content += params.baseline.name + '\r\n\r\n';
        }
        // row
        content += '## 风险描述\r\n';
        content += params.risk_description + '\r\n\r\n';
        // row
        content += '## 发现过程描述\r\n';
        content += params.discovery_process_des + '\r\n\r\n';
        // row
        content += '## 操作方法说明\r\n';
        content += params.operation_method_description + '\r\n\r\n';
        // row
        content += '## 使用工具说明\r\n';
        content += params.instructions_for_using_tools + '\r\n\r\n';
        // row
        content += '## 解决方案\r\n';
        content += params.solution + '\r\n\r\n';
        // file
        let files
        if (params.path) {
          files = JSON.parse(params.path);
        }
        if (files && files.length) {
          content += '## 附件' + '\r\n\r\n';
          files.forEach(item => {
            content += `- [${item.name}](${this.$api.download(item.path)})` + '\r\n\r\n'
          });
        }
        return content;
      },

      getLoopholeSta(loophole_sta) {
        let result = {
          high: 0,
          middle: 0,
          low: 0,
          total: 0,
        };
        if (loophole_sta && loophole_sta.length) {
          loophole_sta.forEach(item => {
            if (item.harm_level === '高') {
              result.high += item.count;
              result.total += item.count;
            } else if (item.harm_level === '中') {
              result.middle += item.count;
              result.total += item.count;
            } else if (item.harm_level === '低') {
              result.low += item.count;
              result.total += item.count;
            }
          });
        }
        return result;
      },

      getTotal(team_members) {
        let num = 0;
        for (let key in team_members) {
          let tm = team_members[key];
          num += tm.length;
        }
        return num
      },

      handleNodeClick(data) {
        // console.log(data);
        if (data.project_id && data.instance_id) {
          this.getStatisticalReport({
            project_id: data.project_id,
            instance_id: data.instance_id,
          });
        }
      },

      getStatisticalReport(params) {
        let vars = params;
        vars.key = 'statisticalReport';
        this.renderData = null;
        this.$api.ext(vars, this, data => {
          // console.log(data);
          if (data.data) {
            this.renderData = data.data;
            if (this.renderData.tasks && this.renderData.tasks.length) {
              this.renderData.tasks.forEach(tsk => {
                if (tsk.loopholes && tsk.loopholes.length) {
                  tsk.loopholes.forEach(lp => {
                    lp._loopholes = this.getLoopholes(lp);
                  })
                }
              })
            }
          }
        });
      },

      closeDialog() {
        this.$emit("update:visible", false)
      },

      getProjectAndTask() {
        let vars = {
          key: 'projectAndTask',
        };
        this.$api.ext(vars, this, data => {
          // console.log(data);
          if (data.data) {
            this.treeData = data.data;
            this.treeData.forEach(item => {
              item.task_name = item.name;
            })
          }
        });
      },

      init() {
        this.dialogVisible = this.visible;
        if (this.dialogVisible) {
          this.getProjectAndTask();
        }
      },
    },
    mounted() {
      this.init();
    },
    watch: {
      visible: {
        handler() {
          this.init();
        },
      },
      dialogVisible: {
        handler(val) {
          this.$emit('update:visible', val)
        },
      }
    }
  }
</script>

<style lang="scss" scoped>

  .download-files {
    position: absolute;
    top: -20px;
    right: -20px;
    z-index: 1;
  }

</style>
