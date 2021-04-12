<template>
    <div class="dndList">
        <div class="dndList-list" :style="{width:width1}">
            <h3>{{list1Title}}（{{filterList1.length}}）</h3>
            <el-form label-width="180px" class="border-form">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="标签">
                            <el-checkbox-group v-model="questionTag">
                                <el-checkbox
                                    v-for="(item, index) in questionTags"
                                    :key="index"
                                    :label="item.id"
                                >
                                    {{item.name}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="关键字搜索">
                            <el-input
                                v-model="content"
                            >
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <draggable @change="dragChange1" :list="filterList1" class="dragArea" :options="{group:'article'}"
                       :style="{height: height1}">
                <div class="list-complete-item" v-for="element1 in filterList1" :key='element1.id'>
                    <div class="list-complete-item-handle" @dblclick="pushEle(element1)">{{element1.description}}</div>
                </div>
            </draggable>
        </div>
        <div class="dndList-list" :style="{width:width2}">
            <h3>{{list2Title}} （{{list2.length}}）</h3>
            <draggable @change="dragChange2" :list="list2" class="dragArea" :options="{group:'article'}"
                       :style="{height: height2}">
                <div class="list-complete-item" v-for="element2 in list2" :key='element2.id'>
                    <div class='list-complete-item-handle2' @dblclick="deleteEle(element2)"> {{element2.description}}
                    </div>
                    <div style="position:absolute;right:0;">
                        <span style="float: right ;margin-top: -20px;margin-right:5px;" @click="deleteEle(element2)">
                          <i style="color:#ff4949" class="el-icon-delete"></i>
                        </span>
                    </div>
                </div>
            </draggable>
        </div>
    </div>
</template>

<script>
    import draggable from 'vuedraggable'

    export default {
        name: 'DndList',
        components: {draggable},
        computed: {
            filterList1() {
                let _search = this.content;
                let _tags = this.questionTag;
                return this.list1.filter(v => {
                    let onOff = false;
                    onOff = this.isNotInList2(v);
                    if (onOff) {
                        if (_search) {
                            onOff = Object.keys(v).some(key => {
                                return String(v[key]).toLowerCase().indexOf(_search) > -1
                            });
                        }
                    }
                    if (onOff) {
                        if (_tags && _tags.length) {
                            onOff = _tags.some(tag => {
                                if (v.tags && v.tags.length) {
                                    return v.tags.some(vTag => {
                                        return vTag.id === tag;
                                    });
                                }
                                return false
                            });
                        }
                    }
                    return onOff
                })
            },
            filterList2() {
                return this.list2.filter(v => {
                    if (this.isNotInList1(v)) {
                        return v
                    }
                    return false
                })
            },
        },
        data() {
            return {
                content: '',
                questionTag: [],
            }
        },
        props: {
            questionTags: {
                type: Array,
                default() {
                    return []
                }
            },
            list1: {
                type: Array,
                default() {
                    return []
                }
            },
            list2: {
                type: Array,
                default() {
                    return []
                }
            },
            list1Title: {
                type: String,
                default: 'list1'
            },
            list2Title: {
                type: String,
                default: 'list2'
            },
            width1: {
                type: String,
                default: '48%'
            },
            width2: {
                type: String,
                default: '48%'
            },
            height1: {
                type: String,
                default: 'auto'
            },
            height2: {
                type: String,
                default: 'auto'
            },
        },
        methods: {
            dragChange1(list) {
                if (list.removed) {
                    this.pushEle(list.removed.element)
                }
            },
            dragChange2(list) {
                if (list.removed) {
                    this.deleteEle(list.removed.element)
                }
            },
            isNotInList1(v) {
                return this.list1.every(k => v.id !== k.id)
            },
            isNotInList2(v) {
                return this.list2.every(k => v.id !== k.id)
            },
            pushEle(ele) {
                if (this.isNotInList2(ele)) {
                    this.list2.push(ele)
                }
            },
            deleteEle(ele) {
                for (const item of this.list2) {
                    if (item.id === ele.id) {
                        const index = this.list2.indexOf(item);
                        this.list2.splice(index, 1);
                        break
                    }
                }
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .dndList {
        background: #fff;
        padding-bottom: 40px;
        &:after {
            content: "";
            display: table;
            clear: both;
        }
        .dndList-list {
            float: left;
            padding-bottom: 30px;
            &:first-of-type {
                margin-right: 2%;
            }
            .dragArea {
                overflow-y: auto;
                padding-right: 7px;
                min-height: 50px;
            }
        }
    }

    .list-complete-item {
        cursor: pointer;
        position: relative;
        font-size: 14px;
        padding: 5px 12px;
        margin-top: 4px;
        border: 1px solid #bfcbd9;
        transition: all 1s;
    }

    .list-complete-item-handle {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 50px;
    }

    .list-complete-item-handle2 {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 20px;
    }

    .list-complete-item.sortable-chosen {
        background: #4AB7BD;
    }

    .list-complete-item.sortable-ghost {
        background: #30B08F;
    }

    .list-complete-enter,
    .list-complete-leave-active {
        opacity: 0;
    }
</style>
