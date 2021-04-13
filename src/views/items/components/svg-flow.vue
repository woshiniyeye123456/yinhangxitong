<template>
  <div class="w-body">
    <svg v-if="isReady" id="ubox" data-name="z5" xmlns="http://www.w3.org/2000/svg" width="100%" height="280" viewBox="0 0 1000 280"
      :style="{
        'min-width': minWidth + 400
      }">

      <!--背景渐变色-->
      <defs>
        <linearGradient id="orange_red1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="rgba(0,197,212,0.2)" />
          <stop offset="50%" stop-color="rgba(0,197,212,0.2)" />
          <stop offset="100%" stop-color="rgba(0,197,212,0.2)" />
        </linearGradient>
        <linearGradient id="orange_red2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#f4fbfc" />
          <stop offset="50%" stop-color="#e2f5f7" />
          <stop offset="100%" stop-color="#dcf2f5" />
        </linearGradient>
        <marker id="Triangle" viewBox="0 0 20 20" refX="10" refY="10" markerWidth="10" markerHeight="10" orient="auto">
          <path d="M 0 0 L 20 10 L 0 20 z" fill="#469CFF" />
        </marker>
      </defs>

      <!--线及箭头-->
      <template v-for="(item,index) in links">
        <g data-name="u6">
          <polyline fill="none" stroke="#469CFF" stroke-width="1.5" :points="
            item.p1.x - 5 + ',' + item.p1.y + ' ' +
            item.p2.x + ',' + item.p2.y + ' ' +
            item.p3.x + ',' + item.p3.y + ' ' +
            (item.p4.x - 5) + ',' + item.p4.y
            "
            marker-end="url(#Triangle)"></polyline>
          <!--<path :d="`m${item.p4.x - 8}, ${ item.p4.y - 5.5} l0,11 l6,-6 l-6,-5`" fill="#469CFF"></path>-->
        </g>
      </template>

      <!--流程按钮-->
      <template v-for="(item, index) in nodes">
        <template>
          <g data-name="u1 20">
            <rect @click="onClick(index)" :width="(item.title.length * 19) + 6 + (item.deletable ? 15 : 0)" height="32"
              :x="item.x" :y="item.y" rx="4" ry="4" fill="#fff"></rect>
            <rect @click="onClick(index)" :width="(item.title.length * 19) + 6 + (item.deletable ? 15 : 0)" height="32"
              :x="item.x" :y="item.y" rx="4" ry="4" :stroke="item.isNow ? 'red' : 'rgb(0,197,212)'" stroke-width="1"
              fill="url(#orange_red1)" style="cursor: pointer;"></rect>
            <text @click="onClick(index)" fill="#rgba(36,39,63,1)" :y="item.y + parseInt(item.size.height / 2) + 6"
              font-weight="400" :x="item.x + parseInt(item.size.width / 2) +
              ( item.title.length <= 2 ? -2 : item.title.length <= 4 ? 0 : item.title.length <= 5 ? 2 : item.title.length - 2 )"
              style="font-size: 14px; text-anchor: middle;cursor: pointer; font-family: PingFangSC-Regular,PingFang SC;">
              {{ item.title }}
            </text>
          </g>
          <template v-if="!disabled">
            <template v-if="item.deletable">
              <circle r="8.6" fill="#fbb11b" :cx="item.x + item.size.width + 2" :cy="item.y + parseInt(item.size.height / 2) + 1"
                stroke="none" style="cursor: pointer;" @click="onClose(index)"></circle>
              <line stroke-width="1.6" :x1="item.x + item.size.width + 6" :y1="item.y + parseInt(item.size.height / 2) + 5"
                :x2="item.x + item.size.width - 1" :y2="item.y + parseInt(item.size.height / 2) - 3" stroke="#fff"
                style="cursor: pointer;" @click="onClose(index)"></line>
              <line stroke-width="1.6" :x1="item.x + item.size.width - 1" :y1="item.y + parseInt(item.size.height / 2) + 5"
                :x2="item.x + item.size.width + 6" :y2="item.y + parseInt(item.size.height / 2) - 3" stroke="#fff"
                style="cursor: pointer;" @click="onClose(index)"></line>
            </template>
          </template>
        </template>
      </template>
    </svg>
  </div>
</template>

