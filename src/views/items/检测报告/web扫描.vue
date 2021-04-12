<template>
  <div class="wrap">
    <template v-if="datas">
      <div class="text-right">
        <el-button
          type="primary"
          @click="fileSaver"
          size="small"
        >
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
      <div ref="download-wrap">
        <el-row :gutter="12"
                style="width: calc(100% - 12px); margin-left: auto; margin-right: auto"
        >
          <el-col :lg="8" :sm="12" :xs="24" class="margin-top-12">
            <panel-todo
              :panelData="panelData1"
            ></panel-todo>
          </el-col>
          <el-col :lg="8" :sm="12" :xs="24" class="margin-top-12">
            <panel-todo
              :panelData="panelData2"
            ></panel-todo>
          </el-col>
          <el-col :lg="8" :sm="12" :xs="24" class="margin-top-12">
            <panel-todo
              :panelData="panelData3"
            ></panel-todo>
          </el-col>
        </el-row>
        <section class="content margin-top-12">
          <div class="container-fluid">
            <div class="row">
              <div class="col-lg-12">
                <div class="card">
                  <div class="card-body">
                    <p>
                      <strong><i class="fab fa-searchengin"></i> 高危</strong>
                    </p>
                    <div class="table-responsive">
                      <table border="1" cellspacing="0" cellpadding="0" style="width: 100%; table-layout:fixed;"
                             class="table table-bordered table-hover table-striped dataTable no-footer">
                        <thead>
                        <tr role="row">
                          <th width="120px">
                            警报
                          </th>
                          <th width="50px">
                            风险
                          </th>
                          <th width="120px">
                            描述
                          </th>
                          <th width="120px">
                            解决方案
                          </th>
                          <th>
                            位置
                          </th>
                        </tr>
                        </thead>
                        <tbody>
                        <template
                          v-for="(item, index) in datas.alerts"
                        >
                          <tr
                            role="row"
                            v-if="high.includes(item.risk)"
                          >
                            <td class="sorting_1">{{ index }}</td>
                            <td>
                              <span class="badge bg-success">{{ item.risk }}</span><br>
                            </td>
                            <td>{{ item.description }}</td>
                            <td>{{ item.solution }}</td>
                            <td>
                              <template
                                v-for="(it, i) in item.url"
                              >
                                {{ i + ' : ' + it}} <br>
                              </template>
                            </td>
                          </tr>
                        </template>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div><!-- /.card -->
              </div>
              <!-- end row -->
            </div>
          </div>
        </section>
        <section class="content margin-top-12">
          <div class="container-fluid">
            <div class="row">
              <div class="col-lg-12">
                <div class="card">
                  <div class="card-body">
                    <p>
                      <strong><i class="fab fa-searchengin"></i> 中危</strong>
                    </p>
                    <div class="table-responsive">
                      <table border="1" cellspacing="0" cellpadding="0" style="width: 100%; table-layout:fixed;"
                             class="table table-bordered table-hover table-striped dataTable no-footer">
                        <thead>
                        <tr role="row">
                          <th width="120px">
                            警报
                          </th>
                          <th width="50px">
                            风险
                          </th>
                          <th width="120px">
                            描述
                          </th>
                          <th width="120px">
                            解决方案
                          </th>
                          <th>
                            位置
                          </th>
                        </tr>
                        </thead>
                        <tbody>
                        <template
                          v-for="(item, index) in datas.alerts"
                        >
                          <tr
                            role="row"
                            v-if="medium.includes(item.risk)"
                          >
                            <td class="sorting_1">{{ index }}</td>
                            <td>
                              <span class="badge bg-success">{{ item.risk }}</span><br>
                            </td>
                            <td>{{ item.description }}</td>
                            <td>{{ item.solution }}</td>
                            <td>
                              <template
                                v-for="(it, i) in item.url"
                              >
                                {{ i + ' : ' + it}} <br>
                              </template>
                            </td>
                          </tr>
                        </template>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div><!-- /.card -->
              </div>
              <!-- end row -->
            </div>
          </div>
        </section>
      </div>
      <section class="content margin-top-12">
        <div class="container-fluid">
          <div class="row">
            <div class="col-lg-12">
              <div class="card">
                <div class="card-body">
                  <p>
                    <strong><i class="fab fa-searchengin"></i> 低危</strong>
                  </p>
                  <div class="table-responsive">
                    <table border="1" cellspacing="0" cellpadding="0" style="width: 100%; table-layout:fixed;"
                           class="table table-bordered table-hover table-striped dataTable no-footer">
                      <tbody>
                      <template
                        v-for="(item, index) in datas.alerts"
                      >
                        <tr
                          role="row"
                          v-if="low.includes(item.risk)"
                        >
                          <td class="sorting_1" width="120px">{{ index }}</td>
                          <td width="50px">
                            <span class="badge bg-success">{{ item.risk }}</span><br>
                          </td>
                          <td width="120px">{{ item.description }}</td>
                          <td width="120px">{{ item.solution }}</td>
                          <td>
                            <template
                              v-for="(it, i) in item.url"
                            >
                              {{ i + ' : ' + it}} <br>
                            </template>
                          </td>
                        </tr>
                      </template>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
  import FileSaver from 'file-saver';
  import html2pdf from 'html2pdf.js'
  import panelTodo from './components/panel-todo1';
  import icon1 from '../../../img/icons/securityPortrait/icon-1.png'
  import icon2 from '../../../img/icons/securityPortrait/icon-2.png'
  import icon3 from '../../../img/icons/securityPortrait/icon-3.png'

  export default {
    name: "web扫描",
    components: {
      panelTodo
    },
    data() {
      return {
        panelData1: {
          url: icon1,
          val: 0,
          title: '高危',
          duration: 1200,
          decimals: 0,
          color: '#1B95EA',
        },
        panelData2: {
          url: icon2,
          val: 0,
          title: '中危',
          duration: 1600,
          decimals: 0,
          color: '#31BC85',
        },
        panelData3: {
          url: icon3,
          val: 0,
          text: '',
          title: '低危',
          duration: 2000,
          decimals: 0,
          color: '#F67E45',
        },
        datas: null,
        hidden: false,
        high: ['High'],
        medium: ['Medium'],
        low: ['Informational', 'Low'],
      }
    },
    methods: {

      saveAs() {
        this.hidden = true;
        let loading = this.$loading({background: 'rgba(0, 0, 0, 0.5)'});
        let element = this.$refs['download-wrap'];
        let opt = {
          filename: `${this.datas.external_system.name}WEB扫描报告${this.$common.getThisTime()}` + '.pdf',
          width: element.scrollWidth,
          height: element.scrollHeight,
          margin: 1,
          image: {type: 'jpeg', quality: 0.98},
          html2canvas: {scale: 1},
          jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'}
        };
        html2pdf().set(opt).from(element).save().then(() => {
          this.hidden = false;
          loading.close();
        });
      },

      fileSaver() {
        let content = '<html><body>';
        content += this.$refs['download-wrap'].innerHTML;
        content += '</body></html>';
        let blob = new Blob([content], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, `${this.datas.external_system.name}WEB扫描报告${this.$common.getThisTime()}` + ".doc");
      },

      getData(workflow_id) {
        let vars = {
          workflow_id,
          key: 'view',
          name: 'taskData',
        };
        this.$api.wf(vars, this, data => {
          if (data && data.data) {
            this.datas = data.data.bangcleLoopholeChecker;
            this.panelData1.val = 0;
            this.panelData2.val = 0;
            this.panelData3.val = 0;
            for (let key in this.datas.alerts) {
              let item = this.datas.alerts[key];
              if (this.high.includes(item.risk)) {
                this.panelData1.val += Object.keys(item.url).length;
              }
              if (this.medium.includes(item.risk)) {
                this.panelData2.val += Object.keys(item.url).length;
              }
              if (this.low.includes(item.risk)) {
                this.panelData3.val += Object.keys(item.url).length;
              }
            }
          }
        });
      },
    },
    created() {
      if (this.$route.query && this.$route.query.workflow_id) {
        this.getData(+this.$route.query.workflow_id);
      }
    },
  }
