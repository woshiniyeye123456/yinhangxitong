<template>
  <div>
    <el-form label-width="96px">
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
              :tableData="item.baselines"
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
                  placeholder="基线名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="安全类型:">
                <el-input
                  v-model="item.rowParams.security_scene"
                  readonly
                  placeholder="安全类型"
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
                  placeholder="风险等级"
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
                  readonly
                  placeholder="结果描述"
                ></el-input>
              </el-form-item>
              <el-form-item label="检测结论:">
                <el-input
                  v-model="item.rowParams.result"
                  readonly
                  placeholder="检测结论"
                ></el-input>
              </el-form-item>
              <el-form-item label="附件:">
                <text-upload
                  :disabled="true"
                  :modal="false"
                  :defaultFileList="item.rowParams.files"
                  :maxImg="20"
                ></text-upload>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import editTable from '../../../components/edit-table'
  import Markdown from '../../../components/markDown/simple'
  import textUpload from '../../../components/text-upload'

  export default {
    name: "baseline-details",
    components: {
      editTable,
      Markdown,
      textUpload,
    },
    props: {
      params: {
        type: Object,
      }
    },
    data() {
      return {
        // table
        tableColumn: [
          {
            prop: 'number',
            label: '基线编号',
            align: 'center',
            minWidth: '18',
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
          height: '1027px',
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
        // editable
        editableTabsValue: '1',
        editableTabs: [],
      }
    },
    methods: {


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


      setData(data) {
        // 基线
        if (data.baselines) {
          this.editableTabs = [];
          data.baselines.forEach(item => {
            let tab = this.editableTabs.find(tab => {
              return tab.group_name === item.group;
            });
            if (tab) {
              tab.baselines.push(item);
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
          });
        }
      },
    },
    mounted() {
      this.setData(this.params)
    }
  }
</script>

<style scoped>

</style>
