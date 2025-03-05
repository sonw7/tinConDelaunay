export function toggleLayerVisibility(sceneManager, activeLayers, layerNames) {
  let validLayers = extractLeafNodes(layerNames)
  // console.log(sceneManager, activeLayers, validLayers)

  validLayers.forEach((layerName) => {
      const meshes = sceneManager.getMeshesByLayer(layerName);
      meshes.forEach((mesh) => {
        mesh.visible = activeLayers.includes(layerName);
      });
    });
  }
  //layerNames最子节点扁平化
  function extractLeafNodes(data) {
    const leafNodes = [];
  
    // 遍历数据
    data.forEach(item => {
      if (item.length!= 0) {
        // 如果数组有两个元素，则第二个元素为叶子节点
        leafNodes.push(item[item.length-1]);
      }
    });
  
    return leafNodes;
  }
  