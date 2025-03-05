import request from '@/utils/request'
import { processDrillVertices,processMultipleDrills} from './dataUtil.JS';
// 查询断层模型数据
// export function getFaultModel(data) {
//   // (async () => {
//   //   try {
//   //     const url = 'http://localhost:9305/test';
//   //     const result = await fetchData(url);
//   //     console.log('请求结果:', result);
//   //   } catch (error) {
//   //     console.error('捕获到错误:', error.message);
//   //   }
//   // })();
  
//   return request({
//     url: '/geomodelling/get_3D_layers', // 修改为实际的接口路径
//     method: 'get',
//     // params: data // 如果需要传递查询参数
//   })
// }
///get_3D_roadway 巷道数据
export async function get3DRoadwayModel(data) {
  try {
    const response = await request({
      url: '/geomodelling/get_3D_roadway', // 修改为实际的接口路径
      method: 'post',
      params: data, // 如果需要传递查询参数
    });
    console.debug("get_3D_roadway请求的数据",response)

    return response; // 解析后的数据
  } catch (error) {
    console.error('请求失败:', error.message);
    throw error; // 如果需要，继续抛出错误
  }
}
//三维地层TIN模型数组数据
export async function getFaultModel(data) {
  try {
    const response = await request({
      url: '/geomodelling/get_3D_layers', // 修改为实际的接口路径
      method: 'post',
      params: data, // 如果需要传递查询参数
    });
    console.debug("get_3D_layers请求的数据",response)
    return response; // 解析后的数据
  } catch (error) {
    console.error('请求失败:', error.message);
    throw error; // 如果需要，继续抛出错误
  }
}
//get_3D_faluts
export async function get3DFalutsModel(data) {
  try {
    const response = await request({
      url: '/geomodelling/get_3D_faluts', // 修改为实际的接口路径
      method: 'post',
      params: data, // 如果需要传递查询参数
    });
    console.debug("/get_3D_faluts请求的数据",response)

    return response; // 解析后的数据
  } catch (error) {
    console.error('请求失败:', error.message);
    throw error; // 如果需要，继续抛出错误
  }
}
//钻孔数据
export async function getDrillsModel(data) {
  try {
    const response = await request({
      url: '/geomodelling//wgl_load_3D_drills', // 修改为实际的接口路径
      method: 'post',
      params: data, // 如果需要传递查询参数
    });
    console.debug("请求的数据",response)

    const drill = processMultipleDrills(response);
console.debug("处理钻孔数据",drill);
    return drill; // 解析后的数据
  } catch (error) {
    console.error('请求失败:', error.message);
    throw error; // 如果需要，继续抛出错误
  }
}


// 查询巷道（2D/3D）数据
export function getTunnelModel(data, is3D = false) {
  return request({
    url: is3D 
      ? '/postgresql/get_tunnel_model_3d' 
      : '/postgresql/get_tunnel_model_2d', // 修改为实际的接口路径
    method: 'post',
    params: data
  })
}

// 查询注浆钻孔数据
export function getGroutingBorehole(data) {
  return request({
    url: '/postgresql/get_grouting_borehole', // 修改为实际的接口路径
    method: 'post',
    params: data
  })
}

// 查询微震数据（点集）
export function getMicroSeismicPoints(data) {
  return request({
    url: '/postgresql/get_micro_seismic_points', // 修改为实际的接口路径
    method: 'post',
    params: data
  })
}

// 查询采空区数据（面）
export function getGoafModel(data) {
  return request({
    url: '/postgresql/get_goaf_model', // 修改为实际的接口路径
    method: 'post',
    params: data
  })
}

// 查询勘探线数据（面 + 贴图）
export function getExplorationLines(data) {
  return request({
    url: '/postgresql/get_exploration_lines', // 修改为实际的接口路径
    method: 'post',
    params: data
  })
}
/**
 * 封装的 fetch 请求函数
 * @param {string} url - 请求的接口地址
 * @param {object} options - fetch 配置选项 (method, headers, body等)
 * @returns {Promise<any>} - 返回一个 Promise，解析后是接口返回的数据
 */
async function fetchData(url, options = {}) {
  try {
    const response = await fetch(url, {
      method: 'GET', // 默认 GET 请求
      headers: {
        'Content-Type': 'application/json', // 默认 JSON 格式
        ...(options.headers || {}), // 合并自定义 headers
      },
      ...options, // 允许覆盖其他配置
    });

    if (!response.ok) {
      throw new Error(`HTTP 错误! 状态码: ${response.status}`);
    }

    const data = await response.json(); // 解析返回的 JSON 数据
    return data;
  } catch (error) {
    console.error('请求失败:', error.message);
    throw error;
  }
}
