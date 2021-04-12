<template>
  <div>
    <el-card shadow="never" class="default-card">
      <div slot="header" class="clearfix">
        <span class="slot-title">模块权限</span>
        <div class="fr">
          <el-button
            @click="clearTree"
            size="mini"
          >
            清空
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="allSelected"
          >
            全选
          </el-button>
          <el-button
            :disabled="disabledSave"
            type="primary"
            size="mini"
            @click="savePerm"
          >
            保存
          </el-button>
        </div>
      </div>
      <div class="content-tree">
        <el-tree
          :default-checked-keys="defaultCheckedKeys"
          ref="treeRef"
          highlight-current
          default-expand-all
          :data="treeData"
          :props="props"
          show-checkbox
          node-key="key"
          @node-click="nodeClick"
        >
        </el-tree>
      </div>
    </el-card>
    <template v-if="!disabledSave">
      <el-card shadow="never" class="default-card margin-top-14">
        <div slot="header" class="clearfix">
          <span class="slot-title">操作权限</span>
          <div class="fr"
               v-if="node && node.meta && node.meta.permissionList && node.meta.permissionList.length">
            <el-button
              @click="clearCheckbox"
              size="mini"
            >
              清空
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="allCheckbox"
            >
              全选
            </el-button>
          </div>
        </div>
        <div class="permission"
             v-if="node && node.meta && node.meta.permissionList && node.meta.permissionList.length"
        >
          <el-checkbox-group v-model="node.meta.permissions">
            <el-checkbox
              v-for="(item, index) in node.meta.permissionList"
              :label="item"
              :key="index"
            >
              {{ item }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </el-card>
    </template>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: '角色树',
    props: {
      disabledSave: {
        type: Boolean,
        default: false
      },
      permissionsChecked: {
        type: Array,
        default() {
          return []
        }
      },
      permissionsNode: {
        type: Array,
        default() {
          return []
        }
      },
    },
    data() {
      return {
        defaultCheckedKeys: ['index-indexchild'],
        allCheckedKeys: [],
        treeData: [],
        props: {
          label: '$title',
          children: 'children'
        },
        count: 1,
        node: [],
        checkList: [],
      };
    },
    computed: {
      ...mapGetters([
        'all_routers',
      ]),
    },
    methods: {
      clearCheckbox() {
        this.node.meta.permissions = [];
      },
      allCheckbox() {
        this.node.meta.permissions = [];
        this.node.meta.permissions.push(...this.node.meta.permissionList)
      },
      nodeClick(data) {
        // console.log(data);
        data.meta.permissions = data.meta.permissions || [];
        this.node = data;
      },
      setPropsCheckedKeys() {
        this.node = '';
        this.$refs.treeRef.setCheckedKeys(this.defaultCheckedKeys.concat(this.permissionsChecked))
      },
      setPropsCheckedNodes() {
        if (!this.permissionsNode.length) {
          return
        }
        this.permissionsNode.forEach(item => {
          if (item.operations && item.operations.length) {
            let node = this.findTreeNode(item.resources, this.treeData);
            node.meta.permissions = item.operations;
          }
        });
      },
      findTreeNode(key, data) {
        let node;
        if (data && data.length) {
          let len = data.length;
          for (let i = 0; i < len; i++) {
            let it = data[i];
            if (it.key === key) {
              node = it;
              break
            }
            if (it.children) {
              node = this.findTreeNode(key, it.children)
            }
            if (node) {
              break
            }
          }
        }
        return node
      },
      allSelected() {
        this.$refs.treeRef.setCheckedKeys(this.allCheckedKeys);
        this.$confirm('确认一并全选所有按钮权限吗?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.setAllCheckbox(this.treeData);
        }).catch(() => {

        });
      },
      setAllCheckbox(data) {
        if (data && data.length) {
          data.forEach(item => {
            if (item.meta && item.meta.permissions && item.meta.permissionList) {
              item.meta.permissions = [];
              item.meta.permissions.push(...item.meta.permissionList);
            }
            if (item.children && item.children.length) {
              this.setAllCheckbox(item.children)
            }
          });
        }
      },
      clearTree() {
        this.$refs.treeRef.setCheckedKeys(this.defaultCheckedKeys)
      },
      savePerm() {
        let nodes = this.$refs.treeRef.getCheckedNodes().filter(role => {
          return role.key
        });
        let node = [];
        nodes.forEach(item => {
          node.push({
            resources: item.key,
            operations: item.meta.permissions || [],
          })
        });
        this.$emit('save-perm', node)
      },
      filterTree(data) {
        let arr = [];
        if (data && data.length) {
          data = data.filter(item => {
            return item.hidden !== true;
          });
          data.forEach(item => {
            let obj = this.$common.deepClone(item, null, 'parent');
            obj.$title = obj.meta.title;
            obj.disabled = obj.$disabled;
            if (obj.children) {
              obj.children = this.filterTree(obj.children);
            } else {
              //把所有节点存起来
              this.allCheckedKeys.push(obj.key)
            }
            arr.push(obj);
          });
        }
        return arr;
      },
      initTree() {
        // console.log(this.all_routers);
        this.treeData = this.all_routers.filter(item => {
          return item.hidden !== true;
        });
        this.treeData = this.filterTree(this.treeData);
      },
      init() {
        this.initTree();
      },
    },
    mounted() {
      this.init();
    },
    watch: {
      permissionsChecked: {
        handler() {
          this.setPropsCheckedKeys();
        },
        deep: true
      },
      permissionsNode: {
        handler() {
          this.setPropsCheckedNodes();
        },
        deep: true
      }
    }
  };
</script>

<style lang="scss" scoped>
  .content-tree {
    box-sizing: border-box;
    padding: 6px 0;
    height: 450px;
    overflow-y: auto;
  }

  .permission {
    box-sizing: border-box;
    padding: 6px 0;
    height: 150px;
    overflow-y: auto;
  }
</style>