<script>
export default {
  name: "svg-flow",
  props: {
    defaultNodes: {
      type: Array,
      default() {
        return [];
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    workspace: {
      type: [Array, String],
      default: ""
    }
  },
  data() {
    return {
      minWidth: 1000,
      isReady: false,
      originalNodes: [],
      nodes: [],
      links: [],
      anchor: {
        x: -200,
        y: 100
      },
      vs: 25,
      hs: 45,
      newIndex: 0
    };
  },
  methods: {
    changeRole(id) {
      this.originalNodes[this.newIndex].role_id = id;
    },

    getNode() {
      return this.originalNodes;
    },

    onClick(index) {
      this.newIndex = index;
      this.$emit("on-click", this.originalNodes[index]);
    },

    onClose(index) {
      let node = this.nodes[index];

      this.$emit("on-close", {
        workflow: JSON.stringify(this.originalNodes),
        node: node.name
      });

      // let parents = node.parents;
      // // console.log(parents)
      // parents.forEach(p => {
      //   this.originalNodes.forEach(on => {
      //     if (p.name === on.name) {
      //       on.next.unshift(...node.next)
      //     }
      //   });
      // });
      //
      // this.originalNodes.splice(index, 1);

      // this.init();
    },

    textSize(text) {
      let span = document.createElement("span");
      let result = {};
      result.width = span.offsetWidth;
      result.height = span.offsetHeight;
      span.style.visibility = "hidden";
      span.style.fontSize = "14dx";
      span.style.display = "inline-block";
      span.style.fontWeight = "400";
      span.style.fontFamily = "PingFangSC-Regular,PingFang SC";
      span.style.padding = "2px";
      document.body.appendChild(span);
      if (typeof span.textContent != "undefined") {
        span.textContent = text;
      } else {
        span.innerText = text;
      }
      result.width =
        parseFloat(window.getComputedStyle(span).width) - result.width + 14;
      result.height =
        parseFloat(window.getComputedStyle(span).height) - result.height + 9;
      return result;
    },

    computeSizes() {
      this.nodes.forEach(node => {
        node.size = this.textSize(node.title);
      });
    },

    computeLinks(node) {
      if (node.children) {
        node.children.forEach(child => {
          child.isDrawed = child.isDrawed || 0;
          if (child.isDrawed > 3) {
            return;
          }
          child.isDrawed++;
          this.computeLinks(child);
          let p1 = {};
          p1.x = node.x + node.size.width;
          p1.y = node.y + node.size.height / 2;
          let p2 = {};
          p2.x = child.x - this.hs / 2;
          p2.y = p1.y;
          let p3 = {};
          p3.x = p2.x;
          p3.y = child.y + child.size.height / 2;
          let p4 = {};
          p4.x = child.x;
          p4.y = p3.y;
          let link = {
            p1,
            p2,
            p3,
            p4
          };
          this.links.push(link);
        });
      }
    },

    buildFlowStructure() {
      let data = new Map();

      this.nodes = this.$common.deepClone(this.originalNodes);

      this.nodes.forEach(item => {
        if (typeof this.workspace === "object") {
          if (this.workspace.indexOf(item.name) !== -1) {
            item.isNow = true;
          }
        } else {
          if (item.name === this.workspace) {
            item.isNow = true;
          }
        }
        data.set(item.name, item);
      });

      this.nodes.forEach(item => {
        if (!item.next) {
          return;
        }
        item.next.forEach(child => {
          if (data.get(child.next_node)) {
            if (item.children) {
              item.children.push(data.get(child.next_node));
            } else {
              item.children = [data.get(child.next_node)];
            }
            if (data.get(child.next_node).parents) {
              data.get(child.next_node).parents.push(item);
            } else {
              data.get(child.next_node).parents = [item];
            }
          }
        });
      });
    },

    findRoot() {
      for (let i = 0; i < this.nodes.length - 1; i++) {
        if (this.nodes[i].parents == null) {
          return this.nodes[i];
        }
      }
      return null;
    },

    computeX(root, x0) {
      this.minWidth = Math.max(this.minWidth, x0);
      if (root.x == null) {
        root.x = x0;
      }
      root.computed_x = true;

      if (root.parents && root.parents.length > 1) {
        let mx = x0;
        root.parents.forEach(parent => {
          if (parent.x + parent.size.width + this.hs > mx) {
            mx = parent.x + parent.size.width + this.hs;
          }
        });
        root.x = mx;
      }

      if (root.children) {
        let x = root.x + this.hs + root.size.width;
        root.children.forEach(item => {
          if (!item.computed_x) {
            this.computeX(item, x);
          }
        });
      }
    },

    computeY(root, y0) {
      if (root.y) {
        return;
      }

      root.computed_y = true;

      root.y = y0;
      if (root.children) {
        let extHeight = 0;
        let y = y0;
        root.children.forEach(child => {
          if (!child.computed_y) {
            this.computeY(child, y);
            y += child.extHeight + this.vs;
            extHeight += child.extHeight + this.vs;
          }
        });
        root.extHeight = extHeight - this.vs;
      } else {
        root.extHeight = root.size.height;
      }
    },

    cascadeMoveY(parent, node, dy) {
      if (node.parents[0].name !== parent.name) {
        return;
      }
      node.y += dy;
      if (node.children) {
        node.children.forEach(child => {
          this.cascadeMoveY(node, child, dy);
        });
      }
    },

    init() {
      this.isReady = false;

      this.buildFlowStructure();

      // console.log(this.nodes);

      this.computeSizes();

      // console.log(this.nodes);
      // console.log(this.findRoot());

      this.computeX(this.findRoot(), this.anchor.x);
      this.computeY(this.findRoot(), this.anchor.y);
      this.links = [];

      this.computeLinks(this.findRoot());

      // console.log(this.findRoot());
      // console.log(this.nodes);
      // console.log(this.links);

      this.isReady = true;
    }
  },
  mounted() {
    if (this.defaultNodes && this.defaultNodes.length) {
      this.originalNodes = this.defaultNodes;
    }
    // console.log(this.originalNodes);
    this.init();
  }
};
</script>

<style scoped>
.w-body {
  /*background: linear-gradient(#406fc9, #88a3de);*/
  background: rgba(244, 250, 251, 1);
  width: 100%;
  overflow-y: hidden;
  overflow-x: auto;
}
</style>
