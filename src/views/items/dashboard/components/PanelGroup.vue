<template>
    <el-row class="panel-group" :gutter="15">
        <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
            <div class='card-panel' @click="handleSetLineChartData('newVisitis')">
                <div class="card-panel-icon-wrapper icon-people">
                    <svg-icon icon-class="all-servers" class-name="card-panel-icon"/>
                </div>
                <div class="card-panel-description">
                    <div class="card-panel-text">今日领券次数</div>
                    <count-to class="card-panel-num" :startVal="0" :endVal="panelData.now_number_of_coupons" :duration="2600"></count-to>
                </div>
            </div>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
            <div class="card-panel" @click="handleSetLineChartData('messages')">
                <div class="card-panel-icon-wrapper icon-message">
                    <svg-icon icon-class="message" class-name="card-panel-icon"/>
                </div>
                <div class="card-panel-description">
                    <div class="card-panel-text">今日实名客户</div>
                    <count-to class="card-panel-num" :startVal="0" :endVal="panelData.now_number_of_customer" :duration="3000"></count-to>
                </div>
            </div>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
            <div class="card-panel" @click="handleSetLineChartData('purchases')">
                <div class="card-panel-icon-wrapper icon-money">
                    <svg-icon icon-class="money" class-name="card-panel-icon"/>
                </div>
                <div class="card-panel-description">
                    <div class="card-panel-text">今日订单数量</div>
                    <count-to class="card-panel-num" :startVal="0" :endVal="panelData.now_number_of_orders" :duration="3200"></count-to>
                </div>
            </div>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
            <div class="card-panel" @click="handleSetLineChartData('shoppings')">
                <div class="card-panel-icon-wrapper icon-shoppingCard">
                    <svg-icon icon-class="shoppingCard" class-name="card-panel-icon"/>
                </div>
                <div class="card-panel-description">
                    <div class="card-panel-text">今日微信客户</div>
                    <count-to class="card-panel-num" :startVal="0" :endVal="panelData.now_number_of_wechat" :duration="3600"></count-to>
                </div>
            </div>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
            <div class='card-panel' @click="handleSetLineChartData('newVisitis')">
                <div class="card-panel-icon-wrapper icon-people">
                    <svg-icon icon-class="all-servers" class-name="card-panel-icon"/>
                </div>
                <div class="card-panel-description">
                    <div class="card-panel-text">总共领券次数</div>
                    <count-to class="card-panel-num" :startVal="0" :endVal="panelData.number_of_coupons" :duration="2600"></count-to>
                </div>
            </div>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
            <div class="card-panel" @click="handleSetLineChartData('messages')">
                <div class="card-panel-icon-wrapper icon-message">
                    <svg-icon icon-class="message" class-name="card-panel-icon"/>
                </div>
                <div class="card-panel-description">
                    <div class="card-panel-text">总共实名客户</div>
                    <count-to class="card-panel-num" :startVal="0" :endVal="panelData.number_of_customer" :duration="3000"></count-to>
                </div>
            </div>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
            <div class="card-panel" @click="handleSetLineChartData('purchases')">
                <div class="card-panel-icon-wrapper icon-money">
                    <svg-icon icon-class="money" class-name="card-panel-icon"/>
                </div>
                <div class="card-panel-description">
                    <div class="card-panel-text">总共订单数量</div>
                    <count-to class="card-panel-num" :startVal="0" :endVal="panelData.number_of_orders" :duration="3200"></count-to>
                </div>
            </div>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
            <div class="card-panel" @click="handleSetLineChartData('shoppings')">
                <div class="card-panel-icon-wrapper icon-shoppingCard">
                    <svg-icon icon-class="shoppingCard" class-name="card-panel-icon"/>
                </div>
                <div class="card-panel-description">
                    <div class="card-panel-text">总共微信客户</div>
                    <count-to class="card-panel-num" :startVal="0" :endVal="panelData.number_of_wechat" :duration="3600"></count-to>
                </div>
            </div>
        </el-col>
    </el-row>
</template>

<script>
    import CountTo from 'vue-count-to'

    export default {
        props: {
            panelData: {
                type: Object,
                default() {
                    return {
                        number_of_coupons: 0,
                        number_of_customer: 0,
                        number_of_orders: 0,
                        number_of_wechat: 0,
                        now_number_of_coupons: 0,
                        now_number_of_customer: 0,
                        now_number_of_orders: 0,
                        now_number_of_wechat: 0,
                    }
                }
            }
        },
        components: {
            CountTo
        },
        methods: {
            handleSetLineChartData(type) {
                this.$emit('handleSetLineChartData', type)
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .panel-group {
        .card-panel-col {
            margin-bottom: 15px;
        }
        .card-panel {
            height: 108px;
            cursor: pointer;
            font-size: 12px;
            position: relative;
            overflow: hidden;
            color: #666;
            background: #fff;
            box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
            border-color: rgba(0, 0, 0, .05);
            &:hover {
                .card-panel-icon-wrapper {
                    color: #fff;
                }
                .icon-people {
                    background: #40c9c6;
                }
                .icon-message {
                    background: #36a3f7;
                }
                .icon-money {
                    background: #f4516c;
                }
                .icon-shoppingCard {
                    background: #34bfa3
                }
            }
            .icon-people {
                color: #40c9c6;
            }
            .icon-message {
                color: #36a3f7;
            }
            .icon-money {
                color: #f4516c;
            }
            .icon-shoppingCard {
                color: #34bfa3
            }
            .card-panel-icon-wrapper {
                float: left;
                margin: 14px 0 0 14px;
                padding: 16px;
                transition: all 0.38s ease-out;
                border-radius: 6px;
            }
            .card-panel-icon {
                float: left;
                font-size: 48px;
            }
            .card-panel-description {
                float: right;
                font-weight: bold;
                margin: 26px;
                margin-left: 0px;
                .card-panel-text {
                    line-height: 18px;
                    color: rgba(0, 0, 0, 0.45);
                    font-size: 16px;
                    margin-bottom: 12px;
                }
                .card-panel-num {
                    font-size: 20px;
                }
            }
        }
    }
</style>
