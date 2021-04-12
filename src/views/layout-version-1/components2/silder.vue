<template>
    <div class="slider-bg">
        <new-slider  :routes="routes"></new-slider>
    </div>
</template>

<script>
    import newSlider from './NewSilderItem.vue'
    export default {
        props: {
            routes: {
                type: Array
            },
        },
        data() {
            return {
                msg: '这是silder',
            }

        },
        components: { // 组件
            newSlider
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
.slider-bg{
    height:62px;
    background:rgba(255,255,255,1);
    border-radius:6px;
    margin-top: 20px;
}
</style>