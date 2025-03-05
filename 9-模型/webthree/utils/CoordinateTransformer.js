class CoordinateTransformer {
    /**
     * 初始化坐标转换器
     * @param {Object} options 配置选项
     * @param {number} options.offsetX X 轴偏移量
     * @param {number} options.offsetY Y 轴偏移量
     * @param {number} options.offsetZ Z 轴偏移量
     * @param {number} options.scaleX X 轴缩放比例
     * @param {number} options.scaleY Y 轴缩放比例
     * @param {number} options.scaleZ Z 轴缩放比例
     */
    constructor(options = {}) {
      this.offsetX = options.offsetX || 0;
      this.offsetY = options.offsetY || 0;
      this.offsetZ = options.offsetZ || 0;
      this.scaleX = options.scaleX || 1;
      this.scaleY = options.scaleY || 1;
      this.scaleZ = options.scaleZ || 1;
    }
  
    /**
     * 转换单个坐标
     * @param {Object} point 坐标点 { x, y, z }
     * @returns {Object} 转换后的坐标点 { x, y, z }
     */
    transformPoint(point) {
      return {
        x: point.x * this.scaleX + this.offsetX,
        y: point.y * this.scaleY + this.offsetY,
        z: point.z * this.scaleZ + this.offsetZ,
      };
    }
  
    /**
     * 转换多个坐标
     * @param {Array<Object>} points 坐标点数组 [{ x, y, z }, ...]
     * @returns {Array<Object>} 转换后的坐标点数组
     */
    transformPoints(points) {
      return points.map(point => this.transformPoint(point));
    }
  

      /**
   * 转换一维数组的坐标
   * @param {Array<number>} flatData 一维数组，二维每两个数字为一组坐标，三维每三个数字为一组坐标
   * @param {number} dimensions 维度（2 或 3）
   * @param {boolean} applyScale 是否应用缩放，默认 false
   * @returns {Array<number>} 转换后的平面数据数组
   */
  transformFlatData(flatData, dimensions = 3, applyScale = false) {
    if (dimensions !== 2 && dimensions !== 3) {
      throw new Error('Unsupported dimensions. Only 2D or 3D is allowed.');
    }

    const transformed = [];
    for (let i = 0; i < flatData.length; i += dimensions) {
      const x = (applyScale ? flatData[i] * this.scaleX : flatData[i]) + this.offsetX;
      const y = (applyScale ? flatData[i + 1] * this.scaleY : flatData[i + 1]) + this.offsetY;

      if (dimensions === 3) {
        const z = (applyScale ? flatData[i + 2] * this.scaleZ : flatData[i + 2]) + this.offsetZ;
        transformed.push(x, y, z);
      } else {
        transformed.push(x, y);
      }
    }

    return transformed;
  }

    /**
     * 更新偏移量
     * @param {Object} offsets 偏移量 { offsetX, offsetY, offsetZ }
     */
    updateOffsets(offsets = {}) {
      if (offsets.offsetX !== undefined) this.offsetX = offsets.offsetX;
      if (offsets.offsetY !== undefined) this.offsetY = offsets.offsetY;
      if (offsets.offsetZ !== undefined) this.offsetZ = offsets.offsetZ;
    }
  
    /**
     * 更新缩放比例
     * @param {Object} scales 缩放比例 { scaleX, scaleY, scaleZ }
     */
    updateScales(scales = {}) {
      if (scales.scaleX !== undefined) this.scaleX = scales.scaleX;
      if (scales.scaleY !== undefined) this.scaleY = scales.scaleY;
      if (scales.scaleZ !== undefined) this.scaleZ = scales.scaleZ;
    }
  }
  
  export default CoordinateTransformer;
  