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
import {
  getFaultModel,
  getDrillsModel,
  get3DRoadwayModel, 
  get3DFalutsModel
} from "../modelRequset/threeModelRequest";
import LayerControl from "./LayerControl.vue";
import Menu from "./Menu.vue";
import { menuItems as baseMenuItems, menuDefaultValues } from "../configs/menuConfig";
import { handleMenuChange, handleMenuAction } from "./Menu/menuHandlers";
import { toggleLayerVisibility } from "../utils/layerVisibility";
import { getTextureUrl} from '../utils/uvMappingUtils';


export default {
  name: "ThreeScene",
  components: {
    LayerControl,
    Menu,
  },
  setup() {
    const sceneContainer = ref(null);
    const sceneManager = ref(null);

    // 动态菜单项配置
    const menuItems = ref([...baseMenuItems]); // 使用 ref 创建响应式 menuItems
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
console.log(layerOptions)
      menuItems.value = menuItems.value.map((item) => {
        if (item.key === "layerSelect") {
          return { ...item, options: layerOptions }; // 动态更新地层选择选项
        }
        return item;
      });
      console.log(menuItems.value)
    };

    // 监听 layerNames 的变化，并更新 menuItems
    watch(layerNames, updateMenuItems, { deep: true });

    const onLayerToggle = (activeLayers) => {
      console.log('传入的 activeLayers:', JSON.stringify(activeLayers));
      if (!sceneManager.value) {
        console.error("SceneManager is not initialized");
        return;
      }
      toggleLayerVisibility(sceneManager.value, activeLayers, layerNames.value);
    };

    onMounted(() => {
      if (sceneContainer.value) {
        const manager = new SceneManager(sceneContainer.value);
        manager.init();
        sceneManager.value = manager;
 //初始化坐标转换
 const transformer = new CoordinateTransformer({
                                  offsetX: 10,
                                  offsetY: 20,
                                  offsetZ: 30,
                                  scaleX: 0.5,
                                  scaleY: 0.5,
                                  scaleZ: 0.5,
                                });
                                        // transformer. updateOffsets(offsets = { offsetX: 10,
        //                           offsetY: 20,
        //                           offsetZ: 30,})
        //数组数据变换
        const flat3D = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const transformed3D = transformer.transformFlatData(flat3D, 3,false);
        // 地层模型
        getFaultModel()
        .then((processedData) => {
          processedData.forEach((layer, index) => {
            sceneManager.value.addModel({
              type: "triangleMesh",
              data: {
                vertices: layer.vertices,
                indices: layer.indices,
              },
              layer: `FaultLayer_${index}`,
              options: {
                 color: getcolorbylayer(index),
                 scaleFactor: {
                  scaleX:transformer.scaleX,
                  scaleY:transformer.scaleY,
                  scaleZ:transformer.scaleZ,
                 }, // 通用缩放
                 rotationAngle: { 
                   // x: -Math.PI / 2
                  }, // 通用旋转角度
                textureUrl:getTextureUrl(index%5)
               },
            });
            layerNames.value.push(["地层", `FaultLayer_${index}`]);
          });
        });

        // 钻孔模型
        getDrillsModel()
        .then((processedData) => {
          console.debug("钻孔响应数据:", processedData);
          let options = {
                 scaleFactor: {
                  scaleX:transformer.scaleX,
                  scaleY:transformer.scaleY,
                  scaleZ:transformer.scaleZ,
                 }, // 通用缩放
                 rotationAngle: { 
                   // x: -Math.PI / 2
                  }, // 通用旋转角度
               }
          processedData.forEach((drill) => {
            sceneManager.value.renderDrill(drill, getcolorbylayer, {options});
            layerNames.value.push(["钻孔",`${drill.name}`])
          })
          console.log("所有图层已添加:", layerNames.value);
        })
        .catch((error) => {
           console.error("请求或处理数据时发生错误:", error);
         });
         //  get3DFalutsModel()
        //  .then((processedData) => {
        //    console.debug("3DFaluts响应数据:", processedData);

        //      sceneManager.value.addModel({
        //        type: 'triangleMesh',
        //        data: {
        //          vertices: processedData.vertices,
        //          indices: processedData.indices,
        //        },
        //        layer: `Roadway`,
        //        options: {
        //          color: getcolorbylayer(0),
        //          scaleFactor: 1, // 通用缩放
        //          rotationAngle: { 

        //            // x: -Math.PI / 2
        //           }, // 通用旋转角度
        //        },
        //      });
        //      layerNames.value.push(`Roadway`);

        //    console.log("所有图层已添加:", layerNames.value);
        //  })
        //  .catch((error) => {
        //    console.error("请求或处理数据时发生错误:", error);
        //  });

        get3DRoadwayModel()         
         .then((processedData) => {
           console.debug("3DRoadwayModel响应数据:", processedData);

             sceneManager.value.addModel({
               type: 'triangleMesh',
               data: {
                 vertices: processedData.vertices,
                 indices: processedData.indices,
               },
               layer: `Roadway`,
               options: {
                 color: getcolorbylayer(0),
                 scaleFactor: 1, // 通用缩放
                 rotationAngle: { 

                   // x: -Math.PI / 2
                  }, // 通用旋转角度
               },
             });
             layerNames.value.push(["Roadway"]);

          //  console.log("所有图层已添加:", layerNames.value);
          console.log("所有图层已添加:", layerNames.value);

         })
         .catch((error) => {
           console.error("请求或处理数据时发生错误:", error);
         });
        //地层渲染尝试
            fetch("/layer.txt")
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.text();
            })
            .then(text => {
            //   console.log('Loaded text:', text);
              const processedData = processData(text);
              // console.log(processedData);
              processedData.forEach((layer,index)=>{
                const result = sceneManager.value.addModel({
                  type: 'triangleMesh',
                  data: {
                    vertices: layer.vertices,
                    indices:layer.indices, 
                  },
                  layer: `indexedLayer_${index}`,
                  options: {
                    color: getcolorbylayer(index),
                    scaleFactor: 0.005, // 通用缩放
                    rotationAngle:{x: -Math.PI / 2}, // 通用旋转角度
                  },
                });
                // console.log(result);
                // 将图层名称添加到 `layerNames` 中
              // layerNames.value.push(`indexedLayer_${index}`);

              })
              const meshes = sceneManager.value.getMeshesByLayer('indexedLayer_1');
              // console.log('Meshes in meshLayer:', meshes);
              console.log("数据",layerNames.value)
              // loadLayers(processedData,scene)
            })
            .catch(error => {
              console.error('Error loading the text file:', error);
            });
        // 监听窗口大小变化
        window.addEventListener("resize", () => sceneManager.value.onWindowResize());
      }
    });

    onUnmounted(() => {
      if (sceneManager.value) {
        sceneManager.value.dispose();
      }
      window.removeEventListener("resize", () =>
        sceneManager.value.onWindowResize()
      );
    });

    return {
      sceneContainer,
      menuItems,
      menuValues,
      layerNames,
      onMenuChange,
      onMenuAction,
      onLayerToggle,
    };
  },
};
</script>

<style scoped>
div {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
