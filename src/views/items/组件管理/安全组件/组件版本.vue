<template>
  <div>
    <edit-table
      class="margin-top-10"
      :tableColumn="tableColumn"
      :tableData="tableData"
      :tableOptions="tableOptions"
      :pages="pages"
      :lines="lines"
      :total="total"
      @on-view="onView"
      @on-edit="onEdit"
      @on-filter-name-active="onFilterNameActive"
      @on-delete="onDelete"
      @change-page="changePage"
      @change-size="changeSize"
    ></edit-table>
  </div>
</template>

<script>
  import editTable from '../../components/edit-table'

  export default {
    name: "基线版本",
    components: {
      editTable,
    },
    data() {
      return {
        // table
        tableColumn: [
          {
            prop: 'version',
            label: '版本号',
            align: 'center',
          },
          {
            prop: 'created_time',
            label: '更新时间',
            align: 'center',
          },
          {
            prop: 'creator',
            label: '更新人',
            align: 'center',
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
          // height: 'calc(100vh - 120px)',
          // height: '100%',
          sequence: true,
          selection: false,
          loading: false,
          active: [
            'view',
            // 'edit',
            // 'delete',
          ],
          filterNameActive: [

          ],
        },
        pages: 1,
        lines: 10,
        total: 0,
      }
    },
    methods: {

      goback(v) {
        if (v) {
          this.initData();
        } else {
          this.getListData();
        }
      },

      onDelete(params) {
        // console.log(params);
        let ids = [];
        params.forEach(item => {
          ids.push(item.id);
        });
        let vars = {};
        vars.key = 'security_component';
        vars.params = {
          ids: ids.join(','),
        };
        this.$api.del(vars, this, () => {
          this.$message({
            type: 'success',
            message: '删除成功'
          });
          this.goback(true);
        });
      },

      onView(params) {
        // console.log(params)
        this.$router.push({
          name: 'viewSecurityComponent',
          query: {
            id: params.row.component_id
          }
        })
      },

      onEdit(params) {
        console.log(params);
      },

      onFilterNameActive(params) {
        console.log(params)
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
        vars.key = 'component_version';
        vars.params = {
          conds: [
            'group_id = ' + this.$route.query.group_id
          ],
          dims: [],
          paging: [
            this.pages,
            this.lines
          ],
          order: ['id', 'DESC'],
        };
        this.tableOptions.loading = true;
        this.$api.get(vars, this, data => {
          // console.log(data);
          if (data.data) {
            this.total = data.data.total || 0;
            this.tableData = data.data.data || [];
            this.tableOptions.loading = false;
          }
        }, () => {
          this.tableOptions.loading = false;
        });
      },

      init() {
        this.getListData();
      }
    },
    mounted() {

      this.init();

    }
  }
</script>

<style scoped>

</style>
