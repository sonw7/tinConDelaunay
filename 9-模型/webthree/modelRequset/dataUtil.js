export function processDrillVertices(drillVertices, drillName = "Drill1") {
    const xyz = []; // 存储深度数据
  
    // 遍历 drillVertices 提取数据
    drillVertices.forEach((vertex) => {
      const z = vertex.z || vertex.altitude; // 提取 Z 坐标或 altitude
      if (z !== 99.99) { // 过滤无效数据
        xyz.push(z);
      }
    });
  
    // 获取钻孔的 X 和 Y 坐标（这里假设取第一个点的 geodeticEastCoor 和 geodeticNorthCoor）
    const zkx = drillVertices[0].geodeticEastCoor || drillVertices[0].x || 0;
    const zky = drillVertices[0].geodeticNorthCoor || drillVertices[0].y || 0;
  
    // 生成 drill 对象
    const drill = {
      name: drillName, // 钻孔名称
      zkx: zkx, // X 坐标
      zky: zky, // Y 坐标
      xyz: xyz, // 深度数据
    };
  
    return drill;
  }
  export function processMultipleDrills(drillVerticesList) {
    console.debug(drillVerticesList)
    return drillVerticesList.map((drillVertices, index) => {
        console.debug("???",drillVertices)
      return processDrillVertices(drillVertices.drillVertices, `Drill${index + 1}`);
    });
  }