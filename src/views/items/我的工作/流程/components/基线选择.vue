<template>
  <div class="wrap">
    <div class="flex-max flex-2">
      <div class="table-box">
        <div class="header">
          <span>待选基线</span>
        </div>
        <!-- search-form -->
        <search-form
          @on-search="onSearch"
        ></search-form>
        <div class="default-table">
          <el-table
            ref="rightTable"
            :data="rightTableData"
            v-loading="rightTableOptions.loading"
            highlight-current-row
            stripe
            :height="rightTableOptions.height"
            style="width: 100%"
            @selection-change="selectionRight"
            @row-click="rowClick"
          >
            <!-- 选择框 -->
            <template
              v-if="rightTableOptions.selection"
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
              v-if="rightTableOptions.sequence"
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
              v-for="item in rightTableColumn"
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
                      placement="right"
                      width="400"
                      trigger="hover">
                      <el-form ref="refForm" label-width="92px" class="default-search">
                        <el-form-item label="风险等级:">
                          <el-input
                            v-model="scope.row.risk_level"
                          >
                          </el-input>
                        </el-form-item>
                        <el-form-item label="平台:">
                          <el-input
                            v-model="scope.row._software_plat"
                          >
                          </el-input>
                        </el-form-item>
                        <el-form-item label="内容描述:">
                          <markdown
                            :disabled="true"
                            :isFull="true"
                            v-model="scope.row.security_description"
                          >
                          </markdown>
                        </el-form-item>
                        <el-form-item label="风险描述:">
                          <markdown
                            :disabled="true"
                            :isFull="true"
                            v-model="scope.row.risk_description"
                          >
                          </markdown>
                        </el-form-item>
                      </el-form>
                      <span slot="reference">
                        {{ (scope.row[item.prop] || scope.row[item.prop] === 0) ? scope.row[item.prop] : '' }}
                      </span>
                    </el-popover>
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
          </el-table>
          <!-- 底部按钮 -->
          <div class="margin-top-10 clearfix">
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
        </div>
      </div>
    </div>
    <div class="flex-full">
      <div class="super-mini-button">
        <el-button
          class="select-btn"
          type="primary"
          size="mini"
          :disabled="rightSelection.length === 0"
          @click="changeTo('left')"
        >
          <img src="../../../../../img/baisejiantou_icon.png">
        </el-button>
        <el-button
          class="select-btn"
          type="default"
          size="mini"
          :disabled="leftSelection.length === 0"
          @click="changeTo('right')"
        >
          <img src="../../../../../img/huisejiantou_icon.png">
        </el-button>
      </div>
    </div>
    <div class="flex-max flex-1">
      <div class="table-box">
        <div class="header">
          <span>已选基线</span>
        </div>
        <div class="default-table">
          <el-table
            ref="leftTable"
            :data="leftTableData"
            v-loading="leftTableOptions.loading"
            highlight-current-row
            stripe
            :height="leftTableOptions.height"
            style="width: 100%"
            @selection-change="selectionLeft"
            @row-click="rowClick"
          >
            <!-- 选择框 -->
            <template
              v-if="leftTableOptions.selection"
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
              v-if="leftTableOptions.sequence"
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
              v-for="item in leftTableColumn"
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
                      placement="right"
                      width="400"
                      trigger="hover">
                      <el-form ref="refForm" label-width="92px" class="default-search">
                        <el-form-item label="风险等级:">
                          <el-input
                            v-model="scope.row.risk_level"
                          >
                          </el-input>
                        </el-form-item>
                        <el-form-item label="平台:">
                          <el-input
                            v-model="scope.row._software_plat"
                          >
                          </el-input>
                        </el-form-item>
                        <el-form-item label="内容描述:">
                          <markdown
                            :disabled="true"
                            :isFull="true"
                            v-model="scope.row.security_description"
                          >
                          </markdown>
                        </el-form-item>
                        <el-form-item label="风险描述:">
                          <markdown
                            :disabled="true"
                            :isFull="true"
                            v-model="scope.row.risk_description"
                          >
                          </markdown>
                        </el-form-item>
                      </el-form>
                      <span slot="reference">
                        {{ (scope.row[item.prop] || scope.row[item.prop] === 0) ? scope.row[item.prop] : '' }}
                      </span>
                    </el-popover>
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
          </el-table>
        </div>
      </div>
    </div>
    <!-- popup -->
    <popup
      title="筛选"
      @on-search="onSearch"
      :visible.sync="popupVisible"
    ></popup>
  </div>
</template>

