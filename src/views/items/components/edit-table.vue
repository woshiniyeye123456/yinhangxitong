<template>
  <div class="default-table">
    <el-table
      ref="editTable"
      @row-click="rowClick"
      :data="tableData"
      v-loading="tableOptions.loading"
      highlight-current-row
      stripe
      @selection-change="selectionChange"
      :height="tableOptions.height"
      style="width: 100%"
    >
      <!-- 选择框 -->
      <template
        v-if="tableOptions.selection"
      >
        <el-table-column
          type="selection"
          width="45"
          align="center"
        >
        </el-table-column>
      </template>
      <!-- 序号 -->
      <template
        v-if="tableOptions.sequence"
      >
        <el-table-column
          label="序号"
          type="index"
          width="70"
          align="center"
        >
        </el-table-column>
      </template>
      <!-- 内容字段 -->
      <template
        v-for="item in tableColumn"
      >
        <template v-if="item.scope">
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :min-width="item.minWidth"
            :align="item.align"
            :filters="item.filters"
            :filter-method="filterTag"
            :sortable="item.sortable"
          >
            <template slot-scope="scope">
              <template v-if="scope.row[item.prop]">
                <template v-if="item.filters && item.filters.length">
                  <template
                    v-for="filter in item.filters"
                  >
                    <el-tag
                      v-if="filter.value === scope.row[item.prop]"
                      :type="scope.row[item.prop] === item.tagSuccessVal ? 'success' :
                                                filter.typeColor !== undefined ? filter.typeColor : 'danger'"
                      disable-transitions
                    >
                      {{scope.row[item.prop]}}
                    </el-tag>
                  </template>
                </template>
                <template v-else>
                  <el-tag
                    :type="scope.row[item.prop] === item.tagSuccessVal ? 'success' : 'danger'"
                    disable-transitions
                  >
                    {{scope.row[item.prop]}}
                  </el-tag>
                </template>
              </template>
            </template>
          </el-table-column>
        </template>
        <template v-else-if="item.isStatus">
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :min-width="item.minWidth"
            :align="item.align"
            :sortable="item.sortable"
          >
            <template slot-scope="scope">
              <div class="table-status">
                <span class="circle"
                      :style="{'background-color': findStatusColor(item.filters, scope.row[item.prop])}"></span>
                {{ scope.row[item.prop] ? scope.row[item.prop] : '/' }}
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-else-if="item.isPopover">
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :min-width="item.minWidth"
            :align="item.align"
            :sortable="item.sortable"
          >
            <template slot-scope="scope">
              <el-popover
                :trigger="item.trigger?item.trigger:'hover'"
                :placement="item.placement?item.placement:'top'"
                :title="scope.row[item.title]"
                :content="scope.row[item.content]"
              >
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium" :type="item.type">{{ scope.row[item.prop] }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
        </template>
        <template v-else-if="item.isImg">
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :min-width="item.minWidth"
            :align="item.align"
            :sortable="item.sortable"
          >
            <template slot-scope="scope">
              <img style="width: 100%; vertical-align: middle;" :src="scope.row[item.prop]">
            </template>
          </el-table-column>
        </template>
        <template v-else-if="item.isRender">
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :min-width="item.minWidth"
            :align="item.align"
            :sortable="item.sortable"
          >
            <template slot-scope="scope">
              <div v-html="scope.row[item.prop]"></div>
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :min-width="item.minWidth"
            :align="item.align"
            :sortable="item.sortable"
          >
            <template slot-scope="scope">
              {{ (scope.row[item.prop] || scope.row[item.prop] === 0) ? scope.row[item.prop] : '' }}
            </template>
          </el-table-column>
        </template>
      </template>
      <!-- 功能字段 -->
      <template
        v-if="(tableOptions.active && tableOptions.active.length) ||
                    (tableOptions.filterNameActive && tableOptions.filterNameActive.length)"
      >

        <el-table-column
          label="操作"
          :min-width="tableOptions.minWidth"
          :width="tableOptions.minWidth ? '' : tableOptions.operationWidth || tableOptions.active.length * 65 + tableOptions.filterNameActive.length * 120 + 25"
          align="center"
        >
          <template slot-scope="scope">
            <template v-if="tableOptions.active && tableOptions.active.length">
              <el-button v-if="tableOptions.active.indexOf('view') !== -1" @click="onView(scope)"
                         type="primary"
                         plain
                         size="mini">
                查看
              </el-button>
              <el-button v-if="tableOptions.active.indexOf('edit') !== -1" @click="onEdit(scope)"
                         type="primary"
                         plain
                         size="mini">
                编辑
              </el-button>
              <el-button v-if="tableOptions.active.indexOf('delete') !== -1"
                         @click="onShowDialogDeleteOne(scope)"
                         type="warning"
                         plain
                         size="mini">
                删除
              </el-button>
            </template>
            <template v-if="tableOptions.filterNameActive && tableOptions.filterNameActive.length">
              <template
                v-for="item in tableOptions.filterNameActive"
              >
                <!-- 对象模式 -->
                <template v-if="(typeof item) === 'object'">
                  <template v-if="item.isSwitch">
                    <el-button
                      plain
                      :disabled="item.handler(scope.row).disabled"
                      @click="onFilterNameActive(scope, item.handler(scope.row).name)"
                      :type="item.handler(scope.row).type"
                      size="mini">
                      {{item.handler(scope.row).name}}
                    </el-button>
                  </template>
                  <template v-else-if="item.isDropdown">
                    <el-dropdown
                      trigger="click"
                      class="margin-left-10 margin-right-10"
                      @command="handleCommand(scope,$event)"
                    >
                      <el-button
                        size="mini"
                        plain
                        type="success"
                        style="height: 28px;"
                      >
                        {{ item.title }}
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                          v-for="(it, i) in item.menu"
                          :key="i"
                          :disabled="item.handler(scope.row, it)"
                          :command="it"
                        >
                          {{ it }}
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                  <template
                    v-else
                  >
                    <el-button
                      plain
                      :disabled="item.handler?item.handler(scope.row).disabled:false"
                      @click="onFilterNameActive(scope, item.name)" :type="item.type"
                      size="mini">
                      {{item.name}}
                    </el-button>
                  </template>
                </template>
                <!-- 字符串模式 -->
                <el-button
                  v-else
                  plain
                  @click="onFilterNameActive(scope, item)"
                  type="success"
                  size="mini">
                  {{item}}
                </el-button>
              </template>
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <!-- 底部按钮 -->
    <div class="margin-top-10 clearfix">
      <div class="fl">
        <template
          v-if="selections.length > 0"
        >
          <el-button
            @click="onShowDialogDeleteSelections"
            type="danger"
            size="mini"
            v-if="!tableOptions.hiddenDel"
          >
            删除已选
          </el-button>
          <el-button
            @click="onShowDialogReminderSelections"
            type="primary"
            size="mini"
            v-if="tableOptions.showReminder"
          >
            批量催单
          </el-button>
          <el-button
            @click="onShowDialogOnlineSelections"
            type="primary"
            size="mini"
            v-if="tableOptions.showOnline"
          >
            全部上线
          </el-button>
        </template>
      </div>
      <div class="fr" v-if="total > lines">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-size="lines"
          :page-sizes="linesArr"
          :current-page="pages"
          :total="total"
          @prev-click="changePage"
          @next-click="changePage"
          @current-change="changePage"
          @size-change="changeSize"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog
      title="温馨提示"
      :visible.sync="showDialog"
      :show-close="false"
      width="30%"
    >
            <span>
                {{
                deleter === 1 ? '确认删除吗？' :
                deleter === 2 ? '确认删除已选吗？' :
                ''
                }}
            </span>
      <span slot="footer" class="dialog-footer">
                <el-button @click="showDialog = false">取 消</el-button>
                <el-button type="primary" @click="onDelete">确 定</el-button>
              </span>
    </el-dialog>
    <el-dialog
      title="温馨提示"
      :visible.sync="showReminderDialog"
      :show-close="false"
      width="30%"
    >
            <span>
                确认批量催单吗？
            </span>
      <span slot="footer" class="dialog-footer">
                <el-button @click="showReminderDialog = false">取 消</el-button>
                <el-button type="primary" @click="onReminder">确 定</el-button>
              </span>
    </el-dialog>
    <el-dialog
      title="温馨提示"
      :visible.sync="showOnlineDialog"
      :show-close="false"
      width="30%"
    >
            <span>
                确认全部上线吗？
            </span>
      <span slot="footer" class="dialog-footer">
                <el-button @click="showOnlineDialog = false">取 消</el-button>
                <el-button type="primary" @click="onOnline">确 定</el-button>
              </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "edit-table",
    props: {
      tableData: {
        type: Array,
        default() {
          return []
        }
      },
      tableColumn: {
        type: Array,
        default() {
          return []
        }
      },
      tableOptions: {
        type: Object,
        default() {
          return {
            sequence: false,
            selection: false,
            active: [],
            filterNameActive: [],
          }
        }
      },
      clearSelection: { // 是否清除已勾选
        type: Boolean,
        default: false,
      },
      pages: {
        type: Number,
        default: 0
      },
      lines: {
        type: Number,
        default: 0
      },
      total: {
        type: Number,
        default: 0
      },
    },
    data: () => {
      return {
        linesArr: [
          5,
          10,
          15,
          20,
          30,
          40,
          50,
        ],
        showDialog: false,          // dialog 删除
        showReminderDialog: false,  // dialog 催单
        showOnlineDialog: false,    // dialog 上线
        deleter: 1, // 1 删除单个 2 删除已选
        deleteContainer: [],    // 向外传递的删除的数组
        reminderContainer: [],    // 向外传递的催单的数组
        onlineContainer: [],    // 向外传递的上线的数组
        selections: [],         // 用户选择的数组
      }
    },
    methods: {
      findStatusColor(filters, value) {
        let val = filters.find(item => {
          if (item.value === value) {
            return true
          }
        });
        if (val) {
          return val.circleColor
        }
      },

      handleCommand(scope, name) {
        this.onFilterNameActive(scope, name);
      },
      filterTag(value, row, column) {
        // console.log(value)
        // console.log(row)
        // console.log(column)
        return value === row[column.property];
      },
      selectionChange(selection) {
        this.selections = selection;
        this.$emit('selection-change', selection);
      },
      onDelete() {
        this.showDialog = false;
        this.$emit('on-delete', this.deleteContainer);
        this.$refs.editTable.clearSelection();          // 清空已选择
      },
      onReminder() {
        this.showReminderDialog = false;
        this.$emit('on-reminder', this.reminderContainer);
        this.$refs.editTable.clearSelection();          // 清空已选择
      },
      onShowDialogReminderSelections() {  // 批量催单
        this.reminderContainer = this.selections;
        this.showReminderDialog = true;
      },
      onOnline() {
        this.showOnlineDialog = false;
        this.$emit('on-online', this.onlineContainer);
        this.$refs.editTable.clearSelection();          // 清空已选择
      },
      onShowDialogOnlineSelections() {  // 全部上线
        this.onlineContainer = this.selections;
        this.showOnlineDialog = true;
      },
      onShowDialogDeleteSelections() {    // 删除已选择
        this.deleter = 2;    // 1 删除单个 2 删除已选
        this.deleteContainer = this.selections;
        this.showDialog = true;
      },
      onShowDialogDeleteOne(params) {
        this.deleter = 1;    // 1 删除单个 2 删除已选
        let item = params.row;
        item.$index = params.$index;
        this.deleteContainer = [item];    // 储存删除对象
        this.showDialog = true;
      },
      onView(params) {
        this.$emit('on-view', params);
      },
      onEdit(params) {
        this.$emit('on-edit', params);
      },
      onSpecialFilterNameActive(params, active) { // 特殊处理切换文字函数
        // console.log(params);
        // console.log(active);
        active.handler(params.row);
        // 传递动作
        // params.$active = active;
        // this.$emit('on-filter-name-active', params);
      },
      onFilterNameActive(params, active) {
        // 传递动作
        params.$active = active;
        this.$emit('on-filter-name-active', params);
      },
      changePage(page) {
        this.$emit('change-page', page);
      },
      changeSize(size) {
        this.$emit('change-size', size);
      },
      rowClick(row, event, column) {
        // console.log(row)
        // console.log(event)
        // console.log(column)
        this.$emit('row-click', row);
      },
    },
    mounted() {
      this.$emit('emit-ref', this.$refs.editTable)
    },
    watch: {
      clearSelection: {
        handler(val) {
          // console.log(val);
          if (val) {  // 清空已选择列表
            this.$refs.editTable.clearSelection();          // 清空已选择
            this.$emit('update:clearSelection', false)
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
