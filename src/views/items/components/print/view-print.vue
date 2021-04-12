<template>
    <div id="printcontent" class="print-wrap" v-show="false">
        <div class="print-head">
            <canvas class="head-canvas" id="canvas"></canvas>
            <div class="head-text">
                <div class="p1"><span id="merchant_name">{{params.merchant_name}}</span></div>
                <div class="p2">竭诚献礼</div>
            </div>
        </div>
        <div class="print-body">
            <div class="body-box">
                <div class="title-radius">
                    <img class="bg-black"
                         src="data:image/png;base64,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">
                    <div class="tt1">贵宾</div>
                    <div class="tt1">信息</div>
                </div>
                <div class="text-box">
                    <div class="t-m">
                        <div class="t1">姓名: <span id="contacts">{{params.contacts}}</span></div>
                        <div class="t2">电话: <span id="contact_phone">{{params.contact_phone}}</span></div>
                    </div>
                    <div class="t-m">
                        地址: <span id="receiving_address">{{params.receiving_address}}</span>
                    </div>
                </div>
            </div>
            <div class="body-box">
                <div class="title-radius">
                    <img class="bg-black"
                         src="data:image/png;base64,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">
                    <div class="tt1">服务</div>
                    <div class="tt1">专员</div>
                </div>
                <div class="text-box">
                    <div class="t-m">
                        <div class="t1">姓名: <span id="sales_man">{{params.sales_man}}</span></div>
                        <div class="t2">电话: <span id="mobile">{{params.mobile}}</span></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="print-footer">
            <div class="top-line"></div>
            <template v-if="params.qr_code">
                <img id="qr_code" class="img" :src="appPreview + params.qr_code">
                <div class="text">
                    扫描二维码，获取贵宾专属服务
                </div>
            </template>
            <template v-else>
                <img class="img"
                     src="data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QONaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzOCA3OS4xNTk4MjQsIDIwMTYvMDkvMTQtMDE6MDk6MDEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NWNmODA3OTItNGU0Ny1hYTQ5LTlmNmEtMDc2NDhlZGUyZGFjIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjExMEU4MEIyNjcxQjExRTlBQkYwODY2MDQ5MDExMjY5IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjExMEU4MEIxNjcxQjExRTlBQkYwODY2MDQ5MDExMjY5IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjYwMTkyYWQ4LWJmZGUtZjg0MS1iOGE3LTQ0ZmI4NDYxNWI0MSIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjVlZGJiMThkLTVmNjgtNmY0Zi04ODZjLTNlZWQ0NmQyMWM4NiIvPiA8L3Jk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">
                <div class="text">
                    扫描关注<span class="t1">好客派</span>，领取更多好礼
                </div>
            </template>
        </div>
    </div>
</template>

