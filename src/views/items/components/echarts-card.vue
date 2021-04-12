<template>
    <div class="card-bd">
        <div class="card-circle" :style="{ backgroundColor: cardCircle }"></div>
        <div class="card-title">{{ cardTitle }}</div>
        <div class="card-se-title">{{ secondTitle }}</div>
        <div>
            <ve-line
                    :width="'100%'"
                    :height="'94px'"
                    :data="chartData"
                    :settings="chartSettings"
                    :extend="chartOptions"
                    :legend-visible="false"
                    ref="mycharts"
            >
            </ve-line>
            <!--@ready="onReady"-->
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            chartData: {
                type: Object
            },
            cardTitle: {
                type: String,
                default: '好像没有表名~'
            },
            secondTitle: {
                type: String,
                default: '好像没有二级名字~'
            },
            cardCircle: {
                type: String,
                default: 'rgba(40, 199, 111, 0.24)'
            }
        },
        data() {
            return {
                msg: '这是条数据',
                chartOptions: {
                    xAxis: {
                        show: false,
                        axisLine: {
                            onZero: false
                        },
                    },
                    yAxis: {
                        show: false
                    },
                    grid: {
                        left: '-10%',
                        right: '-10%',
                        bottom: '0',
                        top: '0',
                        containLabel: false,
                        borderWidth: 0
                    },
                    series:[
                        {
                            areaStyle: {
                                normal: {
//                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
//                                        offset: 0,
//                                        color: 'rgba(63,227,236,0.8)'
//                                    }, {
//                                        offset: .4,
//                                        color: 'rgba(63,227,236,0.3)'
//                                    }, {
//                                        offset: 1,
//                                        color: 'rgba(63,227,236,0.00)'
//                                    }])
                                },
                            },
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        color: '#28C76F' //改变折线颜色
                                    }
                                },
                                color: {
                                    type: 'linear',
                                    x: 0,//X轴起始坐标
                                    y: 0,//Y轴起始坐标
                                    x2: 1,//X轴终点坐标
                                    y2: 1,//Y轴终点坐标
                                    colorStops: [
                                        {offset: 0, color: '#4b69eb'}, // 0% 处的颜色},
                                        {offset: 1, color: '#01f4ff'} // 100% 处的颜色
                                    ],
                                }
                            },
                        }
                    ]
                },
                chartSettings: {
                    stack: {'用户': ['访问用户', '下单用户']},
                    area: true,
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                color: '#28C76F' //改变折线颜色
                            }
                        },
                        color: {
                            type: 'linear',
                            x: 0,//X轴起始坐标
                            y: 0,//Y轴起始坐标
                            x2: 1,//X轴终点坐标
                            y2: 1,//Y轴终点坐标
                            colorStops: [
                                {offset: 0, color: '#4b69eb'}, // 0% 处的颜色},
                                {offset: 1, color: '#01f4ff'} // 100% 处的颜色
                            ],
                        }
                    },
                }
            }
        },
        components: { // 组件
        },
        methods: {
            setMeg() {
                this.msg = '我是改变后的数据'
            },
            onReady (ins, echarts) {
                console.log(echarts,'onReady')
                const that = this;
                that.chartOptions = {
                    xAxis: {
                        show: false,
                        axisLine: {
                            onZero: false
                        },
                    },
                    yAxis: {
                        show: false
                    },
                    grid: {
                        left: '-10%',
                        right: '-10%',
                        bottom: '0',
                        top: '0',
                        containLabel: false,
                        borderWidth: 0
                    },
                    series:[
                        {
                            areaStyle: {
                                normal: {
//                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
//                                        offset: 0,
//                                        color: 'rgba(63,227,236,0.8)'
//                                    }, {
//                                        offset: .4,
//                                        color: 'rgba(63,227,236,0.3)'
//                                    }, {
//                                        offset: 1,
//                                        color: 'rgba(63,227,236,0.00)'
//                                    }])
                                },
                            },
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        color: '#28C76F' //改变折线颜色
                                    }
                                }
                            },
                        }
                    ]
                }
            }
        },
        beforeCreate() { // 实例刚刚被创建
        },
        created() { //实例已经创建完成
        },
        beforeMount() { // 模板编译之前
        },
        mounted() { // 模板编译完成
//            console.log(this.$refs.mycharts)
        },
        beforeUpdate() { // 数据更新之前
        },
        updated() { // 数据更新完毕
        },
        beforeDestroy() { // 实例销毁之前
        },
        destroyed() { // 实例销毁完成
        },
        watch: {
            example: {
                handler(val) {
                    if (val.example) {
                    }
                },
                deep: true
            },
        }
    }
</script>

<style scoped>
    .card-bd {
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 1);
        border-radius: 6px;
        padding-top: 24px;
    }

    .card-circle {
        width: 46px;
        height: 46px;
        /*background: rgba(40, 199, 111, 0.24);*/
        border-radius: 50%;
        margin-left: 24px;
    }

    .card-title {
        font-size: 24px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: rgba(44, 44, 44, 1);
        margin-top: 18px;
        margin-left: 24px;
    }

    .card-se-title {
        font-size: 15px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(98, 98, 98, 1);
        margin-top: 16px;
        margin-left: 24px;
    }
</style>
