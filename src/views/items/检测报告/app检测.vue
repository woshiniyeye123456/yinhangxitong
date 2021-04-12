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
        <template v-if="datas.app_type === 'apk'">
          <section class="content">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg-12">

                  <div class="card">
                    <div class="card-body">
                      <h5 class="card-title"></h5>
                      <div class="row">
                        <div class="col-2">
                          <p><strong><i class="fas fa-check-double"></i> 应用评分</strong></p>

                          <br>
                          <span class="badge bg-info">平均CVSS</span> <strong> {{ datas.average_cvss || 0
                          }} </strong><br>
                          <span class="badge bg-success">安全评分</span> <strong>{{ datas.security_score || 0
                          }}/100 </strong><br>

                          <span class="badge bg-success">追踪器检测</span> <strong>{{ datas.trackers_detection || 0
                          }}/304</strong><br>


                        </div>
                        <div class="col-6">
                          <p><strong><i class="fas fa-box-open"></i> 文件信息 </strong></p>
                          <span class="badge bg-primary">文件名</span>
                          {{ datas.file_name }}<br>
                          <span class="badge bg-primary">大小</span>
                          {{ datas.size }}<br>
                          <span class="badge bg-primary">MD5</span>
                          {{ datas.md5 }}<br>
                          <span class="badge bg-primary">SHA1</span>
                          {{ datas.sha1 }}<br>
                          <span class="badge bg-primary">SHA256</span>
                          {{ datas.sha256 }}<br>
                        </div>
                        <div class="col-4">
                          <p><strong><i class="fas fa-info"></i> 应用信息 </strong></p>
                          <span class="badge bg-primary">应用名称</span>
                          {{ datas.app_name }}<br>
                          <span class="badge bg-primary">包名</span>
                          {{ datas.package_name }}<br>
                          <span class="badge bg-primary">主Activity</span>
                          {{ datas.main_activity }}<br>
                          <span class="badge bg-primary">目标SDK</span>
                          {{ datas.target_sdk }}
                          <span class="badge bg-primary">最小SDK</span>
                          {{ datas.min_sdk }}
                          <span class="badge bg-primary">最大SDK</span>
                          {{ datas.max_sdk }}
                          <br>
                          <span class="badge bg-primary">{{ datas.app_type === 'apk' ?  'Android' : datas.app_type === 'ipa' ? 'iOS' : '' }} 版本名称</span>
                          {{ datas.version_name }}
                          <span class="badge bg-primary">{{ datas.app_type === 'apk' ?  'Android' : datas.app_type === 'ipa' ? 'iOS' : '' }} 版本编码</span>
                          {{ datas.version_code }}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
                <!-- Play Store -->

                <!-- /.col -->
                <!-- row and container-->
              </div>
            </div>

            <!-- Boxes -->
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg-12">

                  <div class="card">
                    <div class="card-body">
                      <h5 class="card-title"></h5>
                      <div class="row">
                        <!-- Boxes columns -->
                        <div class="col-12 col-sm-6 col-md-3">
                          <!-- small box -->
                          <div class="small-box bg-info">
                            <div class="inner">
                              <h3>{{ datas.activities && datas.activities.length || 0 }}</h3>

                              <p>ACTIVITIES</p>
                            </div>
                          </div>
                        </div>
                        <!-- ./col -->
                        <div class="col-12 col-sm-6 col-md-3">
                          <!-- small box -->
                          <div class="small-box bg-success">
                            <div class="inner">
                              <h3>{{ datas.services && datas.services.length || 0 }}</h3>

                              <p>SERVICES</p>
                            </div>
                          </div>
                        </div>
                        <!-- ./col -->
                        <div class="col-12 col-sm-6 col-md-3">
                          <!-- small box -->
                          <div class="small-box bg-warning">
                            <div class="inner">
                              <h3>{{ datas.receivers && datas.receivers.length || 0 }}</h3>

                              <p>RECEIVERS</p>
                            </div>
                          </div>
                        </div>
                        <!-- ./col -->
                        <div class="col-12 col-sm-6 col-md-3">
                          <!-- small box -->
                          <div class="small-box bg-danger">
                            <div class="inner">
                              <h3>{{ datas.providers && datas.providers.length || 0 }}</h3>

                              <p>PROVIDERS</p>
                            </div>
                          </div>
                          <!-- /.row -->
                        </div><!-- /.container-fluid -->
                        <!--<div class="col-12 col-sm-6 col-md-3">-->
                        <!--<div class="info-box">-->
                        <!--<span class="info-box-icon bg-info elevation-1"><i class="fas fa-language"></i></span>-->

                        <!--<div class="info-box-content">-->
                        <!--<span class="info-box-text">Exported <br>Activities</span>-->
                        <!--<span class="info-box-number">-->
                        <!--1-->
                        <!--</span>-->
                        <!--</div>-->
                        <!--&lt;!&ndash; /.info-box-content &ndash;&gt;-->
                        <!--</div>-->
                        <!--&lt;!&ndash; /.info-box &ndash;&gt;-->
                        <!--</div>-->
                        <!--&lt;!&ndash; /.col &ndash;&gt;-->
                        <!--<div class="col-12 col-sm-6 col-md-3">-->
                        <!--<div class="info-box mb-3">-->
                        <!--<span class="info-box-icon bg-success elevation-1"><i class="fas fa-cogs"></i></span>-->

                        <!--<div class="info-box-content">-->
                        <!--<span class="info-box-text">Exported <br>Services</span>-->
                        <!--<span class="info-box-number">0</span>-->
                        <!--</div>-->
                        <!--&lt;!&ndash; /.info-box-content &ndash;&gt;-->
                        <!--</div>-->
                        <!--&lt;!&ndash; /.info-box &ndash;&gt;-->
                        <!--</div>-->
                        <!--&lt;!&ndash; /.col &ndash;&gt;-->

                        <!--&lt;!&ndash; fix for small devices only &ndash;&gt;-->
                        <!--<div class="clearfix hidden-md-up"></div>-->

                        <!--<div class="col-12 col-sm-6 col-md-3">-->
                        <!--<div class="info-box mb-3">-->
                        <!--<span class="info-box-icon bg-warning elevation-1"><i-->
                        <!--class="fas fa-assistive-listening-systems"></i></span>-->

                        <!--<div class="info-box-content">-->
                        <!--<span class="info-box-text">Exported <br>Receivers</span>-->
                        <!--<span class="info-box-number">0</span>-->
                        <!--</div>-->
                        <!--&lt;!&ndash; /.info-box-content &ndash;&gt;-->
                        <!--</div>-->
                        <!--&lt;!&ndash; /.info-box &ndash;&gt;-->
                        <!--</div>-->
                        <!--&lt;!&ndash; /.col &ndash;&gt;-->
                        <!--<div class="col-12 col-sm-6 col-md-3">-->
                        <!--<div class="info-box mb-3">-->
                        <!--<span class="info-box-icon bg-danger elevation-1"><i class="fas fa-database"></i></span>-->

                        <!--<div class="info-box-content">-->
                        <!--<span class="info-box-text">Exported <br>Providers</span>-->
                        <!--<span class="info-box-number">0</span>-->
                        <!--</div>-->
                        <!--&lt;!&ndash; /.info-box-content &ndash;&gt;-->
                        <!--</div>-->
                        <!--&lt;!&ndash; /.info-box &ndash;&gt;-->
                        <!--</div>-->
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </section>
          <!-- =========================end information==================================== -->
          <section class="content">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg-12">
                  <div class="card">
                    <div class="card-body">
                      <p>
                        <strong><i class="fa fa-certificate"></i> 签名信息</strong>
                      </p>
                      <pre><code>
                  {{ datas.certificate_analysis && datas.certificate_analysis.certificate_info }}
                </code></pre>
                      <!--Cert status-->

                      <!--<strong>证书状态: </strong><span-->
                      <!--class="badge bg-danger">{{ datas.certificate_analysis && datas.certificate_analysis.certificate_status }}</span><br/>-->
                      <!--<strong>描述:</strong>{{ datas.certificate_analysis && datas.certificate_analysis.description }}<br/>-->


                    </div>
                  </div><!-- /.card -->
                </div>
                <!-- end row -->
              </div>
            </div>
          </section>
          <!-- ===========================end cert ================================== -->
          <section class="content">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg-12">
                  <div class="card">
                    <div class="card-body">
                      <p>
                        <strong><i class="fa fa-list"></i> 应用权限</strong>
                      <p>
                      <div class="table-responsive">
                        <table border="1" cellspacing="0" cellpadding="0" style="width: 100%; table-layout:fixed;"
                               id="table_permissions"
                               class="table table-bordered table-hover table-striped">
                          <thead>
                          <tr>
                            <th>权限申请</th>
                            <th>权限等级</th>
                            <th>信息</th>
                            <th>描述</th>
                          </tr>
                          </thead>
                          <tbody>

                          <tr
                            v-for="(item, index) in datas.permissions"
                            :key="index"
                          >
                            <td>{{ index }}</td>
                            <td>

                              <span class="badge bg-danger">{{ item.status }}</span>

                            </td>
                            <td>{{ item.info }}</td>
                            <td>
                              {{ item.description }}
                            </td>
                          </tr>

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
          <!-- ===========================end permission ================================== -->
          <section class="content">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg-12">
                  <div class="card">
                    <div class="card-body">
                      <p>
                        <strong><i class="fa fa-list"></i> 隐私数据外发</strong>
                      <p>
                      <div class="table-responsive">
                        <table border="1" cellspacing="0" cellpadding="0" style="width: 100%; table-layout:fixed;"
                               class="table table-bordered table-hover table-striped">
                          <thead>
                          <tr>
                            <th>个人信息</th>
                            <th>等级</th>
                            <th>分类</th>
                            <th>是否采集</th>
                            <th>是否外发</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr
                            v-for="item in datas.hardCode"
                          >
                            <td>{{ item.information }}</td>
                            <td>
                              <span class="badge" :class="item.level === '普通个人信息' ? 'bg-primary' : 'bg-danger'">{{ item.level }}</span>
                            </td>
                            <td>{{ item.type }}</td>
                            <td>
                              <span class="badge bg-success">{{ item.collect }}</span>
                            <td>{{ item.outgoing }}</td>
                          </tr>
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
          <!-- ===========================end permission ================================== -->
          <section class="content">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg-12">
                  <div class="card">
                    <div class="card-body">
                      <p>
                        <strong><i class="fa fa-flag"></i> so库分析</strong>
                      </p>
                      <div class="table-responsive">
                        <table border="1" cellspacing="0" cellpadding="0" style="width: 100%; table-layout:fixed;"
                               id="table_binary"
                               class="table table-bordered table-hover table-striped">
                          <thead>
                          <tr>
                            <th>问题</th>
                            <th>严重性</th>
                            <th>描述</th>
                            <th>文件</th>

                          </tr>
                          </thead>
                          <tbody>

                          <tr
                            v-for="(item, index) in datas.binary_analysis"
                            :key="index"
                          >
                            <td>{{ index }}</td>
                            <td>

                              <span class="badge bg-info">{{ item.status }}</span>

                            </td>
                            <td>{{ item.info }}</td>
                            <td>
                              {{ item.description }}
                            </td>
                          </tr>

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
          <!-- ===========================end binary analysis ================================== -->
          <section class="content">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg-12">
                  <div class="card">
                    <div class="card-body">
                      <p>
                        <strong><i class="fas fa-clone"></i> 可访问activity</strong>
                      </p>
                      <div class="table-responsive">
                        <table border="1" cellspacing="0" cellpadding="0" style="width: 100%; table-layout:fixed;"
                               id="table_browsable"
                               class="table table-bordered table-hover table-striped">
                          <thead>
                          <tr>
                            <th>ACTIVITY</th>
                          </tr>
                          </thead>
                          <tbody>

                          <tr
                            v-for="(item, index) in datas.browsable_activities"
                            :key="index"
                          >
                            <td>{{ index }}</td>
                          </tr>

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
          <!-- ===========================end browsable activities ================================== -->
          <section class="content">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg-12">
                  <div class="card">
                    <div class="card-body">
                      <p>
                        <strong><i class="fas fa-search"></i> manifiest文件分析</strong>
                      </p>
                      <div class="table-responsive">
                        <table border="1" cellspacing="0" cellpadding="0" style="width: 100%; table-layout:fixed;"
                               id="table_manifest"
                               class="table table-bordered table-hover table-striped">
                          <thead>
                          <tr>
                            <th>问题</th>
                            <th>严重性</th>
                            <th>描述</th>
                          </tr>
                          </thead>
                          <tbody>

                          <tr
                            v-for="(item, index) in datas.manifest_analysis"
                            :key="index"
                          >
                            <td>
                              {{ item.title }}
                            </td>
                            <td>
                              <span class="badge bg-warning">{{ item.stat }}</span>
                            </td>
                            <td>
                              {{ item.desc }}
                            </td>
                          </tr>

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
          <!-- ===========================end manifest analysis ================================== -->
          <section class="content">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg-12">
                  <div class="card">
                    <div class="card-body">
                      <p>
                        <strong><i class="fas fa-code"></i> 代码分析</strong>
                      </p>
                      <div class="table-responsive">
                        <table border="1" cellspacing="0" cellpadding="0" style="width: 100%; table-layout:fixed;"
                               id="table_code"
                               class="table table-bordered table-hover table-striped">
                          <thead>
                          <tr>
                            <th>问题</th>
                            <th>严重性</th>
                            <th>标准</th>
                            <th>文件</th>
                          </tr>
                          </thead>
                          <tbody>

                          <tr
                            v-for="(item, index) in datas.code_analysis"
                            :key="index"
                          >
                            <td>
                              {{ item.metadata.description }}
                            </td>
                            <td>
                              <span class="badge bg-info">{{ item.metadata.severity }}</span>
                            </td>
                            <td>
                              <template v-for="(it, i) in item.metadata">
                                <strong>{{ i }}:</strong>
                                {{ it }}
                                <br/>
                              </template>
                            </td>
                            <td>
                              <div
                                v-for="(it, i) in item.files"
                              >
                                {{ i + ' : ' + it }}
                              </div>
                            </td>
                          </tr>

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
          <!--<section class="content">-->
            <!--<div class="container-fluid">-->
              <!--<div class="row">-->
                <!--<div class="col-lg-12">-->
                  <!--<div class="card">-->
                    <!--<div class="card-body">-->
                      <!--<p>-->
                        <!--<strong><i class="fas fa-code"></i> 代码分析</strong>-->
                      <!--</p>-->
                      <!--<div class="table-responsive">-->
                        <!--<table border="1" cellspacing="0" cellpadding="0" style="width: 100%; table-layout:fixed;"-->
                               <!--id="table_code"-->
                               <!--class="table table-bordered table-hover table-striped">-->
                          <!--<thead>-->
                          <!--<tr>-->
                            <!--<th>问题</th>-->
                            <!--<th>严重性</th>-->
                            <!--<th>标准</th>-->
                            <!--<th>文件</th>-->
                          <!--</tr>-->
                          <!--</thead>-->
                          <!--<tbody>-->

                          <!--<tr-->
                            <!--v-for="(item, index) in datas.code_analysis"-->
                            <!--:key="index"-->
                          <!--&gt;-->
                            <!--<td>-->
                              <!--{{ index }}-->
                            <!--</td>-->
                            <!--<td>-->
                              <!--<span class="badge bg-info">{{ item.level }}</span>-->
                            <!--</td>-->
                            <!--<td>-->
                              <!--<template v-for="(it, i) in item">-->
                                <!--<strong>{{ i }}:</strong>-->
                                <!--{{ it }}-->
                                <!--<br/>-->
                              <!--</template>-->
                            <!--</td>-->
                            <!--<td>-->
                              <!--<div-->
                                <!--v-for="(it, i) in item.path"-->
                              <!--&gt;-->
                                <!--{{ i + ' : ' + it }}-->
                              <!--</div>-->
                            <!--</td>-->
                          <!--</tr>-->

                          <!--</tbody>-->
                        <!--</table>-->
                      <!--</div>-->
                    <!--</div>-->
                  <!--</div>&lt;!&ndash; /.card &ndash;&gt;-->
                <!--</div>-->
                <!--&lt;!&ndash; end row &ndash;&gt;-->
              <!--</div>-->
            <!--</div>-->
          <!--</section>-->
          <!-- ===========================end code analysis ================================== -->
          <section class="content">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg-12">
                  <div class="card">
                    <div class="card-body">
                      <p>
                        <strong><i class="fas fa-code"></i> 恶意程序检测</strong>
                      </p>
                      <div class="table-responsive">
                        <table border="1" cellspacing="0" cellpadding="0" style="width: 100%; table-layout:fixed;"
                               class="table table-bordered table-hover table-striped">
                          <thead>
                          <tr>
                            <th>问题</th>
                            <th>状态</th>
                            <th>文件</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr>
                            <td>程序后门</td>
                            <td>
                              <span class="badge bg-info">no</span>
                            </td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>恶意代码</td>
                            <td>
                              <span class="badge bg-info">no</span>
                            </td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>CC连接</td>
                            <td>
                              <span class="badge bg-info">no</span>
                            </td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>广告</td>
                            <td>
                              <span class="badge bg-info">no</span>
                            </td>
                            <td></td>
                          </tr>
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
          <!-- ===========================end code analysis ================================== -->
          <section class="content">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg-12">
                  <div class="card">
                    <div class="card-body">
                      <p>
                        <strong><i class="fa fa-file"></i> 文件结构分析</strong>
                      </p>
                      <div class="table-responsive">
                        <table border="1" cellspacing="0" cellpadding="0" style="width: 100%; table-layout:fixed;"
                               id="table_file"
                               class="table table-bordered table-hover table-striped">
                          <thead>
                          <tr>
                            <th>问题</th>
                            <th>文件</th>
                          </tr>
                          </thead>
                          <tbody>

                          <tr
                            v-for="(item, index) in datas.file_analysis"
                            :key="index"
                          >
                            <td>
                              {{ item.finding }}
                            </td>
                            <td>

                              <div
                                v-for="it in item.files"
                              >
                                {{ it }}
                              </div>

                            </td>
                          </tr>

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
          <!-- ===========================end file analysis ================================== -->
          <section class="content">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg-12">
                  <div class="card">
                    <div class="card-body">
                      <p>
                        <strong><i class="fas fa-fingerprint"></i> APKiD分析（APKiD ANALYSIS）</strong>
                      </p>
                      <div class="table-responsive">
                        <table border="1" cellspacing="0" cellpadding="0" style="width: 100%; table-layout:fixed;"
                               id="table_apkid"
                               class="table table-bordered table-hover table-striped">
                          <thead>
                          <tr>
                            <th>DEX文件</th>
                            <th>anti_vm</th>
                            <th>编译器</th>
                          </tr>
                          </thead>
                          <tbody>

                          <tr
                            v-for="(item, index) in datas.apkid"
                            :key="index"
                          >
                            <td>
                              {{ index }}
                            </td>
                            <td>
                              <template v-for="it in item.anti_vm">
                                {{ it }} <br>
                              </template>
                            </td>
                            <td>
                              <template v-for="it in item.compiler">
                                {{ it }} <br>
                              </template>
                            </td>

                          </tr>

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
          <!-- ===========================end apkid analysis ================================== -->
          <!-- ===========================end virus total ================================== -->
          <section class="content">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg-12">
                  <div class="card">
                    <div class="card-body">
                      <p>
                        <strong><i class="fab fa-searchengin"></i> 外接域名安全性检查</strong>
                      </p>
                      <div class="table-responsive">
                        <table border="1" cellspacing="0" cellpadding="0" style="width: 100%; table-layout:fixed;"
                               id="table_malware"
                               class="table table-bordered table-hover table-striped dataTable no-footer">
                          <thead>
                          <tr role="row">
                            <th>
                              域名
                            </th>
                            <th>
                              状态
                            </th>
                            <th>
                              位置
                            </th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr
                            role="row"
                            v-for="(item, index) in datas.domains"
                          >
                            <td class="sorting_1">{{ index }}</td>
                            <td>
                              <span class="badge bg-success">{{ item.bad }}</span><br>
                            </td>
                            <td>
                              <template
                                v-for="(it, i) in item.geolocation"
                              >
                                {{ i + ' : ' + it}} <br>
                              </template>
                            </td>
                          </tr>
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
          <!-- ===========================end domain malware check ================================== -->
          <section class="content">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg-12">
                  <div class="card">
                    <div class="card-body">
                      <p>
                        <strong><i class="fas fa-database"></i> firebase 数据库</strong>
                      </p>
                      <div class="table-responsive">

                      </div>
                    </div>
                  </div><!-- /.card -->
                </div>
                <!-- end row -->
              </div>
            </div>
          </section>
          <!-- ===========================end firebase db ================================== -->
          <section class="content">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg-12">
                  <div class="card">
                    <div class="card-body">
                      <p>
                        <strong><i class="fas fa-user-secret"></i> 跟踪器（TRACKERS）</strong>
                      </p>
                      <div class="table-responsive">

                        <table border="1" cellspacing="0" cellpadding="0" style="width: 100%; table-layout:fixed;"
                               id="table_trackers"
                               class="table table-bordered table-hover table-striped">
                          <thead>
                          <tr>
                            <th>跟踪器名称</th>
                            <th>url</th>
                          </tr>
                          </thead>
                          <tbody v-if="datas.trackers && datas.trackers.trackers">
                          <tr v-for="item in datas.trackers.trackers">
                            <td v-for="(it, i) in item">
                              {{ i }}
                            </td>
                            <td v-for="(it, i) in item">
                              {{ it }}
                            </td>
                          </tr>
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
          <!-- ===========================end trackers ================================== -->
          <section class="content">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg-12">
                  <div class="card">
                    <div class="card-body">
                      <p>
                        <strong><i class="fa fa-language"></i> ACTIVITIES</strong>
                      </p>
                      <div class="list-group">
                        <p>
                          <template
                            v-for="item in datas.activities"
                          >
                            {{ item }}
                            <br/>
                          </template>
                        </p>
                      </div>
                    </div>
                  </div>
                </div><!-- /.card -->
              </div>
              <!-- end row -->
            </div>
          </section>
          <!-- ===========================end activities ================================== -->
          <section class="content">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg-12">
                  <div class="card">
                    <div class="card-body">
                      <p>
                        <strong><i class="fa fa-cogs"></i> 服务（SERVICES）</strong>
                      </p>
                      <div class="list-group">
                        <p>
                          <template
                            v-for="it in datas.services"
                          >
                            {{ it }} <br>
                          </template>
                        </p>
                      </div>
                    </div>
                  </div>
                </div><!-- /.card -->
              </div>
              <!-- end row -->
            </div>
          </section>
          <!-- ===========================end services ================================== -->
          <section class="content">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg-12">
                  <div class="card">
                    <div class="card-body">
                      <p>
                        <strong><i class="fa fa-assistive-listening-systems"></i> 接收器（RECEIVERS）</strong>
                      </p>
                      <div class="list-group">
                        <p>
                          <template
                            v-for="it in datas.receivers"
                          >
                            {{ it }} <br>
                          </template>
                        </p>
                      </div>
                    </div>
                  </div>
                </div><!-- /.card -->
              </div>
              <!-- end row -->
            </div>
          </section>
          <!-- ===========================end receivers ================================== -->
          <section class="content">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg-12">
                  <div class="card">
                    <div class="card-body">
                      <p>
                        <strong><i class="fa fa-database"></i> 供应商（PROVIDERS）</strong>
                      </p>
                      <div class="list-group">
                        <p>
                          <template
                            v-for="it in datas.providers"
                          >
                            {{ it }} <br>
                          </template>
                        </p>
                      </div>
                    </div>
                  </div>
                </div><!-- /.card -->
              </div>
              <!-- end row -->
            </div>
          </section>
          <!-- ===========================end providers ================================== -->
        </template>
        <template v-else-if="datas.app_type === 'Swift'">
          <section class="content">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg-12">
                  <div class="card">
                    <div class="card-body">
                      <h5 class="card-title"></h5>
                      <div class="row">
                        <div class="col-3">
                          <p><strong><i class="fas fa-check-double"></i> APP SCORES</strong></p>
                          <br>
                          <span class="badge bg-info">Average CVSS</span> <strong>{{ datas.average_cvss }} </strong><br>
                          <span class="badge bg-success">Security Score</span> <strong>{{ datas.security_score
                          }}/100 </strong><br>
                        </div>
                        <div class="col-5">
                          <p><strong><i class="fas fa-box-open"></i> FILE INFORMATION </strong></p>
                          <span class="badge bg-primary">File Name</span>
                          {{ datas.file_name }}<br>
                          <span class="badge bg-primary">Size</span>
                          {{ datas.size }}<br>
                          <span class="badge bg-primary">MD5</span>
                          {{ datas.md5 }}<br>
                          <span class="badge bg-primary">SHA1</span>
                          {{ datas.sha1 }}<br>
                          <span class="badge bg-primary">SHA256</span>
                          {{ datas.sha256 }}<br>
                        </div>
                        <div class="col-4">
                          <p><strong><i class="fas fa-info"></i> APP INFORMATION </strong></p>
                          <span class="badge bg-primary">App Name</span>
                          {{ datas.app_name }}<br>
                          <span class="badge bg-primary">App Type</span>
                          {{ datas.sapp_type }}<br>
                          <span class="badge bg-primary">Identifier</span>
                          {{ datas.bundle_id }}<br>
                          <span class="badge bg-primary">SDK Name</span>
                          {{ datas.sdk_name }}<br>
                          <span class="badge bg-primary">Version</span>
                          {{ datas.app_version }}
                          <span class="badge bg-primary">Build</span>
                          {{ datas.build }}
                          <span class="badge bg-primary">Platform Version</span>
                          {{ datas.platform }}
                          <span class="badge bg-primary">Min OS Version</span>
                          {{ datas.min_os_version }} <br>
                        </div>

                      </div>

                    </div>
                  </div>
                </div>
                <!-- App Store -->

                <!-- /.col -->
                <!-- row and container-->
              </div>
            </div>
          </section>
          <!-- =========================end information==================================== -->
          <!-- ===========================end scan options================================== -->
          <!--<section class="content">-->
          <!--<div class="container-fluid">-->
          <!--<div class="row">-->
          <!--<div class="col-lg-12">-->
          <!--<div class="card">-->
          <!--<div class="card-body">-->
          <!--<p>-->
          <!--<strong><i class="fas fa-hashtag"></i> CUSTOM URL SCHEMES</strong>-->
          <!--</p>-->
          <!--<p>-->

          <!--</p>-->
          <!--<div class="table-responsive">-->
          <!--<div id="DataTables_Table_0_wrapper" class="dataTables_wrapper dt-bootstrap4 no-footer">-->
          <!--<div class="row">-->
          <!--<div class="col-sm-12">-->
          <!--<table border="1" cellspacing="0" cellpadding="0" style="width: 100%; table-layout:fixed;"-->
          <!--class="table table-bordered table-hover table-striped dataTable no-footer"-->
          <!--id="DataTables_Table_0" role="grid" aria-describedby="DataTables_Table_0_info">-->
          <!--<thead>-->
          <!--<tr role="row">-->
          <!--<th>URL-->
          <!--NAME-->
          <!--</th>-->
          <!--<th>SCHEMES-->
          <!--</th>-->
          <!--</tr>-->
          <!--</thead>-->
          <!--<tbody>-->
          <!--&lt;!&ndash;<tr role="row" class="odd">&ndash;&gt;-->
          <!--&lt;!&ndash;<td class="sorting_1">&ndash;&gt;-->
          <!--&lt;!&ndash;alipay&ndash;&gt;-->
          <!--&lt;!&ndash;<br>&ndash;&gt;-->
          <!--&lt;!&ndash;Editor&ndash;&gt;-->
          <!--&lt;!&ndash;</td>&ndash;&gt;-->
          <!--&lt;!&ndash;<td>&ndash;&gt;-->
          <!--&lt;!&ndash;tobiasexample <br>&ndash;&gt;-->
          <!--&lt;!&ndash;</td>&ndash;&gt;-->
          <!--&lt;!&ndash;</tr>&ndash;&gt;-->
          <!--</tbody>-->
          <!--</table>-->
          <!--</div>-->
          <!--</div>-->
          <!--</div>-->
          <!--</div>-->
          <!--</div>-->
          <!--</div>&lt;!&ndash; /.card &ndash;&gt;-->
          <!--</div>-->
          <!--&lt;!&ndash; end row &ndash;&gt;-->
          <!--</div>-->
          <!--</div>-->
          <!--</section>-->
          <!-- ===========================end url schemes ================================== -->
          <section class="content">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg-12">
                  <div class="card">
                    <div class="card-body">
                      <p>
                        <strong><i class="fa fa-list"></i> APPLICATION PERMISSIONS</strong>
                      </p>
                      <p>

                      </p>
                      <div class="table-responsive">
                        <div id="DataTables_Table_1_wrapper" class="dataTables_wrapper dt-bootstrap4 no-footer">
                          <div class="row">
                            <div class="col-sm-12">
                              <table border="1" cellspacing="0" cellpadding="0" style="width: 100%; table-layout:fixed;"
                                     class="table table-bordered table-hover table-striped dataTable no-footer"
                                     id="DataTables_Table_1" role="grid" aria-describedby="DataTables_Table_1_info">

                                <thead>
                                <tr role="row">
                                  <th>
                                    申请权限
                                  </th>
                                  <th>权限状态
                                  </th>
                                  <th>权限描述
                                  </th>
                                  <th>原因
                                  </th>
                                </tr>
                                </thead>
                                <tbody>

                                <tr v-for="item in datas.permissions">
                                  <td class="sorting_1">
                                    {{ item.name }}
                                  </td>
                                  <td>
                                    <span class="badge bg-danger"> {{ item.status }}</span>
                                  </td>
                                  <td>
                                    {{ item.description }}
                                  </td>
                                  <td>
                                    {{ item.reason }}
                                  </td>
                                </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div><!-- /.card -->
                </div>
                <!-- end row -->
              </div>
            </div>
          </section>
          <!-- ===========================end permission ================================== -->
          <section class="content">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg-12">
                  <div class="card">
                    <div class="card-body">
                      <p>
                        <strong><i class="fas fa-lock"></i> APP TRANSPORT SECURITY (ATS)</strong>
                      </p>
                      <div class="table-responsive">
                        <div id="DataTables_Table_2_wrapper" class="dataTables_wrapper dt-bootstrap4 no-footer">
                          <div class="row">
                            <div class="col-sm-12">
                              <table border="1" cellspacing="0" cellpadding="0" style="width: 100%; table-layout:fixed;"
                                     class="table table-bordered table-hover table-striped dataTable no-footer"
                                     id="DataTables_Table_2" role="grid" aria-describedby="DataTables_Table_2_info">

                                <thead>
                                <tr role="row">
                                  <th>问题
                                  </th>
                                  <th>状态
                                  </th>
                                  <th>描述
                                  </th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="item in datas.ats_analysis">
                                  <td>
                                    {{ item.issue }}
                                  </td>
                                  <td>

                                    <span class="badge bg-danger">  {{ item.status }}</span>

                                  </td>
                                  <td>
                                    {{ item.description }}
                                  </td>
                                </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div><!-- /.card -->
                </div>
                <!-- end row -->
              </div>
            </div>
          </section>
          <!-- ===========================end transport security ================================== -->
          <section class="content">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg-12">
                  <div class="card">
                    <div class="card-body">
                      <p>
                        <strong><i class="fa fa-flag"></i> IPA BINARY ANALYSIS</strong>
                      </p>
                      <div class="table-responsive">
                        <div id="DataTables_Table_3_wrapper" class="dataTables_wrapper dt-bootstrap4 no-footer">
                          <div class="row">
                            <div class="col-sm-12">
                              <table border="1" cellspacing="0" cellpadding="0" style="width: 100%; table-layout:fixed;"
                                     class="table table-bordered table-hover table-striped dataTable no-footer"
                                     id="DataTables_Table_3" role="grid" aria-describedby="DataTables_Table_3_info">
                                <thead>
                                <tr role="row">
                                  <th>问题
                                  </th>
                                  <th>严重程度
                                  </th>
                                  <th>标准
                                  </th>
                                  <th>描述
                                  </th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(item, index) in datas.binary_analysis">
                                  <td>
                                    {{ index }}
                                  </td>
                                  <td>
                                    <span class="badge bg-danger">{{ item.severity }}</span>
                                  </td>
                                  <td>
                                    <strong>CVSS V2:</strong>{{ item.cvss }}
                                    <br>
                                    <strong>CWE: </strong>{{ item.cwe }}
                                    <br>
                                    <strong>OWASP Top 10: </strong>{{ item['owasp-mobile'] }}
                                    <br>
                                    <strong>OWASP MASVS: </strong>{{ item.masvs }}
                                  </td>
                                  <td>
                                    {{ item.detailed_desc }}
                                  </td>
                                </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div><!-- /.card -->
                </div>
                <!-- end row -->
              </div>
            </div>
          </section>
          <!-- ===========================end binary analysis ================================== -->
          <section class="content">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg-12">
                  <div class="card">
                    <div class="card-body">
                      <p>
                        <strong><i class="fa fa-file"></i> FILE ANALYSIS</strong>
                      </p>
                      <div class="table-responsive">
                        <div id="DataTables_Table_4_wrapper" class="dataTables_wrapper dt-bootstrap4 no-footer">
                          <div class="row">
                            <div class="col-sm-12">
                              <table border="1" cellspacing="0" cellpadding="0" style="width: 100%; table-layout:fixed;"
                                     class="table table-bordered table-hover table-striped dataTable no-footer"
                                     id="DataTables_Table_4" role="grid" aria-describedby="DataTables_Table_4_info">
                                <thead>
                                <tr role="row">
                                  <th>问题
                                  </th>
                                  <th>文件
                                  </th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="item in datas.file_analysis">
                                  <td>
                                    {{ item.issue }}
                                  </td>
                                  <td>
                                    <template v-for="(it, i) in item">
                                      <a>{{ it.file_path }}</a><br>
                                    </template>
                                  </td>
                                </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div><!-- /.card -->
                </div>
                <!-- end row -->
              </div>
            </div>
          </section>
          <!-- ===========================end file analysis ================================== -->
          <!-- ===========================end virus total ================================== -->
          <section class="content">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg-12">
                  <div class="card">
                    <div class="card-body">
                      <p>
                        <strong><i class="fab fa-searchengin"></i> DOMAIN MALWARE CHECK</strong>
                      </p>
                      <div class="table-responsive">

                        <div id="table_malware_wrapper" class="dataTables_wrapper dt-bootstrap4 no-footer">
                          <div class="row">
                            <div class="col-sm-12">
                              <table
                                class="table table-bordered table-hover table-striped dataTable no-footer"
                                role="grid" aria-describedby="table_malware_info">
                                <thead>
                                <tr role="row">
                                  <th>作用域
                                  </th>
                                  <th>状态
                                  </th>
                                  <th>
                                    位置
                                  </th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(item, index) in datas.domains">
                                  <td class="sorting_1">{{ index }}</td>
                                  <td>
                                    <span class="badge bg-success">{{ item.bad }}</span><br>
                                  </td>
                                  <td>
                                    <template
                                      v-for="(it, i) in item.geolocation"
                                    >
                                      {{ i + ' : ' + it}} <br>
                                    </template>
                                  </td>
                                </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div><!-- /.card -->
                </div>
                <!-- end row -->
              </div>
            </div>
          </section>
          <!-- ===========================end domain malware check ================================== -->
          <section class="content">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg-12">
                  <div class="card">
                    <div class="card-body">
                      <p>
                        <strong><i class="fas fa-database"></i> FIREBASE DATABASE</strong>
                      </p>
                      <div class="table-responsive">

                      </div>
                    </div>
                  </div><!-- /.card -->
                </div>
                <!-- end row -->
              </div>
            </div>
          </section>
          <!-- ===========================end firebase db ================================== -->
        </template>
        <section class="content">
          <div class="container-fluid">
            <div class="row">
              <div class="col-lg-12">
                <div class="card">
                  <div class="card-body">
                    <p>
                      <strong><i class="fa fa-language"></i> 第三方SDK</strong>
                    </p>
                    <div class="list-group">
                      <p>
                        <template
                          v-for="item in datas.sdk"
                        >
                          {{ item }}
                          <br/>
                        </template>
                      </p>
                    </div>
                  </div>
                </div>
              </div><!-- /.card -->
            </div>
            <!-- end row -->
          </div>
        </section>
        <!-- ===========================end sdk ================================== -->
      </div>
      <template v-if="datas.app_type === 'apk'">
        <section class="content">
          <div class="container-fluid">
            <div class="row">
              <div class="col-lg-12">
                <div class="card">
                  <div class="card-body">
                    <p>
                      <strong><i class="fab fa-android"></i> Android API（ANDROID JAVA API）</strong>
                    </p>
                    <div class="table-responsive">
                      <table border="1" cellspacing="0" cellpadding="0" style="width: 100%; table-layout:fixed;"
                             id="table_so"
                             class="table table-bordered table-hover table-striped">
                        <thead>
                        <tr>
                          <th>API</th>
                          <th>文件</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr
                          v-for="(item, index) in datas.android_api"
                          :key="index"
                        >
                          <td>{{ index }}</td>
                          <td>
                            <div
                              v-for="(it, i) in item.files"
                            >
                              {{ i + ' : ' + it }}
                            </div>
                          </td>
                        </tr>
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
        <!-- ===========================end api analysis ================================== -->
      </template>
      <template v-else-if="datas.app_type === 'Swift'">
      </template>
      <section class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-lg-12">
              <div class="card">
                <div class="card-body">
                  <p>
                    <strong><i class="fas fa-envelope"></i> 电子邮件（EMAILS）</strong>
                  </p>
                  <div class="table-responsive">
                    <table border="1" cellspacing="0" cellpadding="0" style="width: 100%; table-layout:fixed;"
                           id="table_emails"
                           class="table table-bordered table-hover table-striped dataTable no-footer"
                           role="grid" aria-describedby="table_emails_info">
                      <thead>
                      <tr role="row">
                        <th>电子邮件
                        </th>
                        <th>文件
                        </th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr
                        role="row"
                        v-for="item in datas.emails"
                      >
                        <td class="sorting_1">
                          <template
                            v-for="it in item.emails"
                          >
                            {{ it }} <br>
                          </template>
                        </td>
                        <td>
                          <a>{{ item.path }}</a>
                        </td>
                      </tr>
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
      <!-- ===========================end emails ================================== -->
      <section class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-lg-12">
              <div class="card">
                <div class="card-body">
                  <p>
                    <strong><i class="fab fa-buffer"></i> 引用库（LIBRARIES）</strong>
                  </p>
                  <div class="list-group">
                    <p>
                      <template
                        v-for="it in datas.libraries"
                      >
                        {{ it }} <br>
                      </template>
                    </p>
                  </div>
                </div>
              </div>
            </div><!-- /.card -->
          </div>
          <!-- end row -->
        </div>
      </section>
      <!-- ===========================end libraries ================================== -->
      <section class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-lg-12">
              <div class="card">
                <div class="card-body">
                  <p>·
                    <strong><i class="fas fa-globe"></i> URLS</strong>
                  </p>
                  <div class="table-responsive">
                    <table border="1" cellspacing="0" cellpadding="0" style="width: 100%; table-layout:fixed;"
                           id="table_urls"
                           class="table table-bordered table-hover table-striped dataTable no-footer"
                           role="grid" aria-describedby="table_urls_info">
                      <thead>
                      <tr role="row">
                        <th>
                          URL
                        </th>
                        <th>
                          文件
                        </th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr role="row"
                          v-for="item in datas.urls"
                      >
                        <td class="sorting_1">
                          <template
                            v-for="it in item.urls"
                          >
                            {{ it }} <br>
                          </template>
                        </td>
                        <td>
                          <a>{{ item.path }}</a>
                        </td>
                      </tr>
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
      <!-- ===========================end urls ================================== -->
      <section class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-lg-12">
              <div class="card">
                <div class="card-body">
                  <p>
                    <strong><i class="far fa-copy"></i> 文件列表</strong>
                  </p>
                  <div class="list-group">
                    <p>
                      <template v-for="item in datas.files">
                        {{ item }} <br>
                      </template>
                    </p>
                  </div>
                </div>
              </div>
            </div><!-- /.card -->
          </div>
          <!-- end row -->
        </div>
      </section>
      <!-- ===========================end files ================================== -->
    </template>
  </div>
