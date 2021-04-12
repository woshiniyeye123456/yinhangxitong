<template>
  <div class="default-box">
    <!-- search-form -->
    <!--<search-form-->
      <!--@on-search="onSearch"-->
    <!--&gt;</search-form>-->
    <!-- act-top -->
    <!--<act-top-->
      <!--v-if="permissions.indexOf('新增') !== -1"-->
      <!--@add="add"-->
    <!--&gt;</act-top>-->
    <act-top
      @add="add"
    ></act-top>
    <edit-table
      class="margin-top-8"
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
  import searchForm from './components/search-form';
  import actTop from './components/act-top';
  import editTable from '../../components/edit-table'
  import mixins from './mixins'

  export default {
    name: "流程库",
    components: {
      searchForm,
      actTop,
      editTable,
    },
    mixins: [
      mixins
    ],
    computed: {
      permissions() {
        return this.$route.meta.permissions || [];
      }
    },
    data() {
      return {
        // table
        tableColumn: [
          {
            prop: 'title',
            label: '流程名称',
            align: 'center',
          },
          {
            prop: 'creator_name',
            label: '创建者',
            align: 'center',
          },
          {
            prop: 'created_time',
            label: '创建时间',
            align: 'center',
          },
          {
            prop: 'updater_name',
            label: '最后修改者',
            align: 'center',
          },
          {
            prop: 'updated_time',
            label: '最后修改时间',
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
          operationWidth: '110',
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
          filterNameActive: [],
        },
        pages: 1,
        lines: 10,
        total: 0,
      }
    },
    methods: {

      onSearch(searchParams) {
        this.searchParams = searchParams;
        this.initData();
      },

      add() {
        this.$router.push({
          name: 'addCustomProcessLibrary'
        })
      },

      submit(params) {
        let loading = this.$loading({background: 'rgba(0, 0, 0, 0.5)'});
        let vars = {};
        vars.key = 'circuit';
        vars.params = params;
        this.$api.save(vars, this, () => {
          loading.close();
          this.$message({
            type: 'success',
            message: '操作成功'
          });
          this.goback();
        }, () => {
          loading.close();
        });
      },

      update(params) {
        let loading = this.$loading({background: 'rgba(0, 0, 0, 0.5)'});
        let vars = {};
        vars.key = 'circuit';
        vars.params = params;
        this.$api.update(vars, this, () => {
          loading.close();
          this.$message({
            type: 'success',
            message: '操作成功'
          });
          this.goback();
        }, () => {
          loading.close();
        });
      },

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
        vars.key = 'circuit';
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
          name: 'editCustomProcessLibrary',
          params: {
            params: params.row,
            disabled: true
          }
        })
      },

      onEdit(params) {
        // console.log(params);
        this.$router.push({
          name: 'editCustomProcessLibrary',
          params: {
            params: params.row
          }
        })
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
        vars.key = 'defines';
        this.tableOptions.loading = true;
        this.$api.wf(vars, this, data => {
          // console.log(data);
          if (data) {
            this.tableData = data.data || [];
          }
          this.tableOptions.loading = false;
        }, () => {
          this.tableOptions.loading = false;
        });
      },

      init() {
        this.getListData();
      }
    },
    created() {
      // if (this.permissions.indexOf('编辑') !== -1) {
      //   this.tableOptions.filterNameActive.push({
      //     isSwitch: true,                 // isSwitch = true 不会取name, type的数据会执行handler函数的返回值的name,type
      //     // name: ['上架', '下架'],          // 不会在这里取数据
      //     // type: ['success', 'danger'],    // 不会在这里取数据
      //     handler: (data) => {
      //       if (data.source === 2) {
      //         return {
      //           name: '编辑',
      //           type: 'success',
      //         }
      //       } else {
      //         return {
      //           name: '编辑',
      //           type: 'success',
      //           disabled: true
      //         }
      //       }
      //     }
      //   })
      // }
      if (this.permissions.indexOf('编辑') !== -1) {
        this.tableOptions.active.push('edit')
      }
    },
    mounted() {

      this.init();

    }
  }
</script>

<style scoped>

</style>
