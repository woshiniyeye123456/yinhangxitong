<template>
  <el-dialog
    :title="title"
    :append-to-body="true"
    :visible.sync="dialogVisible"
    width="80%"
    :close-on-click-modal="false"
    class="dialog-default"
  >
    <search-form
      @on-search="onSearch"
    ></search-form>
    <edit-table
      class="margin-top-8"
      :tableColumn="tableColumn"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :pages="pages"
      :lines="lines"
      :total="total"
      @change-page="changePage"
      @change-size="changeSize"
      @selection-change="selectionChange"
    ></edit-table>
    <div class="margin-top-10 text-right">
      <el-button
        type="default"
        @click="closeDialog"
        size="small"
      >
        取消
      </el-button>
      <el-button
        type="primary"
        @click="submit"
        size="small"
      >
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import searchForm from './dialog-search-form';
  import editTable from '../../../components/edit-table'
  import mixins from './mixins'

  export default {
    name: "attribute-popup",
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
      searchForm,
      editTable,
    },
    props: {
      id: {
        type: [Number, String],
        default: 0,
      },
      title: {
        type: String,
        default: '',
      },
      visible: {
        type: Boolean,
        default: false,
      },
    },
    computed: {},
    data() {
      return {
        dialogVisible: false,
        tableColumn: [
          {
            prop: 'name',
            label: '名称',
            align: 'center',
            minWidth: '11',
          },
          {
            prop: 'code',
            label: '编码',
            align: 'center',
            minWidth: '11',
          },
          {
            prop: 'rule',
            label: '描述',
            align: 'center',
            minWidth: '11',
          },
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
          // height: '100%',
          sequence: true,
          selection: true,
          loading: false,
          hiddenDel: true,
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
        selection: [],
      }
    },
    methods: {

      selectionChange(selection) {
        this.selection = selection;
      },

      closeDialog() {
        this.$emit("update:visible", false)
      },

      submit() {
        this.$emit('on-submit', this.selection);
        this.closeDialog();
      },


      onSearch(searchParams) {
        this.searchParams = searchParams;
        this.initData();
      },

      goback(v) {
        if (v) {
          this.initData();
        } else {
          this.getListData();
        }
      },

      changePage(page) {
        this.pages = page;
        this.getListData();
      },

      changeSize(size) {
        this.lines = size;
        this.getListData();
      },

      initData() {
        this.pages = 1;
        this.lines = 10;
        this.getListData();
      },

      getListData() {
        let vars = {};
        vars.key = 'check_tool_rule';
        vars.params = {
          conds: [
            'tool_id = ' + this.id,
          ],
          dims: [],
          paging: [
            this.pages,
            this.lines
          ],
          order: ['id', 'DESC'],
        };
        this.tableOptions.loading = true;
        new Promise((resolve, reject) => {   // 增加搜索条件
          resolve(this.addSearch(this.searchParams));
        }).then(conds => {
          vars.params.conds = vars.params.conds.concat(conds);
          this.$api.get(vars, this, data => {
            // console.log(data);
            if (data.data) {
              this.total = data.data.total || 0;
              this.tableData = data.data.data || [];
            }
            this.tableOptions.loading = false;
          }, () => {
            this.tableOptions.loading = false;
          });
        });
      },

      init() {
        this.dialogVisible = this.visible;
        if (this.dialogVisible) {
          this.selection = [];
          this.getListData();
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

</style>
