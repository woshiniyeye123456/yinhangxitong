<template>
    <div class="line-chart-box" :style="{height: height +'px'}">
        <ve-chart
                :data="chartData"
                :data-zoom="dataZoom"
                :title="title"
                :settings="chartSettings"
                :grid="grid"
                :yAxis="yAxis"
                :xAxis="xAxis"
                height="100%"
        ></ve-chart>
    </div>
</template>

<script>
    import api from '../../../../apis/api'

    export default {
        name: "line-chart",
        props: {
            height: {
                type: Number,
                default: 400
            },
            chartData: {
                type: Object,
            },
            title: {
                type: Object
            },
            chartSettings: {
                type: Object
            },
            yAxis: {
                type: Object
            },
            xAxis: {
                type: Object
            },
        },
        data() {
            return {
                dataZoom: [
                    // {
                    //     type: 'slider',
                    //     start: 0,
                    //     end: 20
                    // }
                ],
                grid: {

                },
                // chartSettings: {
                //     type: 'line',
                //     // yAxisType: ['percent'],
                //     // symbolSize: 2,
                // },
                // yAxis: {
                //     // min: 1000,
                //     // max: 10000
                //     // axisLine: {
                //     //     show: false
                //     // },
                //     // axisLabel: {
                //     //     show: false
                //     // },
                //     // type: 'value',
                //     splitLine: {
                //         show: false
                //     },
                //     show: false,
                // },
                // xAxis: {
                //     type: 'time',
                //     splitLine: {
                //         show: false
                //     }
                // }
            }
        },
        methods: {
            getNumber(star, end) {
                star = star || 0;
                end = end || 100000;
                return parseInt(Math.random() * (end - star) + star)
            },
            init() {

            }
        },
        mounted() {
            this.init();
        }
    }
</script>

<style scoped>
    .line-chart-box {
        border: 1px solid #ebeef5;
        padding: 15px;
    }
</style>
