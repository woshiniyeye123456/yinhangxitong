<template>
    <div class="tag-wrap">
        <el-tag
            :key="tag"
            v-for="tag in dynamicTags"
            :closable="!disabled"
            :disable-transitions="false"
            @close="handleClose(tag)">
            {{tag}}
        </el-tag>
        <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
        >
        </el-input>
        <el-button
          class="button-new-tag"
          v-else
          size="mini"
          type="default"
          @click="showInput"
          v-show="!disabled"
          icon="el-icon-plus"
        ></el-button>
    </div>
</template>

<script>
    export default {
        name: "tag-input",
        components: {},
        props: {
            value: {
                type: Array,
                default() {
                    return [];
                }
            },
            disabled: {
                type: Boolean,
                default: false,
            }
        },
        data() {
            return {
                dynamicTags: [],
                inputVisible: false,
                inputValue: ''
            };
        },
        methods: {
            handleClose(tag) {
                this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
            },

            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },

            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue) {
                    this.dynamicTags.push(inputValue);
                }
                this.inputVisible = false;
                this.inputValue = '';
            },
            init() {
                this.dynamicTags = this.value || [];
            }
        },
        mounted() {
            this.init();
        },
        watch: {
            dynamicTags: {
                handler(val) {
                    this.$emit('on-input', val);
                },
                deep: true,
            },
            value: {
                handler(val) {
                    this.dynamicTags = val;
                },
                deep: true,
            }
        }
    }
</script>

<style scoped>
    .el-tag + .el-tag {
        margin-left: 10px;
    }

    .button-new-tag {
        margin-left: 10px;
        height: 24px;
        line-height: 22px;
        padding-top: 0;
        padding-bottom: 0;
    }

    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }

    .button-new-tag, .el-tag--medium {
        vertical-align: top;
        margin-top: 3px;
    }
</style>