</template>

<script>
  import FileSaver from 'file-saver';
  import html2pdf from 'html2pdf.js'

  export default {
    name: "app检测",
    data() {
      return {
        datas: null,
      }
    },
    computed: {},
    methods: {

      getHardCode(json) {
        this.datas.hardCode = [
          {
            information: '本地账户',
            level: '普通个人信息',
            type: '联系人信息',
            collect: '',
            outgoing: '',
            compare: 'permission.get_accounts',
          },
          {
            information: '个人上网记录',
            level: '普通个人信息',
            type: '浏览器Cookie',
            collect: '',
            outgoing: '',
            compare: 'this app may request root',
          },
          {
            information: 'MAC地址',
            level: '普通个人信息',
            type: '个人常用设备信息',
            collect: '',
            outgoing: '',
            compare: 'permission.access_wifi_state',
          },
          {
            information: '软件列表',
            level: '普通个人信息',
            type: '个人常用设备信息',
            collect: '',
            outgoing: '',
            compare: 'packagemanager.getinstalledpackages',
          },
          {
            information: '唯一设备识别码',
            level: '普通个人信息',
            type: '个人常用设备信息',
            collect: '',
            outgoing: '疑似',
            compare: 'permission.read_phone_state',
          },
          {
            information: '经度纬度信息',
            level: '个人敏感信息',
            type: '个人位置信息',
            collect: '',
            outgoing: '疑似',
            compare: 'permission.access_fine_location',
          },
          {
            information: '其它定位信息',
            level: '个人敏感信息',
            type: '个人位置信息',
            collect: '',
            outgoing: '疑似',
            compare: 'permission.access_coarse_location',
          },
          {
            information: '指纹信息',
            level: '个人敏感信息',
            type: '个人生物识别信息',
            collect: 'no',
            outgoing: '',
            compare: '',
          },
          {
            information: '通讯录',
            level: '个人敏感信息',
            type: '其它信息',
            collect: '',
            outgoing: '',
            compare: 'permission.read_contacts',
          },
          {
            information: '通话记录',
            level: '个人敏感信息',
            type: '其它信息',
            collect: '',
            outgoing: '',
            compare: 'permission.read_call_log',
          },
          {
            information: '短信',
            level: '个人敏感信息',
            type: '其它信息',
            collect: '',
            outgoing: '',
            compare: 'permission.read_sms',
          },
          {
            information: '彩信',
            level: '个人敏感信息',
            type: '其它信息',
            collect: '',
            outgoing: '',
            compare: 'permission.receive_wap_push',
          },
        ];
        this.datas.hardCode.forEach(item => {
          if (item.compare) {
            if (json.includes(item.compare.toLowerCase())) {
              item.collect = 'yes'
            } else {
              item.collect = 'no'
            }
          }
        })
      },

      getSDK(json) {
        let sdk = [
          {
            name: '有盟SDK',
            compare: 'umeng.com',
          },
          {
            name: '腾讯管家SDK',
            compare: '3g.qq.com',
          },
          {
            name: '百度地图SDK',
            compare: 'baidu.com',
          },
          {
            name: '极光推送SDK',
            compare: 'mob.com',
          },
          {
            name: '高德地图SDK',
            compare: 'amap.com',
          },
          {
            name: '个推SDK',
            compare: 'getui.com',
          },
          {
            name: 'TalkingData',
            compare: 'talkingdata.com',
          },
          {
            name: 'TrustData',
            compare: ['itrustdata.com', 'itrustdata.cn'],
          },
          {
            name: 'Datavisor',
            compare: 'datavisor',
          },
          {
            name: '百度统计SDK',
            compare: 'tongji.baidu.com',
          },
          {
            name: '360安全SDK',
            compare: '360.cn',
          },
          {
            name: '腾讯云推送SDK',
            compare: 'cloud.tencent.com',
          },
          {
            name: '百度推送SDK',
            compare: 'push.baidu.com',
          },
          {
            name: '讯飞SDK',
            compare: 'xfyun.cn',
          },
        ];
        this.datas.sdk = [];
        sdk.map(item => {
          if (item.compare) {
            if (typeof item.compare === 'string') {
              if (json.includes(item.compare.toLowerCase())) {
                this.datas.sdk.push(item.name)
              }
            } else {
              let flag;
              item.compare.map(cp => {
                if (flag) {
                  return
                }
                if (json.includes(cp.toLowerCase())) {
                  flag = true;
                  this.datas.sdk.push(item.name)
                }
              })
            }
          }
        });
      },

      saveAs() {
        let loading = this.$loading({background: 'rgba(0, 0, 0, 0.5)'});
        let element = this.$refs['download-wrap'];
        let opt = {
          filename: `${this.datas.external_system.name}Android APP扫描报告${this.$common.getThisTime()}` + '.pdf',
          width: element.scrollWidth,
          height: element.scrollHeight,
          margin: 1,
          image: {type: 'jpeg', quality: 0.98},
          html2canvas: {scale: 1},
          jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'}
        };
        html2pdf().set(opt).from(element).save().then(() => {
          loading.close();
        });
      },


      fileSaver() {
        let content = '<html><body>';
        content += this.$refs['download-wrap'].innerHTML;
        content += '</body></html>';
        let blob = new Blob([content], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, `${this.datas.external_system.name}Android APP扫描报告${this.$common.getThisTime()}` + ".doc");
      },

      getData(workflow_id) {
        let vars = {
          workflow_id,
          key: 'view',
          name: 'taskData',
        };
        this.$api.wf(vars, this, data => {
          if (data && data.data) {
            this.datas = data.data.bangcleAppTest;
            const json = JSON.stringify(this.datas).toLowerCase();
            this.getHardCode(json);
            this.getSDK(json);
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
