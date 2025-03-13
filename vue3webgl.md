





隔水层2  9 

隔水层3 9#煤

第一层到5#煤

```
<!-- src/components/ThreeScene.vue -->
<template>
  <div ref="sceneContainer">
    <!-- 通用扩展菜单 -->
    <Menu
      title="场景控制"
      :items="menuItems"
      :values="menuValues"
      @change="onMenuChange"
      @action="onMenuAction"
    />
    <!-- 图层控制面板 -->
    <LayerControl
      v-if="layerNames.length > 0"
      :layerList="layerNames"
      @layer-toggle="onLayerToggle"
    />
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref, reactive, watch } from "vue";
import SceneManager from "./SceneManager";
import { processData } from '../utils/dataUtils';
import { getcolorbylayer } from '../utils/getMeshColor';
import CoordinateTransformer from '../utils/CoordinateTransformer';
import roadmodeltest from "../staticModel/RoadwayModel";
import * as THREE from 'three';

// import {
//   getFaultModel,
//   getDrillsModel,
//   get3DRoadwayModel, 
//   get3DFalutsModel
// } from "../modelRequset/threeModelRequest";
import LayerControl from "./LayerControl.vue";
import Menu from "./Menu.vue";
import { menuItems as baseMenuItems, menuDefaultValues } from "../configs/menuConfig";
import { handleMenuChange, handleMenuAction } from "./Menu/menuHandlers";
import { toggleLayerVisibility } from "../utils/layerVisibility";
import { getTextureUrl } from '../utils/uvMappingUtils';
import { loadAndRenderDrills } from "../staticModel/DrillModel";
import { getLayerName } from '../view_util/layerUtils';
export default {
  name: "ThreeScene",
  components: {
    LayerControl,
    Menu,
  },
  setup() {
    const sceneContainer = ref(null);
    const sceneManager = ref(null);
    const sceneTransformer = ref(null);
    const globalOffset = ref({ x: 0, y: 0, z: 0 });
    const modelCentered = ref(false);

    // 动态菜单项配置
    const menuItems = ref([...baseMenuItems]);
    const menuValues = reactive({ ...menuDefaultValues });
    const onMenuChange = (event) => handleMenuChange(event, sceneManager.value);
    const onMenuAction = (key) => handleMenuAction(key, sceneManager.value);

    // 存储所有图层的名称
    const layerNames = ref([]);

    // 动态生成地层选择的选项
    const updateMenuItems = () => {
      const layerOptions = layerNames.value.map(([group, name]) => ({
        label: `${group} - ${name}`,
        value: name,
      }));
      menuItems.value = menuItems.value.map((item) => {
        if (item.key === "layerSelect") {
          return { ...item, options: layerOptions };
        }
        return item;
      });
    };

    // 监听 layerNames 的变化，并更新 menuItems
    watch(layerNames, updateMenuItems, { deep: true });

    const onLayerToggle = (activeLayers) => {
      if (!sceneManager.value) {
        console.error("SceneManager is not initialized");
        return;
      }
      toggleLayerVisibility(sceneManager.value, activeLayers, layerNames.value);
    };

    // 计算模型包围盒并居中
    const centerModelAndUpdateTransformer = (layer) => {
      if (!sceneManager.value || !sceneTransformer.value) return;
      
      const meshes = sceneManager.value.getMeshesByLayer(layer);
      if (!meshes || meshes.length === 0) return;
      
      // 创建临时组以计算整体包围盒
      const group = new THREE.Group();
      meshes.forEach(mesh => {
        // 确保每个网格有正确的包围盒
        if (mesh.geometry && !mesh.geometry.boundingBox) {
          mesh.geometry.computeBoundingBox();
        }
        group.add(mesh.clone());
      });
      
      // 计算整体包围盒
      const boundingBox = new THREE.Box3().setFromObject(group);
      const center = new THREE.Vector3();
      boundingBox.getCenter(center);
      
      console.log(`Layer ${layer} bounding box:`, boundingBox);
      console.log(`Layer ${layer} center:`, center);
      
      // 计算需要的偏移量使模型居中
      const offset = {
        x: -center.x,
        y: -center.y,
        z: -center.z
      };
      
      // 更新全局偏移量
      globalOffset.value = offset;
      
      // 更新坐标转换器
      sceneTransformer.value.updateParams({
        offset: offset
      });
      
      // 应用偏移到已加载的模型
      meshes.forEach(mesh => {
        mesh.position.set(
          mesh.position.x + offset.x,
          mesh.position.y + offset.y,
          mesh.position.z + offset.z
        );
      });
      
      // 标记模型已居中
      modelCentered.value = true;
      
      console.log(`Applied offset to center model: `, offset);
      
      return offset;
    };

    // 添加模型并应用全局偏移
// 添加模型并应用全局偏移
// 修改 ThreeScene.vue
// 修改 ThreeScene.vue 中的 onMounted 方法
onMounted(() => {
  if (sceneContainer.value) {
    const manager = new SceneManager(sceneContainer.value);
    manager.init();
    sceneManager.value = manager;

    // 初始化坐标转换器
    const transformer = new CoordinateTransformer({
      offset: {
        x: 0,
        y: 0,
        z: 0
      },
      scale: {
        x: 1,
        y: 1,
        z: 1
      },
      rotation: {
        x: -Math.PI / 2,
        y: 0,
        z: -Math.PI/2
      }
    });
    
    sceneTransformer.value = transformer;

    // 本地加载巷道模型
    roadmodeltest(sceneManager.value, layerNames.value);

    // 首先加载并处理地层数据
    fetch("/layer.txt")
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then(text => {
        const processedData = processData(text);
        console.log("地层数量", processedData.length);
        console.log("地层数据", processedData);
        
        // 添加第一个图层
        if (processedData.length > 0) {
          const firstLayerName = getLayerName(0);
          
          // 添加第一个图层
          sceneManager.value.addModel({
            type: "triangleMesh",
            data: {
              vertices: processedData[0].vertices,
              indices: processedData[0].indices,
            },
            layer: firstLayerName,
            options: {
              color: getcolorbylayer(0),
              scaleFactor: transformer.scale.x,
              rotationAngle: { x: transformer.rotation.x, z: transformer.rotation.z },
              position: { x: 0, y: 0, z: 0 },
              textureUrl: getTextureUrl(0),
              textureRepeat: 50
            },
          });
          
          layerNames.value.push(["地层", firstLayerName]);
          
          // 计算包围盒并获取偏移量
          const offset = centerModelAndUpdateTransformer(firstLayerName);
          
          // 使用计算出的偏移量更新transformer
          transformer.updateParams({
            offset: offset
          });
          
          console.log("Updated transformer with offset:", offset);
          console.log("Current transformer params:", transformer.getParams());
          
          // 添加其余图层，应用相同的偏移
          for (let i = 1; i < processedData.length; i++) {
            if(i==17){
              continue;
            }
            const layerName = getLayerName(i);
            
            // 使用更新后的transformer应用到新模型
            sceneManager.value.addModel({
              type: "triangleMesh",
              data: {
                vertices: processedData[i].vertices,
                indices: processedData[i].indices,
              },
              layer: layerName,
              options: {
                color: getcolorbylayer(i),
                scaleFactor: transformer.scale.x,
                rotationAngle: { x: transformer.rotation.x, z: transformer.rotation.z },
                position: transformer.offset,
                textureUrl: getTextureUrl(i),
                textureRepeat: 100
              },
            });
            
            layerNames.value.push(["地层", layerName]);
          }
          
          // 重要：在所有地层加载完成后，再加载钻孔数据
          console.log("开始加载钻孔，使用的偏移量:", transformer.offset);
          loadAndRenderDrills(sceneManager.value, transformer, layerNames.value);
          
          // 在地层处理完成后，再加载断层数据
          // 这样可以确保使用正确的偏移量
          return fetch("/fault.txt");
        }
        
        return Promise.reject("No layer data found");
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then(text => {
        const processedData = processData(text);
        console.log("断层数量", processedData.length);
        console.log("断层数据", processedData);
        console.log("加载断层使用的偏移量:", sceneTransformer.value.offset);
        
        // 添加断层图层，使用已更新的偏移量
        if (processedData.length > 0) {
          for (let i = 0; i < processedData.length; i++) {
            const layerName = `Fault_${i}`;
            
            // 使用更新后的transformer应用到新模型
            sceneManager.value.addModel({
              type: "triangleMesh",
              data: {
                vertices: processedData[i].vertices,
                indices: processedData[i].indices,
              },
              layer: layerName,
              options: {
                color: "#ec6a5d",
                scaleFactor: sceneTransformer.value.scale.x,
                rotationAngle: { 
                  x: sceneTransformer.value.rotation.x, 
                  z: sceneTransformer.value.rotation.z
                },
                position: {
                  x: sceneTransformer.value.offset.x*0.388,
                  y: sceneTransformer.value.offset.y,
                  z: sceneTransformer.value.offset.z*1.745
                },
              },
            });
            
            layerNames.value.push(["断层", layerName]);
          }
        }
      })
      .catch(error => {
        console.error("Error loading and processing data:", error);
      });

    // 监听窗口大小变化，更新画布尺寸
    const resizeHandler = () => {
      if (sceneManager.value && sceneContainer.value) {
        sceneManager.value.onWindowResize(
          sceneContainer.value.clientWidth,
          sceneContainer.value.clientHeight
        );
      }
    };
    window.addEventListener("resize", resizeHandler);
  }
});
    onUnmounted(() => {
      if (sceneManager.value) {
        sceneManager.value.dispose();
      }
      window.removeEventListener("resize", () => sceneManager.value.onWindowResize());
    });

    return {
      sceneContainer,
      menuItems,
      menuValues,
      layerNames,
      onMenuChange,
      onMenuAction,
      onLayerToggle,
      // 暴露给模板使用的方法
      centerModelAndUpdateTransformer
    };
  },
};
</script>

<style scoped>
/* 将容器设置为 100vw 和 100vh，确保画布自适应屏幕宽高 */
div {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>

我现在有个需求。支持在导入的layer地层中，选择两个，然后计算层间距，由A地层的所有点在垂直方向增加分分量构造一个点入（x,y,z）(x,y,z+1),用该射线B地层所有三角面进行求交，如果有则求点到交点距离并保存。定义一个间距和color到mapping，启用顶点着色。并支持重置原有地层
```

