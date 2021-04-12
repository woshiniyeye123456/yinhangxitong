<template>
  <el-card shadow="never" class="default-card" ref="download-wrap">
    <div slot="header" class="clearfix">
      <span class="slot-title">平台说明</span>
    </div>
    <div>
      <p>平台全称: 应用安全中台</p>
      <p>版本: v6.0</p>
      <!--<el-button-->
        <!--type="primary"-->
        <!--@click="saveAs"-->
      <!--&gt;-->
        <!--下载-->
      <!--</el-button>-->
    </div>
  </el-card>
</template>

<script>
  import html2pdf from 'html2pdf.js'

  export default {
    name: "平台说明",
    methods: {
      saveAs() {
        let loading = this.$loading({background: 'rgba(0, 0, 0, 0.5)'});
        let element = this.$refs['download-wrap'].$el;
        let opt = {
          margin: 1,
          image: {type: 'jpeg', quality: 0.98},
          html2canvas: {scale: 2},
          jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'}
        };
        html2pdf().set(opt).from(element).save('test.pdf').then(() => {
          loading.close();
        });
      },
    },
  }
</script>

<style scoped>

</style>
