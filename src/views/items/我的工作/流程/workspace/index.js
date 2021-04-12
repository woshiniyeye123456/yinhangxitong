import secReqAnalysis from './secReqAnalysis' // 安全分析
import secReqReview from './secReqReview' // 需求审核
import devTaskReview from './devTaskReview' // 安全开发任务确认
import testTaskReview from './testTaskReview' // 安全测试任务确认
import development from './development' // 安全开发执行
import test from './test' // 安全测试执行
import submitTestSamples from './submitTestSamples' // 提交检测样本
import manualReview from './manualReview' // 人工复核
import approveAndRelease from './approveAndRelease' // 审核与发布

export default {
  secReqAnalysis,
  secReqReview,
  devTaskReview,
  testTaskReview,
  development,
  test,
  submitTestSamples,
  manualReview,
  approveAndRelease,
}
