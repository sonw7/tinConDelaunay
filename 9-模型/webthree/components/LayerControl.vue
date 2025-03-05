<template>
  <div class="layer-control">
    <el-tree
      ref="treeRef"
      :data="treeData"
      :props="treeProps"
      show-checkbox
      node-key="id"
      :default-checked-keys="defaultCheckedKeys"
      @check-change="onLayerToggle"
    >
      <template #default="{ node, data }">
        <span class="custom-tree-node">{{ data.label }}</span>
      </template>
    </el-tree>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';

const props = defineProps({
  layerList: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(['layer-toggle']);
const treeRef = ref(null); // 获取 el-tree 实例
const treeData = ref([]);
const defaultCheckedKeys = ref([]);
const treeProps = {
  children: 'children',
  label: 'label',
};
function generateTree(data) {
  const tree = {}; 
  let id = 0;
  data.forEach(([parent, child]) => {
    if (!tree[parent]) {
      // 如果父节点不存在，初始化
      tree[parent] = {
        id: `${id}`,
        label: parent,
        children: [],
      };
      id++;
    }
    // 添加子节点
    if(child){
      tree[parent].children.push({
      id: `${tree[parent].id}-${tree[parent].children.length}`,
      label: child,
    });
    }
  });
  let layerTree = Object.values(tree)
  //默认全选
  let keys = getLeafNodeKeys(layerTree);
  console.debug(keys)
  defaultCheckedKeys.value = keys
  // 返回最终的树形结构数组
  return layerTree;
}
function getLeafNodeKeys(tree) {
  const leafKeys = [];
  // 递归遍历树


  function traverse(node) {
    if (!node.children || node.children.length === 0) {
      // 如果没有子节点，则为叶子节点
      leafKeys.push(node.id);
    } else {
      // 否则递归遍历子节点
      node.children.forEach((child) => traverse(child));
    }
  }

  // 遍历树的根节点
  tree.forEach((root) => traverse(root));

  return leafKeys;
}
//----------
// 监听 layerList
watch(
  () => props.layerList,
  (newLayers) => {
    // treeData.value = initTreeData(newLayers);
    treeData.value = generateTree(newLayers);

    // console.debug("tree数据",generateTree(newLayers))
    // console.debug("tree数据",newLayers)
    // console.debug('默认选中的节点 ID:', defaultCheckedKeys.value);
  },
  { immediate: true }
);

// 处理选中状态变化，只返回叶子节点的 label
const onLayerToggle = () => {
  // 获取所有选中的节点 ID
  const checkedKeys = treeRef.value.getCheckedKeys(true); // 包括半选节点
  // console.log('选中的节点 ID:', checkedKeys);

  // 获取选中的叶子节点的 label
  const selectedLabels = [];
  const findLeafLabels = (nodes) => {
    nodes.forEach((node) => {
      if (!node.children || node.children.length === 0) {
        // 如果是叶子节点，提取 label
        if (checkedKeys.includes(node.id)) {
          selectedLabels.push(node.label);
        }
      } else if (node.children) {
        // 如果有子节点，递归查找
        findLeafLabels(node.children);

      }
    });
  };

  findLeafLabels(treeData.value);
  // console.log('选中的叶子节点标签:', selectedLabels);
  emit('layer-toggle', selectedLabels); // 将叶子节点的 label 返回给父组件
};
</script>

<style scoped>
.layer-control {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: rgba(255, 255, 255, 0.3);
  padding: 15px;
  border-radius: 8px;
  z-index: 10;
  max-width: 250px;
  overflow: auto;
  max-height: 80%;
}

.custom-tree-node {
  font-size: 14px;
  cursor: pointer;
}
</style>
