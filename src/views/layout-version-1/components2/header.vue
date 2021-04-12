<template>
    <div class="head">
        <div class="main-width flex-center">
            <img class="company-logo" src="../../../assets/layout/logo.png"  alt="">
            <span class="company-name">昆玥科技</span>
            <div class="user-infor">
                <span>John don</span>
                <div class="circle"></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                msg: '这是条数据3412',
            }

        },
        components: { // 组件
        },
        computed() { // 计算属性
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
.head{
    height:70px;
    background:rgba(115,103,240,1);
}
.flex-center{
    display: flex;
    align-items: center;
    justify-content: center;
    height:70px;
    position: relative;
}
.user-infor{
    position: absolute;
    right: 0;
    top: 0;
    height: 70px;
    display: flex;
    align-items: center;
}
.user-infor span{
    font-size:16px;
    font-weight:400;
    color:rgba(255,255,255,1);
}
.circle{
    width:40px;
    height:40px;
    background:rgba(245,245,245,1);
    border-radius:20px;
    margin-left: 12px;
}
.company-logo{
    margin-right: 25px;
}
    .company-name{
        font-size:22px;
        font-weight:bold;
        color:rgba(255,255,255,1);
    }
</style>