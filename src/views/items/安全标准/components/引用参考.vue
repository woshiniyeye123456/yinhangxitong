<template>
  <div class="wrap">
    <div class="title">
      <svg-icon class="img" :icon-class="iconName"></svg-icon>
      <span class="text">{{ title }}</span>
    </div>
    <div class="content">
      <el-checkbox-group v-model="checkValue">
        <el-checkbox
          v-for="(item, index) in list"
          :key="index"
          :label="item.id"
          :disabled="disabled"
          style="margin-top: 14px"
        >
          {{ item.name }}
          <label class="super-mini-button" style="margin-left: 8px">
            <el-button
              type="success"
              @click.stop="viewDetails"
              plain
              size="mini"
            >
              详情
            </el-button>
          </label>
        </el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
  export default {
    name: "引用参考",
    props: {
      iconName: {
        type: String,
        default: '',
      },
      title: {
        type: String,
        default: '',
      },
      list: {
        type: Array,
        default() {
          return []
        }
      },
      value: {
        type: Array,
        default() {
          return []
        }
      },
      disabled: {
        type: Boolean,
        default: false,
      }
    },
    data() {
      return {
        checkValue: [],
      }
    },
    methods: {
      viewDetails(e) {
        console.log(e);
      }
    },
    mounted() {
      this.checkValue = this.value || [];
    },
    watch: {
      value: {
        handler(val) {
          this.checkValue = val || [];
        },
        deep: true
      },
      checkValue: {
        handler(val) {
          this.$emit('input', val)
        },
        deep: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .wrap {
    padding-left: 4px;

    > .title {
      width: 150px;
      height: 32px;
      background: rgba(0, 197, 212, 0.1);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;

      > .img {
        margin-right: 8px;
        font-size: 18px;
      }

      > .text {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(77, 83, 90, 1);
      }
    }

    > .content {
      padding-left: 44px;
      padding-top: 2px;
    }
  }
</style>
