<template>
  <el-card shadow="never" class="default-card">
    <div slot="header" class="clearfix">
      <span class="slot-title">工单面板</span>
    </div>
    <el-form label-width="120px" :model="params" :rules="rules" ref="refForm">
      <el-form-item label="任务审批:" prop="finalReviewResult">
        <el-radio-group v-model="finalReviewResult" :disabled="disabled" :rules="[]">
          <el-radio
            class="margin-right-10"
            v-for="(item, index) in statusList"
            :label="item"
            :key="index"
          >{{ item }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="评审意见:" prop="finalReviewComments">
        <el-input
          v-model="params.finalReviewComments"
          autosize
          type="textarea"
          :disabled="disabled"
          resize="none"
          placeholder="评审意见"
        ></el-input>
      </el-form-item>
      <el-form-item label="加固程序:">
        <el-radio-group v-model="params.strengthening" :disabled="disabled">
          <el-radio
            class="margin-right-10"
            v-for="(item, index) in yesorno"
            :label="item"
            :key="index"
          >{{ item }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="params.strengthening === '是'">
        <el-form-item label="加固策略:">
          <el-select
            v-model="params.strengthening_id"
            placeholder="请选择:加固策略"
            style="width: calc(100% - 120px)"
            filterable
            autocomplete="off"
          >
            <el-option
              v-for="item in strengthening"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
          <div class="float-right">
            <el-button
              type="primary"
              size="small"
              :disabled="!params.strengthening_id"
              @click="strengtheningVisible = true"
            >查看加固策略</el-button>
          </div>
        </el-form-item>
      </template>
      <div class="margin-top-10 text-right" v-show="!readonly">
        <el-button type="default" @click="goBack" size="small">返回</el-button>
        <!--<template v-if="params.finalReviewResult==='同意'">-->
        <el-button type="primary" @click="submit" size="small" v-if="!disabled">确认完成</el-button>
        <!--</template>-->
        <!--<template v-else-if="params.finalReviewResult==='不同意'">-->
        <!--<el-button-->
        <!--type="primary"-->
        <!--@click="showDialog"-->
        <!--size="small"-->
        <!--v-if="!disabled"-->
        <!--&gt;-->
        <!--回退-->
        <!--</el-button>-->
        <!--</template>-->
      </div>
    </el-form>
    <el-dialog
      title="退回节点"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      width="550px"
      :close-on-click-modal="false"
      class="dialog-default"
    >
      <el-form
        label-width="95px"
        class="default-search"
        :model="dialogParams"
        :rules="dialogRules"
        ref="refDialogForm"
      >
        <el-form-item label="选择节点" prop="name">
          <el-select
            v-model="dialogParams.node_name"
            placeholder="请选择:筛选"
            style="width: 100%"
            filterable
            autocomplete="off"
          >
            <el-option
              v-for="(item, index) in previousList"
              :label="item.title"
              :value="item.name"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <div class="margin-top-20 text-right">
          <el-button type="default" @click="dialogVisible = false" size="small">取消</el-button>
          <el-button type="primary" @click="submitDialog" size="small">确认</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 加固策略 -->
    <el-dialog
      title="加固策略"
      :append-to-body="true"
      :visible.sync="strengtheningVisible"
      width="75%"
      :close-on-click-modal="true"
      class="dialog-default"
    >
      <el-form label-width="220px" class="default-search">
        <el-card shadow="never" class="default-card">
          <div slot="header" class="clearfix">
            <span class="slot-title">策略信息</span>
          </div>
          <el-form-item label="策略名称:">
            <el-input readonly v-model="strengtheningParams.name"></el-input>
          </el-form-item>
          <el-form-item label="系统版本:">
            <el-input readonly v-model="strengtheningParams.name"></el-input>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input readonly v-model="strengtheningParams.name"></el-input>
          </el-form-item>
        </el-card>
        <el-card shadow="never" class="default-card margin-top-12">
          <div slot="header" class="clearfix">
            <span class="slot-title">Dex保护</span>
          </div>
          <el-form-item label="Dex保护:">
            <el-input readonly v-model="strengtheningParams.name"></el-input>
          </el-form-item>
          <el-form-item label="文件级加密:">
            <el-input readonly v-model="strengtheningParams.name"></el-input>
          </el-form-item>
          <el-form-item label="函数级加密:">
            <el-input readonly v-model="strengtheningParams.name"></el-input>
          </el-form-item>
          <el-form-item label="函数过滤规则:">
            <el-input readonly v-model="strengtheningParams.name"></el-input>
          </el-form-item>
          <el-form-item label="VMP:">
            <el-input readonly v-model="strengtheningParams.name"></el-input>
          </el-form-item>
          <el-form-item label="VMP加密规则:">
            <el-input readonly v-model="strengtheningParams.name"></el-input>
          </el-form-item>
        </el-card>
        <el-card shadow="never" class="default-card margin-top-12">
          <div slot="header" class="clearfix">
            <span class="slot-title">防调试保护</span>
          </div>
          <el-form-item label="防调试保护:">
            <el-input readonly v-model="strengtheningParams.name"></el-input>
          </el-form-item>
        </el-card>
        <el-card shadow="never" class="default-card margin-top-12">
          <div slot="header" class="clearfix">
            <span class="slot-title">so文件保护</span>
          </div>
          <el-form-item label="so文件保护:">
            <el-input readonly v-model="strengtheningParams.name"></el-input>
          </el-form-item>
          <el-form-item label="技术版本:">
            <el-input readonly v-model="strengtheningParams.name"></el-input>
          </el-form-item>
          <el-form-item label="加密策略:">
            <el-input readonly v-model="strengtheningParams.name"></el-input>
          </el-form-item>
          <el-form-item label="加密的so文件:">
            <el-input readonly v-model="strengtheningParams.name"></el-input>
          </el-form-item>
        </el-card>
        <el-card shadow="never" class="default-card margin-top-12">
          <div slot="header" class="clearfix">
            <span class="slot-title">u3d DLL文件加密</span>
          </div>
          <el-form-item label="u3d DLL文件加密:">
            <el-input readonly v-model="strengtheningParams.name"></el-input>
          </el-form-item>
          <el-form-item label="U3D引擎版本:">
            <el-input readonly v-model="strengtheningParams.name"></el-input>
          </el-form-item>
          <el-form-item label="Unity版本:">
            <el-input readonly v-model="strengtheningParams.name"></el-input>
          </el-form-item>
          <el-form-item label="U3D DLL加密过滤规则:">
            <el-input readonly v-model="strengtheningParams.name"></el-input>
          </el-form-item>
        </el-card>
        <el-card shadow="never" class="default-card margin-top-12">
          <div slot="header" class="clearfix">
            <span class="slot-title">资源加密</span>
          </div>
          <el-form-item label="资源加密:">
            <el-input readonly v-model="strengtheningParams.name"></el-input>
          </el-form-item>
          <el-form-item label="资源加密规则:">
            <el-input readonly v-model="strengtheningParams.name"></el-input>
          </el-form-item>
        </el-card>
        <el-card shadow="never" class="default-card margin-top-12">
          <div slot="header" class="clearfix">
            <span class="slot-title">数据加密</span>
          </div>
          <el-form-item label="数据加密:">
            <el-input readonly v-model="strengtheningParams.name"></el-input>
          </el-form-item>
          <el-form-item label="数据加密规则:">
            <el-input readonly v-model="strengtheningParams.name"></el-input>
          </el-form-item>
        </el-card>
        <el-card shadow="never" class="default-card margin-top-12">
          <div slot="header" class="clearfix">
            <span class="slot-title">完整性保护</span>
          </div>
          <el-form-item label="完整性保护:">
            <el-input readonly v-model="strengtheningParams.name"></el-input>
          </el-form-item>
          <el-form-item label="完整性保护规则:">
            <el-input readonly v-model="strengtheningParams.name"></el-input>
          </el-form-item>
        </el-card>
        <el-card shadow="never" class="default-card margin-top-12">
          <div slot="header" class="clearfix">
            <span class="slot-title">附属功能</span>
          </div>
          <el-form-item label="附属功能:">
            <el-input readonly v-model="strengtheningParams.name"></el-input>
          </el-form-item>
        </el-card>
        <el-card shadow="never" class="default-card margin-top-12">
          <div slot="header" class="clearfix">
            <span class="slot-title">策略扩展</span>
          </div>
          <el-form-item label="手动录入策略:">
            <el-input readonly v-model="strengtheningParams.name"></el-input>
          </el-form-item>
        </el-card>
        <div class="margin-top-20 text-right">
          <el-button type="default" @click="strengtheningVisible = false" size="small">关闭</el-button>
        </div>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script>
import textUpload from '../../../components/text-upload'
import editTable from '../../../components/edit-table'
import mixins from '../components/mixins'

export default {
  name: 'test',
  inject: {
    user: {
      from: 'user',
      default: () => {
        return {}
      }
    }
  },
  mixins: [mixins],
  components: {
    textUpload,
    editTable
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    workflow_id: {
      type: Number,
      default: 0
    },
    node_name: {
      type: String,
      default: ''
    },
    task_id: {
      type: Number,
      default: 0
    },
    data_saved: {
      type: Boolean,
      default: false
    },
    readonly: false
  },
  computed: {},
  data() {
    return {
      // dialog
      dialogParams: {
        node_name: ''
      },
      dialogRules: {
        node_name: [
          {
            required: true,
            message: '请输入:请选择节点',
            trigger: 'blur'
          }
        ]
      },
      jump_to_node_name: '',
      previousList: [],
      dialogVisible: false,
      statusList: ['同意', '不同意'],
      //
      rules: {
        testResult: [
          {
            required: true,
            message: '请输入:检测结论',
            trigger: 'blur'
          }
        ]
      },
      // 其他附件
      filesDefaultFileList: [],
      filesFileList: [],
      params: {
        finalReviewResult: '同意'
      },
      finalReviewResult: '同意',
      strengtheningVisible: false,
      strengtheningParams: {}
    }
  },
  methods: {
    showDialog() {
      this.dialogVisible = true
      this.dialogParams = {
        node_name: ''
      }
      this.getPrevious()
    },

    getPrevious() {
      let vars = {
        workflow_id: this.workflow_id,
        node_name: this.node_name
      }
      vars.key = 'previousNodes'
      this.$api.wf(vars, this, data => {
        // console.log(data);
        if (data) {
          this.previousList = data.data || []
          this.previousList = this.previousList.filter(
            it => it.name !== 'createTask'
          )
        }
      })
    },

    submitDialog() {
      this.params.finalReviewResult = this.finalReviewResult
      this.$refs.refDialogForm.validate(valid => {
        if (valid) {
          let vars = {
            task_id: this.task_id,
            actor: this.user.name,
            workflow_id: this.workflow_id,
            node_name: this.dialogParams.node_name,
            data: this.params
          }
          vars.key = 'submitTaskAndJump'
          this.$api.wf(vars, this, () => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.goBack()
          })
        } else {
          return this.$message.error('操作失败')
        }
      })
    },

    goBack() {
      this.$router.go(-1)
    },

    save() {
      this.params.finalReviewResult = this.finalReviewResult
      let params = this.$common.deepClone(this.params)
      this.$emit('on-save', params)
    },

    submit() {
      this.params.finalReviewResult = this.finalReviewResult
      let params = this.$common.deepClone(this.params)
      this.$refs.refForm.validate(valid => {
        if (valid) {
          this.$emit('on-submit', params)
        } else {
          return this.$message.error('操作失败')
        }
      })
    },

    getTaskData() {
      let vars = {
        task_id: this.task_id,
        key: 'taskData'
      }
      this.$api.wf(vars, this, data => {
        // console.log(data);
        if (data && data.data) {
          this.setData(data.data)
        }
      })
    },

    getView() {
      let vars = {
        workflow_id: this.workflow_id,
        key: 'view',
        name: 'taskData'
      }
      this.$api.wf(vars, this, data => {
        if (data && data.data) {
          this.setData(data.data)
        }
      })
    },

    setData(data) {
      this.params = data
    },

    init() {
      if (this.data_saved) {
        this.getTaskData()
      } else {
        this.getView()
      }
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
</style>