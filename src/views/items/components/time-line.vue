<template>
    <div class="time-bd">
        <span class="time-title">Activity Timeline</span>
        <ul>
            <li>
                <div class="time-circle purple"><i class="el-icon-plus"></i></div>
                <div class="time-content">
                    <div class="time-content-title">Client Meeting</div>
                    <div class="time-content-intro">Bonbon macaroon jelly beans gummi bears jelly lollipop</div>
                    <span class="time-content-day">2019-12-13</span>
                </div>
            </li>
            <li>
                <div class="time-circle orange"><i class="el-icon-message"></i></div>
                <div class="time-content">
                    <div class="time-content-title">Email Newsletter</div>
                    <div class="time-content-intro">Cupcake gummi bears soufflé caramels candy</div>
                    <span class="time-content-day">2019-12-13</span>
                </div>
            </li>
            <li>
                <div class="time-circle blue"><i class="el-icon-service"></i></div>
                <div class="time-content">
                    <div class="time-content-title">Plan Webinar</div>
                    <div class="time-content-intro">Candy ice cream cake. Halvah gummi bears</div>
                    <span class="time-content-day">2019-12-13</span>
                </div>
            </li>
            <li>
                <div class="time-circle red"><i class="el-icon-setting"></i></div>
                <div class="time-content">
                    <div class="time-content-title">Launch Website</div>
                    <div class="time-content-intro">Candy ice cream cake. Halvah gummi bears Cupcake gummibears soufflé caramels candy.
                    </div>
                    <span class="time-content-day">2019-12-13</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                msg: '这是条数据',
            }

        },
        components: { // 组件
        },
        methods: {
            setMeg() {
                this.msg = '我是改变后的数据'
            }
        },
        beforeCreate() { // 实例刚刚被创建
        },
        created() { //实例已经创建完成
        },
        beforeMount() { // 模板编译之前
        },
        mounted() { // 模板编译完成
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
    .time-bd{
        padding: 17px 21px;
        background-color: white;
        border-radius:6px;
    }
    .time-bd ul{
        margin: 0;
        padding: 0;
        margin-top: 38px;
    }
    .time-bd ul li{
        list-style-type: none;
        color: white;
        font-size: 19px;
        display: flex;
        flex-direction: row;
        position: relative;
        z-index: 0;
        padding-bottom: 37px;
        cursor: pointer;
    }
    .time-bd ul li:after{
        content: "";
        width: 1px;
        height: 100%;
        left: 20px;
        top: 0;
        position: absolute;
        background-color: rgba(220,220,220,1);
        z-index: -1;
    }
    .time-bd ul li:last-child:after{
        width: 0;
    }
    .purple{
        background:rgba(115,103,240,1);
    }
    .orange{
        background:rgba(255,159,67,1);
    }
    .blue{
        background:rgba(40,199,111,1);
    }
    .red{
        background:rgba(234,84,85,1);
    }
.time-circle{
    width:40px;
    height:40px;
    border-radius:50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all .3s;
    cursor: pointer;
}
.time-circle:hover{
    transform: scale(1.2);
}
.time-content{
    width: calc(100% - 40px);
    margin-left: 11px;
}
    .time-content-title{
        font-size:16px;
        font-weight:400;
        color:rgba(44,44,44,1);
        margin-bottom: 4px;
    }
    .time-content-intro{
        font-size:14px;
        font-weight:400;
        color:rgba(98,98,98,1);
        margin-bottom: 4px;
        display: -webkit-box;
        -webkit-line-clamp:3;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .time-content-day{
        font-size:12px;
        font-weight:400;
        color:rgba(175,186,197,1);
    }
</style>
