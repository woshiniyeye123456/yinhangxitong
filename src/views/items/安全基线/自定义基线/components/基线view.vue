<template>
  <div class="markdown-full-page">
    <div class="text-right">
      <el-button
        type="primary"
        size="small"
        @click="derived"
      >
        派生基线
      </el-button>
    </div>
    <markdown
      :disabled="true"
      :isFull="true"
      v-model="content"
    >
    </markdown>
    <el-backtop
      target=".full-page"
      :right="20"
      :bottom="76"
      :visibility-height="20"
    >
      <div class="back-top">
        <img src="../../../../../img/fanhuidingbu.png">
      </div>
    </el-backtop>
    <div
      class="go-back"
      @click="goBack"
    >
      返回
    </div>
  </div>
</template>

<script>
  import Markdown from '../../../components/markDown/simple'

  export default {
    name: "基线view",
    inject: {
      user: {
        from: 'user',
        default: () => {
          return {}
        }
      }
    },
    components: {
      Markdown,
    },
    props: {
      params: {
        type: Object,
        default() {
          return {}
        }
      },
    },
    computed: {},
    data() {
      return {
        content: '',
      }
    },
    methods: {

      derived() {
        this.$emit('derived');
      },

      goBack() {
        this.$emit('goBack');
        // this.$router.go(-1);
        // this.$router.push({
        //   name: 'customizeBaseline',
        //   params: {
        //     pages: this.$route.params.pages,
        //     lines: this.$route.params.lines,
        //   },
        // })
      },

      init() {
        // console.log(this.params);
        let $software_plat = [];
        let $safety_design = [];
        let $test_conditions = [];
        let $test_procedure = [];
        let $expected_results = [];
        let $tool = [];
        if (this.params.defense_test && this.params.defense_test.length) {
          this.params.defense_test.forEach(item => {
            if (item.soft_plats && item.soft_plats.length) {
              item.soft_plats.forEach(sp => {
                $software_plat.push(sp.name)
              })
            }
            if (item.tools && item.tools.length) {
              item.tools.forEach(sp => {
                $tool.push(sp.name)
              })
            }
            if (item.test_conditions) {
              $test_conditions.push(item.test_conditions)
            }
            if (item.safety_design) {
              $safety_design.push(item.safety_design)
            }
            if (item.test_procedure) {
              $test_procedure.push(item.test_procedure)
            }
            if (item.expected_results) {
              $expected_results.push(item.expected_results)
            }
          });
        }
        this.params.$software_plat = $software_plat.join(';');
        this.params.$test_conditions = $test_conditions.join(';');
        this.params.$test_procedure = $test_procedure.join(';');
        this.params.$expected_results = $expected_results.join(';');
        this.params.$safety_design = $safety_design.join(';');
        this.params.$tool = $tool.join(';');

        let $dataslibraries = [];
        if (this.params.data_libraries && this.params.data_libraries.length) {
          this.params.data_libraries.forEach(item => {
            $dataslibraries.push(item)
          });
        }
        this.params.$dataslibraries = $dataslibraries;

        let $loopholes = [];
        if (this.params.loopholes && this.params.loopholes.length) {
          this.params.loopholes.forEach(item => {
            $loopholes.push(item)
          });
        }
        this.params.$loopholes = $loopholes;

        let $components = [];
        if (this.params.security_components && this.params.security_components.length) {
          this.params.security_components.forEach(item => {
            $components.push(item)
          });
        }
        this.params.$components = $components;

        // console.log(this.params);
        this.content = '';
        // row
        this.content += '# ' + this.params.name + '\r\n\r\n';
        // row
        this.content += '基本属性 | 属性值' + '\r\n';
        this.content += '---- | ------------' + '\r\n';
        this.content += '基线编码|' + this.params.number + '\r\n';
        this.content += '版本号|' + this.params.version + '\r\n';
        this.content += '安全类型|' + this.params.security_scene + '\r\n';
        this.content += '软件平台|' + this.params.$software_plat + '\r\n';
        this.content += '风险等级|' + this.params.risk_level + '\r\n\r\n';
        // row
        this.content += '## 内容描述\r\n\r\n';
        this.content += this.params.security_description + '\r\n\r\n';
        // row
        this.content += '## 风险描述\r\n\r\n';
        this.content += this.params.risk_description + '\r\n\r\n';
        // row
        this.content += '## 安全设计\r\n\r\n';
        this.content += this.params.$safety_design + '\r\n\r\n';
        // row
        this.params.$test_conditions = this.params.$test_conditions.replace(/\n/g,'<br>');
        this.params.$test_procedure = this.params.$test_procedure.replace(/\n/g,'<br>');
        this.params.$expected_results = this.params.$expected_results.replace(/\n/g,'<br>');
        this.content += '## 测试用例\r\n\r\n';
        this.content += '|内容 | 描述' + '|\r\n';
        this.content += '|---- | ------------' + '|\r\n';
        // this.content += '|' + this.params.security_description + '|' + this.params.risk_description + '|\r\n';
        this.content += '|测试目的|' + this.params.name + '|\r\n';
        this.content += '|测试条件|' + this.params.$test_conditions + '|\r\n';
        this.content += '|测试步骤|' + this.params.$test_procedure + '|\r\n';
        this.content += '|预期结果|' + this.params.$expected_results + '|\r\n';
        this.content += '|测试工具|' + this.params.$tool + '|\r\n\r\n';
        // row
        this.content += '## 基线关联\r\n\r\n';
        this.content += '|关联类型 | 关联对象' + '|\r\n';
        this.content += '|---- | ------------' + '|\r\n';
        this.content += '|参考资料|';
        this.params.$dataslibraries.forEach(item => {
          this.content += `[${item.title}](${window.location.origin + '/#/dataManagement/viewData?id=' + item.id});`;
        });
        this.content += '|\r\n';
        this.content += '|关联漏洞|';
        this.params.$loopholes.forEach(item => {
          this.content += `[${item.name}](${window.location.origin + '/#/vulnerabilityManagement/viewVulnerability?id=' + item.id});`;
        });
        this.content += '|\r\n';
        this.content += '|参考组件|';
        this.params.$components.forEach(item => {
          this.content += `[${item.name}](${window.location.origin + '/#/componentManagement/viewSecurityComponent?id=' + item.id});`;
        });
        this.content += '|\r\n';
        // file
        if (this.params.path) {
          this.files = JSON.parse(this.params.path);
        }
        if (this.files && this.files.length) {
          this.content += '## 附件' + '\r\n\r\n';
          this.files.forEach(item => {
            this.content += `- [${item.name}](${this.$api.download(item.path)})` + '\r\n\r\n'
          });
        }
        // console.log(this.content);
      },

    },
    mounted() {
      this.init();
    },
  }
</script>

<style lang="scss" scoped>
  .back-top {
    border-radius: 50%;
    width: 44px;
    height: 44px;
    text-align: center;
    vertical-align: middle;
    background-color: #00c5d4;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .go-back {
    border-radius: 50%;
    width: 44px;
    height: 44px;
    text-align: center;
    line-height: 44px;
    background-color: #fff;
    box-shadow: 0 0 6px rgba(0, 0, 0, .12);
    cursor: pointer;
    z-index: 5;
    color: #606266;
    font-size: 12px;
    position: fixed;
    right: 20px;
    bottom: 20px;
  }
</style>