</script>

<style lang="scss" scoped>

  .wrap {
    padding: 0 15px;
    height: 100%;
    overflow-y: auto;
    .hidden {
      display: none;
    }

    table.dataTable {
      clear: both;
      margin-top: 6px !important;
      margin-bottom: 6px !important;
      max-width: none !important;
      border-collapse: separate !important;
      border-spacing: 0
    }
    table.dataTable td, table.dataTable th {
      -webkit-box-sizing: content-box;
      box-sizing: content-box
    }
    table.dataTable td.dataTables_empty, table.dataTable th.dataTables_empty {
      text-align: center
    }
    table.dataTable.nowrap th, table.dataTable.nowrap td {
      white-space: nowrap
    }
    div.dataTables_wrapper div.dataTables_length label {
      font-weight: normal;
      text-align: left;
      white-space: nowrap
    }
    div.dataTables_wrapper div.dataTables_length select {
      width: auto;
      display: inline-block
    }
    div.dataTables_wrapper div.dataTables_filter {
      text-align: right
    }
    div.dataTables_wrapper div.dataTables_filter label {
      font-weight: normal;
      white-space: nowrap;
      text-align: left
    }
    div.dataTables_wrapper div.dataTables_filter input {
      margin-left: 0.5em;
      display: inline-block;
      width: auto
    }
    div.dataTables_wrapper div.dataTables_info {
      padding-top: 0.85em;
      white-space: nowrap
    }
    div.dataTables_wrapper div.dataTables_paginate {
      margin: 0;
      white-space: nowrap;
      text-align: right
    }
    div.dataTables_wrapper div.dataTables_paginate ul.pagination {
      margin: 2px 0;
      white-space: nowrap;
      justify-content: flex-end
    }
    div.dataTables_wrapper div.dataTables_processing {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 200px;
      margin-left: -100px;
      margin-top: -26px;
      text-align: center;
      padding: 1em 0
    }
    table.dataTable thead > tr > th.sorting_asc, table.dataTable thead > tr > th.sorting_desc, table.dataTable thead > tr > th.sorting, table.dataTable thead > tr > td.sorting_asc, table.dataTable thead > tr > td.sorting_desc, table.dataTable thead > tr > td.sorting {
      padding-right: 30px
    }
    table.dataTable thead > tr > th:active, table.dataTable thead > tr > td:active {
      outline: none
    }
    table.dataTable thead .sorting, table.dataTable thead .sorting_asc, table.dataTable thead .sorting_desc, table.dataTable thead .sorting_asc_disabled, table.dataTable thead .sorting_desc_disabled {
      cursor: pointer;
      position: relative
    }
    table.dataTable thead .sorting:before, table.dataTable thead .sorting:after, table.dataTable thead .sorting_asc:before, table.dataTable thead .sorting_asc:after, table.dataTable thead .sorting_desc:before, table.dataTable thead .sorting_desc:after, table.dataTable thead .sorting_asc_disabled:before, table.dataTable thead .sorting_asc_disabled:after, table.dataTable thead .sorting_desc_disabled:before, table.dataTable thead .sorting_desc_disabled:after {
      position: absolute;
      bottom: 0.9em;
      display: block;
      opacity: 0.3
    }
    table.dataTable thead .sorting:before, table.dataTable thead .sorting_asc:before, table.dataTable thead .sorting_desc:before, table.dataTable thead .sorting_asc_disabled:before, table.dataTable thead .sorting_desc_disabled:before {
      right: 1em;
      content: "\2191"
    }
    table.dataTable thead .sorting:after, table.dataTable thead .sorting_asc:after, table.dataTable thead .sorting_desc:after, table.dataTable thead .sorting_asc_disabled:after, table.dataTable thead .sorting_desc_disabled:after {
      right: 0.5em;
      content: "\2193"
    }
    table.dataTable thead .sorting_asc:before, table.dataTable thead .sorting_desc:after {
      opacity: 1
    }
    table.dataTable thead .sorting_asc_disabled:before, table.dataTable thead .sorting_desc_disabled:after {
      opacity: 0
    }
    div.dataTables_scrollHead table.dataTable {
      margin-bottom: 0 !important
    }
    div.dataTables_scrollBody table {
      border-top: none;
      margin-top: 0 !important;
      margin-bottom: 0 !important
    }
    div.dataTables_scrollBody table thead .sorting:before, div.dataTables_scrollBody table thead .sorting_asc:before, div.dataTables_scrollBody table thead .sorting_desc:before, div.dataTables_scrollBody table thead .sorting:after, div.dataTables_scrollBody table thead .sorting_asc:after, div.dataTables_scrollBody table thead .sorting_desc:after {
      display: none
    }
    div.dataTables_scrollBody table tbody tr:first-child th, div.dataTables_scrollBody table tbody tr:first-child td {
      border-top: none
    }
    div.dataTables_scrollFoot > .dataTables_scrollFootInner {
      box-sizing: content-box
    }
    div.dataTables_scrollFoot > .dataTables_scrollFootInner > table {
      margin-top: 0 !important;
      border-top: none
    }
    @media screen and (max-width: 767px) {
      div.dataTables_wrapper div.dataTables_length, div.dataTables_wrapper div.dataTables_filter, div.dataTables_wrapper div.dataTables_info, div.dataTables_wrapper div.dataTables_paginate {
        text-align: center
      }
    }
    table.dataTable.table-sm > thead > tr > th {
      padding-right: 20px
    }
    table.dataTable.table-sm .sorting:before, table.dataTable.table-sm .sorting_asc:before, table.dataTable.table-sm .sorting_desc:before {
      top: 5px;
      right: 0.85em
    }
    table.dataTable.table-sm .sorting:after, table.dataTable.table-sm .sorting_asc:after, table.dataTable.table-sm .sorting_desc:after {
      top: 5px
    }
    table.table-bordered.dataTable th, table.table-bordered.dataTable td {
      border-left-width: 0
    }
    table.table-bordered.dataTable th:last-child, table.table-bordered.dataTable th:last-child, table.table-bordered.dataTable td:last-child, table.table-bordered.dataTable td:last-child {
      border-right-width: 0
    }
    table.table-bordered.dataTable tbody th, table.table-bordered.dataTable tbody td {
      border-bottom-width: 0
    }
    div.dataTables_scrollHead table.table-bordered {
      border-bottom-width: 0
    }
    div.table-responsive > div.dataTables_wrapper > div.row {
      margin: 0
    }
    div.table-responsive > div.dataTables_wrapper > div.row > div[class^="col-"]:first-child {
      padding-left: 0
    }
    div.table-responsive > div.dataTables_wrapper > div.row > div[class^="col-"]:last-child {
      padding-right: 0
    }

    .table-striped tbody tr:nth-of-type(odd) {
      background-color: rgba(0, 0, 0, .05);
    }

    .table-bordered {
      border: 1px solid #dee2e6;
      width: 100%;
      background-color: transparent;
    }

    .table td, .table th {
      padding: .75rem;
      vertical-align: top;
      border-top: 1px solid #dee2e6;
    }
    .table-bordered td, .table-bordered th {
      border: 1px solid #dee2e6;
    }
    table.dataTable td, table.dataTable th {
      -webkit-box-sizing: content-box;
      box-sizing: content-box;
    }
    table.table-bordered.dataTable th, table.table-bordered.dataTable td {
      border-left-width: 0;
    }
    table.table-bordered.dataTable tbody th, table.table-bordered.dataTable tbody td {
      border-bottom-width: 0;
    }

    .card {
      position: relative;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-direction: column;
      flex-direction: column;
      min-width: 0;
      word-wrap: break-word;
      background-color: #fff;
      background-clip: border-box;
      border: 0 solid rgba(0, 0, 0, .125);
      border-radius: .25rem;
    }

    .card {
      box-shadow: 0 0 1px rgba(0, 0, 0, .125), 0 1px 3px rgba(0, 0, 0, .2);
      margin-bottom: 1rem;
    }

    .card-body {
      -ms-flex: 1 1 auto;
      flex: 1 1 auto;
      padding: 1.25rem;
    }

    .content {
      padding: 0 .5rem;
    }

    .row {
      display: -ms-flexbox;
      display: flex;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap;
      margin-right: -7.5px;
      margin-left: -7.5px;
    }

    .col-2 {
      -ms-flex: 0 0 16.666667%;
      flex: 0 0 16.666667%;
      max-width: 16.666667%;
    }

    .col-4 {
      -ms-flex: 0 0 33.333333%;
      flex: 0 0 33.333333%;
      max-width: 33.333333%;
    }

    .col-6 {
      -ms-flex: 0 0 50%;
      flex: 0 0 50%;
      max-width: 50%;
    }

    .col-lg-12 {
      -ms-flex: 0 0 100%;
      flex: 0 0 100%;
      max-width: 100%;
    }

    .badge {
      display: inline-block;
      padding: .25em .4em;
      font-size: 75%;
      font-weight: 700;
      line-height: 1;
      text-align: center;
      white-space: nowrap;
      vertical-align: baseline;
      border-radius: .25rem;
      transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    }

    .bg-info {
      background-color: #17a2b8 !important;
    }

    .bg-info, .bg-info > a {
      color: #fff !important;
    }

    .bg-success {
      background-color: #28a745 !important;
    }

    .bg-success, .bg-success > a {
      color: #fff !important;
    }

    .bg-primary {
      background-color: #007bff !important;
    }

    .bg-primary, .bg-primary > a {
      color: #fff !important;
    }

    .col-md-3 {
      -ms-flex: 0 0 25%;
      flex: 0 0 25%;
      max-width: 25%;
    }

    .small-box {
      border-radius: .25rem;
      box-shadow: 0 0 1px rgba(0, 0, 0, .125), 0 1px 3px rgba(0, 0, 0, .2);
      display: block;
      margin-bottom: 20px;
      position: relative;
    }

    .bg-info {
      background-color: #17a2b8 !important;
    }

    .bg-info, .bg-info > a {
      color: #fff !important;
    }

    .small-box > .inner {
      padding: 10px;
    }

    .small-box h3 {
      font-size: 2.2rem;
      font-weight: 700;
      margin: 0 0 10px 0;
      padding: 0;
      white-space: nowrap;
    }

    .small-box p {
      font-size: 1rem;
    }

    .col, .col-1, .col-10, .col-11, .col-12, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-auto, .col-lg, .col-lg-1, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-auto, .col-md, .col-md-1, .col-md-10, .col-md-11, .col-md-12, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-auto, .col-sm, .col-sm-1, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-auto, .col-xl, .col-xl-1, .col-xl-10, .col-xl-11, .col-xl-12, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-auto {
      position: relative;
      width: 100%;
      padding-right: 7.5px;
      padding-left: 7.5px;
    }

    .col-5 {
      -ms-flex: 0 0 41.6666666667%;
      flex: 0 0 41.6666666667%;
      max-width: 41.6666666667%;
    }

    .col-4 {
      -ms-flex: 0 0 33.333333%;
      flex: 0 0 33.333333%;
      max-width: 33.333333%;
    }

    .col-3 {
      -ms-flex: 0 0 25%;
      flex: 0 0 25%;
      max-width: 25%;
    }

    .col-2 {
      -ms-flex: 0 0 16.666667%;
      flex: 0 0 16.666667%;
      max-width: 16.666667%;
    }

    .small-box > .small-box-footer {
      background: rgba(0, 0, 0, .1);
      color: rgba(255, 255, 255, .8);
      display: block;
      padding: 3px 0;
      position: relative;
      text-align: center;
      text-decoration: none;
      z-index: 10;
    }

    .bg-warning {
      background-color: #ffc107 !important;
    }

    .bg-warning, .bg-warning > a {
      color: #1f2d3d !important;
    }

    .bg-danger {
      background-color: #dc3545 !important;
    }

    .bg-danger, .bg-danger > a {
      color: #fff !important;
    }

    .info-box {
      box-shadow: 0 0 1px rgba(0, 0, 0, .125), 0 1px 3px rgba(0, 0, 0, .2);
      border-radius: .25rem;
      background: #fff;
      display: -ms-flexbox;
      display: flex;
      margin-bottom: 1rem;
      min-height: 80px;
      padding: .5rem;
      position: relative;
    }

    .info-box .info-box-icon {
      border-radius: .25rem;
      -ms-flex-align: center;
      align-items: center;
      display: -ms-flexbox;
      display: flex;
      font-size: 1.875rem;
      -ms-flex-pack: center;
      justify-content: center;
      text-align: center;
      width: 70px;
    }

    .info-box .info-box-content {
      -ms-flex: 1;
      flex: 1;
      padding: 5px 10px;
    }

    .info-box .info-box-text, .info-box .progress-description {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .info-box .info-box-number {
      display: block;
      font-weight: 700;
    }

    table.dataTable {
      clear: both;
      margin-top: 6px !important;
      margin-bottom: 6px !important;
      max-width: none !important;
      border-collapse: separate !important;
      border-spacing: 0;
    }

    .table-bordered {
      border: 1px solid #dee2e6;
    }

  }
</style>