<script>
    import api from '../../../../apis/api';
    import QRCode from 'qrcode';

    export default {
        name: "view-print",
        components: {},
        computed: {
            appPreview() {
                return api.appDownload();
            },
        },
        props: {
            params: {
                type: Object,
                default() {
                    return {}
                }
            },
            printNow: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                erweima: '',
                canvas: '',
                printCard: false,
            }
        },
        methods: {
            qrcode(doc, {width, height}) {
                let _this = this;
                //生成的二维码内容，可以添加变量
                // let str = this.params.out_trade_no || 'http://www.baidu.com';
                let newParams = {};
                newParams.id = this.params.id;
                newParams.out_trade_no = this.params.out_trade_no;
                let str = JSON.stringify(newParams);
                let canvas = doc.getElementById('canvas');
                QRCode.toCanvas(canvas, str, {
                    width: width,
                    height: height
                }, function (error) {
                    if (error) console.error(error);
                    // console.log('success!');
                });
            },
            print() {
                let loading = this.$loading({background: 'rgba(0, 0, 0, 0.5)'});
                //判断iframe是否存在，不存在则创建iframe
                let iframe = document.getElementById("print-iframe");
                if (!iframe) {
                    let el = document.getElementById("printcontent");
                    iframe = document.createElement('IFRAME');
                    let doc = null;
                    iframe.setAttribute("id", "print-iframe");
                    iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;');
                    document.body.appendChild(iframe);
                    doc = iframe.contentWindow.document;
                    //这里可以自定义样式
                    // doc.write('<LINK rel="stylesheet" type="text/css" href="/print.css">');
                    doc.write(`<style type="text/css">
                        * {
                            font-family: '黑体';
                        }
                        .print-wrap {
                            width: 387px;
                            height: 387px;
                            -webkit-box-sizing: border-box;
                            box-sizing: border-box;
                            padding: 30px 60px;
                            display: -webkit-box;
                            display: -ms-flexbox;
                            display: flex;
                            -ms-flex-flow: wrap;
                            flex-flow: wrap;
                        }

                        /* head */
                        .print-head {
                            -webkit-box-flex: 0;
                            -ms-flex-positive: 0;
                            flex-grow: 0;
                            -ms-flex-negative: 0;
                            flex-shrink: 0;
                            width: 100%;
                            height: 80px;
                            display: -webkit-box;
                            display: -ms-flexbox;
                            display: flex;
                        }
                        .print-head > .head-canvas {
                            width: 80px;
                            height: 80px;
                            border: 1px solid #000;
                            -webkit-box-sizing: border-box;
                            box-sizing: border-box;
                            -webkit-box-flex: 0;
                            -ms-flex-positive: 0;
                            flex-grow: 0;
                            -ms-flex-negative: 0;
                            flex-shrink: 0;
                        }
                        .print-head > .head-text {
                            width: 100%;
                            height: 100%;
                            -webkit-box-sizing: border-box;
                            box-sizing: border-box;
                            padding-left: 5px;
                            -webkit-box-flex: 1;
                            -ms-flex-positive: 1;
                            flex-grow: 1;
                            -ms-flex-negative: 0;
                            flex-shrink: 0;
                            display: -webkit-box;
                            display: -ms-flexbox;
                            display: flex;
                            -ms-flex-wrap: wrap;
                            flex-wrap: wrap;
                            line-height: 150%;
                        }
                        .head-text > .p1 {
                            width: 100%;
                            font-size: 28px;
                            font-weight: bold;
                            height: 50%;
                            line-height: 38px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        .head-text > .p2 {
                            width: 100%;
                            font-size: 22px;
                            height: 50%;
                            line-height: 38px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }

                        /* body */
                        .print-body {
                            margin-top: 10px;
                            width: 100%;
                            height: 180px;
                            -webkit-box-flex: 1;
                            -ms-flex-positive: 1;
                            flex-grow: 1;
                            -ms-flex-negative: 1;
                            flex-shrink: 1;
                            display: -webkit-box;
                            display: -ms-flexbox;
                            display: flex;
                            -ms-flex-wrap: wrap;
                            flex-wrap: wrap;
                        }
                        .print-body > .body-box {
                            width: 100%;
                            box-sizing: border-box;
                            padding: 0 10px;
                            -webkit-box-flex: 1;
                            -ms-flex-positive: 1;
                            flex-grow: 1;
                            -ms-flex-negative: 1;
                            flex-shrink: 1;
                            display: -webkit-box;
                            display: -ms-flexbox;
                            display: flex;
                            -webkit-box-align: center;
                            -ms-flex-align: center;
                            align-items: center;
                        }
                        .body-box > .title-radius {
                            width: 47px;
                            height: 47px;
                            border-radius: 50%;
                            font-size: 12px;
                            -webkit-box-flex: 0;
                            -ms-flex-positive: 0;
                            flex-grow: 0;
                            -ms-flex-negative: 0;
                            flex-shrink: 0;
                            display: -webkit-box;
                            display: -ms-flexbox;
                            display: flex;
                            -ms-flex-wrap: wrap;
                            flex-wrap: wrap;
                            -ms-flex-line-pack: center;
                            align-content: center;
                            position: relative;
                        }
                        .title-radius > .bg-black {
                            position:absolute;
                            width: 100%;
                            height: 100%;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            z-index: -1;
                        }
                        .body-box > .title-radius > .tt1 {
                            text-align: center;
                            width: 100%;
                            line-height: 1.2;
                            letter-spacing: 1px;
                            font-weight: bold;
                            color: white;
                        }
                        .body-box > .text-box {
                            width: 100%;
                            -webkit-box-flex: 1;
                            -ms-flex-positive: 1;
                            flex-grow: 1;
                            -ms-flex-negative: 1;
                            flex-shrink: 1;
                            -webkit-box-sizing: border-box;
                            box-sizing: border-box;
                            padding-left: 7.5px;
                            font-size: 16px;
                        }
                        .body-box .t-m {
                            width: 100%;
                            -webkit-box-sizing: border-box;
                            box-sizing: border-box;
                            padding: 2.5px;
                            display: -webkit-box;
                            display: -ms-flexbox;
                            display: flex;
                        }
                        .t-m > .t1 {
                            width: 40%;
                            margin-right: 2%;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            text-align: left;
                        }
                        .t-m > .t2 {
                            width: 56%;
                            margin-left: 2%;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            text-align: right;
                        }

                        /* footer */
                        .print-footer {
                            -webkit-box-flex: 0;
                            -ms-flex-positive: 0;
                            flex-grow: 0;
                            -ms-flex-negative: 0;
                            flex-shrink: 0;
                            width: 100%;
                            height: 100px;
                            padding: 0 36px;
                            -webkit-box-sizing: border-box;
                            box-sizing: border-box;
                            text-align: center;
                        }
                        .print-footer > .top-line {
                            border-top: 1px dashed #030000;
                        }
                        .print-footer > .img {
                            width: 65px;
                            height: 65px;
                            margin: 25px auto 15px;
                        }
                        .print-footer > .text {
                            font-size: 8px;
                        }
                        .print-footer > .text > .t1 {
                            font-size: 10px;
                            font-weight: bold;
                        }
                    </style>`);
                    doc.write('<div>' + el.innerHTML + '</div>');
                    this.qrcode(doc, {width: 80, height: 80});
                    this.changeData(doc);
                    doc.close();
                    iframe.contentWindow.focus();
                }
                setTimeout(() => {
                    iframe.contentWindow.print();
                    document.body.removeChild(iframe);
                    this.closePrint();
                    loading.close();
                }, 1000);
            },
            changeData(doc) {
                doc.getElementById('merchant_name').innerHTML = this.params.merchant_name;
                doc.getElementById('contacts').innerHTML = this.params.contacts;
                doc.getElementById('contact_phone').innerHTML = this.params.contact_phone;
                doc.getElementById('receiving_address').innerHTML = this.params.receiving_address;
                doc.getElementById('sales_man').innerHTML = this.params.sales_man;
                doc.getElementById('mobile').innerHTML = this.params.mobile;
                let qr_code = doc.getElementById('qr_code');
                if (qr_code) {
                    qr_code.src = this.appPreview + this.params.qr_code;
                }
                // console.log(doc.getElementById('qr_code'))
            },
            init() {
                // console.log(this.params);
                this.qrcode(document, {width: 88, height: 88});
            },
            closePrint() {
                this.printCard = false;
                this.$emit('update:printNow', false)
            },
        },
        mounted() {
            this.init();
            this.printCard = this.printNow;
        },
        watch: {
            printNow: {
                handler(val) {
                    if (val) {
                        this.print();
                    }
                },
                deep: true
            }
        }
    }
</script>

<style scoped>
    @import "print.css";
</style>
