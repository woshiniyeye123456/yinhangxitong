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
        <edit-table
          :tableData="rightTableData"
          :tableColumn="rightTableColumn"
          :tableOptions="rightTableOptions"
          @emit-ref="setRightRef"
          :pages="pages"
          :lines="lines"
          :total="total"
          @on-view="onView"
          @change-page="changePage"
          @change-size="changeSize"
          @selection-change="selectionRight"
          @row-click="rowClick"
        ></edit-table>
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
          <img src="../../../../img/baisejiantou_icon.png">
        </el-button>
        <el-button
          class="select-btn"
          type="default"
          size="mini"
          :disabled="leftSelection.length === 0"
          @click="changeTo('right')"
        >
          <img src="../../../../img/huisejiantou_icon.png">
        </el-button>
      </div>
    </div>
    <div class="flex-max flex-1">
      <div class="table-box">
        <div class="header">
          <span>已选基线</span>
        </div>
        <edit-table
          :tableData="leftTableData"
          :tableColumn="tableColumn"
          :tableOptions="leftTableOptions"
          @emit-ref="setLeftRef"
          @on-view="onView"
          @selection-change="selectionLeft"
          @row-click="rowClick"
        ></edit-table>
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
  import editTable from '../../components/edit-table'
  import searchForm from './search-form';

  export default {
    name: "基线选择",
    components: {
      popup,
      editTable,
      searchForm,
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
      }
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
        if (this.defaultValue && this.defaultValue.length) {
          if (this.defaultValue.length === 1) {
            vars.params.conds.push(
              'id = ' + this.defaultValue[0]
            )
          } else {
            vars.params.conds.push(
              'id IN [' + this.defaultValue.join(',') + ']'
            )
          }
        }
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data) {
            this.leftTableData = data.data || [];
          }
        });
      },

      init() {
        this.getListData();
        if (this.value && this.value.length) {
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
          this.rightSelection.forEach(item => {
            let off = this.leftTableData.find(fi => fi.id === item.id);
            if (!off) {
              this.leftTableData.push(this.$common.deepClone(item));
            }
          });
          this.rightSelection = [];
        } else if (orientation === 'right') {
          this.leftTableData = this.leftTableData.filter(item => {
            return !this.leftSelection.find(val => {
              return item.id === val.id
            })
          });
          this.leftSelection = [];
        }
        this.getListData();
      },

      selectRightData() {
        this.rightTableData.forEach(item => {
          let fd;
          if (this.leftTableData && this.leftTableData.length) {
            fd = this.leftTableData.find(val => {
              return item.id === val.id;
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
              newValue.push(item.id)
            })
          }
          this.$emit('input', newValue);
          this.$emit('update:setValue', val);
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
