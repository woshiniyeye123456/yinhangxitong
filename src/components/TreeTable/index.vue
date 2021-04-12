<template>
    <el-table :data="formatData" :row-style="showRow" v-bind="$attrs">
        <el-table-column v-if="columns.length===0" width="150">
            <template slot-scope="scope">
                <span v-for="space in scope.row._level" class="ms-tree-space" :key="space"></span>
                <span class="tree-ctrl" v-if="iconShow(0,scope.row)" @click="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-plus"></i>
          <i v-else class="el-icon-minus"></i>
        </span>
                {{scope.$index}}
            </template>
        </el-table-column>
        <el-table-column v-else v-for="(column, index) in columns" :key="column.prop" :label="column.label"
                         :width="column.width">
            <template slot-scope="scope">
                <span v-if="index === 0" v-for="space in scope.row._level" class="ms-tree-space" :key="space"></span>
                <span class="tree-ctrl" v-if="iconShow(index,scope.row)" @click="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-plus"></i>
          <i v-else class="el-icon-minus"></i>
        </span>
                {{scope.row[column.prop]}}
            </template>
        </el-table-column>
        <!-- 功能字段 -->
        <template
                v-if="(tableOptions.active && tableOptions.active.length) ||
                    (tableOptions.filterNameActive && tableOptions.filterNameActive.length)"
        >
            <el-table-column
                    fixed="right"
                    label="操作"
                    :width="tableOptions.active.length * 80 + tableOptions.filterNameActive.length * 120 + 60"
                    align="center"
            >
                <template slot-scope="scope">
                    <template v-if="tableOptions.filterNameActive && tableOptions.filterNameActive.length">
                        <el-button
                                v-for="(item, index) in tableOptions.filterNameActive"
                                :key="index"
                                @click="onFilterNameActive(scope, item)" type="primary"
                                size="mini">
                            {{item}}
                        </el-button>
                    </template>
                </template>
            </el-table-column>
        </template>
        <slot></slot>
    </el-table>
</template>

<script>
    /**
     * Auth: Lei.j1ang
     * Created: 2018/1/19-13:59
     * modifier: Ge.Qiao 2019-1-16
     */
    import treeToArray from './eval'

    export default {
        name: 'treeTable',
        props: {
            data: {
                type: [Array, Object],
                required: true
            },
            columns: {
                type: Array,
                default: () => []
            },
            tableOptions: {
                type: Object,
            },
            evalFunc: Function,
            evalArgs: Array,
            expandAll: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            // 格式化数据源
            formatData: function () {
                let tmp
                if (!Array.isArray(this.data)) {
                    tmp = [this.data]
                } else {
                    tmp = this.data
                }
                const func = this.evalFunc || treeToArray
                const args = this.evalArgs ? Array.concat([tmp, this.expandAll], this.evalArgs) : [tmp, this.expandAll]
                return func.apply(null, args)
            }
        },
        methods: {
            onFilterNameActive(params, active) {
                // 传递动作
                params.$active = active;
                this.$emit('on-filter-name-active', params);
            },
            showRow: function (row) {
                const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true);
                row.row._show = show
                return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
            },
            // 切换下级是否展开
            toggleExpanded: function (trIndex) {
                const record = this.formatData[trIndex]
                record._expanded = !record._expanded
            },
            // 图标显示
            iconShow(index, record) {
                return (index === 0 && record.children && record.children.length > 0)
            }
        }
    }
</script>
<style rel="stylesheet/css">
    @keyframes treeTableShow {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @-webkit-keyframes treeTableShow {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
    $color-blue: #2196F3;
    $space-width: 18px;
    .ms-tree-space {
        position: relative;
        top: 1px;
        display: inline-block;
        font-style: normal;
        font-weight: 400;
        line-height: 1;
        width: $space-width;
        height: 14px;
        &::before {
            content: ""
        }
    }

    .processContainer {
        width: 100%;
        height: 100%;
    }

    table td {
        line-height: 26px;
    }

    .tree-ctrl {
        position: relative;
        cursor: pointer;
        color: $color-blue;
        margin-left: -$space-width;
    }
</style>