<script>
  import popup from './popup'
  import mixins from './mixins'
  import editTable from '../../../components/edit-table'
  import searchForm from './search-form';
  import Markdown from '../../../components/markDown/simple'

  export default {
    name: "基线选择",
    components: {
      popup,
      editTable,
      searchForm,
      Markdown,
    },
    mixins: [
      mixins
    ],
    props: {
      disabled: {
        type: Boolean,
        default: false,
      },
      tableColumn: {
        type: Array,
        default() {
          return []
        }
      },
      value: {
        type: Array,
        default() {
          return []
        }
      },
      setValue: {
        type: Array,
        default() {
          return []
        }
      },
      orgin_ids: {
        type: Array
      }
    },
    computed: {
      rightTableColumn() {
        return this.tableColumn.concat([{
          prop: '_isActive',
          label: '是否已选',
          align: 'center',
          width: 96,
        }]);
      },
      leftTableColumn() {
        if (this.orgin_ids && this.orgin_ids.length) {
          return this.tableColumn.concat([{
            prop: '_orginTypeRender',
            label: '原始状态',
            align: 'center',
            width: 96,
            isRender: true,
          }]);
        } else {
          return this.tableColumn
        }
      },
    },
    data() {
      return {
        defaultValue: [],
        searchParams: {},
        leftTableData: [],
        rightTableData: [],
        leftSelection: [],
        rightSelection: [],
        popupVisible: false,
        pages: 1,
        lines: 10,
        total: 0,
        linesArr: [
          5,
          10,
          15,
          20,
          30,
          40,
          50,
        ],
        leftTableOptions: {
          height: 566,
          sequence: false,
          selection: true,
          loading: false,
          hiddenDel: true,
          active: [
            // 'view',
          ],
          filterNameActive: [],
        },
        rightTableOptions: {
          height: 406,
          sequence: false,
          selection: true,
          loading: false,
          hiddenDel: true,
          active: [
            // 'view',
          ],
          filterNameActive: [],
        },
        refs: {
          leftTable: null,
          rightTable: null,
        },
      }
    },
    methods: {

      rowClick(row) {
        // console.log(row)
        window.open(this.$common.win_origin + '/#/openViewBaseline?id=' + row.id);
      },

      setLeftRef(ref) {
        this.refs.leftTable = ref;
      },
      setRightRef(ref) {
        this.refs.rightTable = ref;
      },

      onSearch(searchParams) {
        this.searchParams = searchParams;
        this.initData();
      },

      initData() {
        this.pages = 1;
        this.lines = 10;
        this.getListData();
      },

      changePage(page) {
        this.pages = page;
        this.getListData();
      },

      changeSize(size) {
        this.lines = size;
        this.getListData();
      },

      onClick(params) {
        console.log(params)
      },

      viewPopup() {
        this.popupVisible = true;
      },

      getListData() {
        let vars = {};
        vars.key = 'baseline';
        vars.params = {
          conds: [
            'latest = true',
            // 'status <> 开发中',
            'status = 已启用',
          ],
          dims: [],
          paging: [
            this.pages,
            this.lines
          ],
          order: ['id', 'DESC'],
        };
        this.rightTableOptions.loading = true;
        new Promise((resolve, reject) => {   // 增加搜索条件
          resolve(this.addSearch(this.searchParams));
        }).then(conds => {
          vars.params.conds = vars.params.conds.concat(conds);
          this.$api.get(vars, this, data => {
            // console.log(data);
            if (data) {
              this.total = data.data.total;
              this.rightTableData = data.data.data || [];
              this.rightTableData.forEach(item => {
                let _software_plat = [];
                if (item.defense_test && item.defense_test.length) {
                  item.defense_test.forEach(dt => {
                    if (dt.soft_plats && dt.soft_plats.length) {
                      dt.soft_plats.forEach(sp => {
                        _software_plat.push(sp.name)
                      })
                    }
                  })
                }
                item._software_plat = _software_plat.join(';');
              });
              this.selectRightData();
              this.rightTableOptions.loading = false;
            }
          }, () => {
            this.rightTableOptions.loading = false;
          });
        });
      },

      getValueData() {
        let vars = {};
        vars.key = 'baseline';
        vars.params = {
          conds: [],
          dims: [],
        };
        let ids = [];
        if (this.defaultValue && this.defaultValue.length) {
          // 添加默认被选中基线
          ids = ids.concat(this.defaultValue)
        }
        if (this.orgin_ids && this.orgin_ids.length) {
          // 添加原始基线
          ids = ids.concat(this.orgin_ids)
        }
        if (ids) {
          if (ids.length === 1) {
            vars.params.conds.push(
              'id = ' + ids[0]
            )
          } else {
            vars.params.conds.push(
              'id IN [' + ids.join(',') + ']'
            )
          }
        }
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data) {
            this.leftTableData = data.data || [];
            this.leftTableData.forEach(item => {
              if (this.orgin_ids && this.orgin_ids.length) {
                if (this.orgin_ids.indexOf(item.id) !== -1) {
                  // 原始的基线
                  item._orginType = 'orgin';
                }
              }
              let _software_plat = [];
              if (item.defense_test && item.defense_test.length) {
                item.defense_test.forEach(dt => {
                  if (dt.soft_plats && dt.soft_plats.length) {
                    dt.soft_plats.forEach(sp => {
                      _software_plat.push(sp.name)
                    })
                  }
                })
              }
              item._software_plat = _software_plat.join(';');
            });
            this.selectLeftData();
          }
        });
      },

      init() {
        // this.getListData();
        // console.log(this.setValue);
        if (this.setValue && this.setValue.length) {
          this.leftTableData = this.setValue;
        } else if (this.value && this.value.length) {
          this.defaultValue = this.value;
          this.getValueData();
        }
        if (this.disabled) {
          this.leftTableOptions.selection = false;
          this.rightTableOptions.selection = false;
        }
      },

      selectionLeft(selection) {
        // console.log(selection)
        this.leftSelection = selection
      },

      selectionRight(selection) {
        // console.log(selection)
        this.rightSelection = selection
      },

      onView(params) {
        // console.log(params)
        this.$router.push({
          name: 'viewBaseline',
          query: {
            id: params.row.id
          }
        })
      },

      toggleAllSelection(ref) {
        // console.log(this.$refs);
        this.refs[ref].toggleAllSelection();
      },

      changeTo(orientation) {
        if (orientation === 'left') {
          let index;
          this.rightSelection.forEach(item => {
            let off = this.leftTableData.find((fi, i) => {
              index = i;
              return fi.id === item.id
            });
            if (!off) {
              this.leftTableData.push(this.$common.deepClone(item));
            } else {
              if (this.leftTableData[index]._orginType === 'del') {
                this.leftTableData[index]._orginType = 'orgin';
              }
            }
          });
          this.rightSelection = [];
        } else if (orientation === 'right') {
          this.leftTableData.forEach(item => {
            if (item._orginType === 'orgin') {
              let fd = this.leftSelection.find(val => {
                return item.id === val.id
              });
              if (fd) {
                item._orginType = 'del'
              }
            }
          });
          this.leftTableData = this.leftTableData.filter(item => {
            let fd = this.leftSelection.find(val => {
              return item.id === val.id
            });
            if (item._orginType === 'del') {
              return true
            } else {
              return !fd;
            }
          });
          this.leftSelection = [];
        }

        this.getListData();

        this.selectLeftData();
      },

      selectLeftData() { // 验证已选基线状态
        if (this.orgin_ids && this.orgin_ids.length) {
          this.leftTableData.forEach(item => {
            if (this.orgin_ids.indexOf(item.id) === -1) {
              // 新添加的基线
              item._orginType = 'add';
            }
          });
        }
        /*
        add    this.$set(item, '_orginTypeRender', '<i class="el-icon-plus" style="color: green;"></i>');
        del    this.$set(item, '_orginTypeRender', '<i class="el-icon-minus" style="color: red;"></i>');
        orgin  this.$set(item, '_orginTypeRender', '');
        * */
        this.leftTableData.forEach(item => {
          let val = '';
          if (item._orginType === 'add') {
            // val = '<i class="el-icon-plus" style="color: green;"></i>';
            val = '<span>新增</span>';
          } else if (item._orginType === 'del') {
            // val = '<i class="el-icon-minus" style="color: red;"></i>';
            val = '<span>移除</span>';
          }
          this.$set(item, '_orginTypeRender', val);
        });
      },

      selectRightData() {
        this.rightTableData.forEach(item => {
          let fd;
          if (this.leftTableData && this.leftTableData.length) {
            fd = this.leftTableData.find(val => {
              return (item.id === val.id && val._orginType !== 'del');
            });
          }
          if (fd) {
            item._isActive = '是';
          } else {
            item._isActive = '否';
          }
        });
      },
    },
    mounted() {
      this.init();
    },
    watch: {
      leftTableData: {
        handler(val) {
          let newValue = [];
          if (val.length) {
            val.forEach(item => {
              if (item._orginType !== 'del') {
                newValue.push(item.id)
              }
            })
          }
          this.$emit('input', newValue);
          this.$emit('update:setValue', val);
          this.$emit('change-value')
        },
        deep: true,
      },
      disabled(val) {
        if (val) {
          this.leftTableOptions.selection = false;
          this.rightTableOptions.selection = false;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .wrap {
    display: flex;
    align-items: self-start;
    justify-content: center;
    overflow: hidden;

    > .flex-max {
      width: 100%;

      > .table-box {
        border-radius: 4px;
        border: 1px solid rgba(231, 234, 239, 1);

        > .header {
          height: 48px;
          line-height: 48px;
          padding: 0 14px;
        }
      }
    }

    > .flex-full {
      align-self: center;
      width: 80px;
      height: 100%;
      box-sizing: border-box;
      padding: 16px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      align-content: center;
      justify-content: center;

      .select-btn {
        margin: 10px 0;
        min-width: 48px;
        text-align: center;
      }
    }

    > .flex-2 {
      flex: 2;
    }

    > .flex-1 {
      flex: 1;
    }
  }

</style>
