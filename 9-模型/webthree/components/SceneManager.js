import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { zuobiaozhou,zbz ,createCompass,createAxes} from '../utils/axesManage'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';
import  {FontLoader}  from 'three/examples/jsm/loaders/FontLoader.js'
import { boxUvCom } from '../utils/uvMappingUtils';
class SceneManager {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.animationId = null;
    this.dataLayers = new Map(); // 存储不同类型和层的数据
    this.loader = new GLTFLoader(); // 用于加载模型文件
 this.orbitControls = null;
    this.firstPersonControls = null;
    this.transformControls = null;
    this.selectedObject = null; // 当前选中的对象
    this.currentControl = 'orbit'; // 当前使用的控制器类型
    this.fontLoader = new FontLoader();
    this.controlParams = {
      orbit: {
        enableDamping: true,
        dampingFactor: 0.1,
      },
      firstPerson: {
        lookSpeed: 0.01,
        movementSpeed: 5,
        noFly: true,
        lookVertical: true,
      },
    };
  }

  // 初始化场景
  init() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xe4dfde);

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // this.camera.position.set(0, 0, 5);
    this.camera.position.set(65, 30, 10)
    this.camera.lookAt(0, 0, 25)
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);
  
    // 初始化控制器
    this._initOrbitControls();
    this._initFirstPersonControls();

    // 默认启用 OrbitControls
    this._useOrbitControls();
    // this._useFirstPersonControls()

    // 添加变换控制器
    this.transformControls = new TransformControls(this.camera, this.renderer.domElement);
    this.transformControls.addEventListener('change', () => this.render());
    // this.scene.add(this.transformControls);
    createAxes(this.scene, this.fontLoader, -50 ,-50,-8,70,30,4);
    createCompass(-80,35,-20,5,0,this.scene, this.fontLoader);//指北针

    // 初始化灯光
    this.initLights();
    // 添加交互事件
    this._addInteraction();
        
    this.animate();
  }

  // 动画循环
  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    // 更新当前控制器
    if (this.currentControl === 'orbit' && this.orbitControls) {
      this.orbitControls.update();
    } else if (this.currentControl === 'firstPerson' && this.firstPersonControls) {
      this.firstPersonControls.update(0.1); // 参数为时间步长，可根据实际调整
    }

    this.renderer.render(this.scene, this.camera);
  }
  initLights() {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0x404040); // 柔和的白光
    this.scene.add(ambientLight);

    // 方向光 1
    const directLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
    directLight1.position.set(100, -150, -100);
    this.scene.add(directLight1);

    // 方向光 2
    const directLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directLight2.position.set(200, -10, 90);
    this.scene.add(directLight2);

    // 点光源
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(-13, 150, 10);
    this.scene.add(pointLight);
  }
 // 初始化 OrbitControls
  _initOrbitControls() {
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbitControls.enableDamping = this.controlParams.orbit.enableDamping;
    this.orbitControls.dampingFactor = this.controlParams.orbit.dampingFactor;
  }
  // 初始化 FirstPersonControls
  _initFirstPersonControls() {
    this.firstPersonControls = new FirstPersonControls(this.camera, this.renderer.domElement);
    this.firstPersonControls.lookSpeed = this.controlParams.firstPerson.lookSpeed;
    this.firstPersonControls.movementSpeed = this.controlParams.firstPerson.movementSpeed;
    this.firstPersonControls.noFly = this.controlParams.firstPerson.noFly;
    this.firstPersonControls.lookVertical = this.controlParams.firstPerson.lookVertical;
  }
// 切换控制器
switchControl(controlType) {
  if (controlType === 'orbit') {
    this._useOrbitControls();
  } else if (controlType === 'firstPerson') {
    this._useFirstPersonControls();
  } else {
    console.warn('Unsupported control type:', controlType);
  }
}

// 启用 OrbitControls
_useOrbitControls() {
  this.currentControl = 'orbit';
  this.firstPersonControls.enabled = false;
  this.orbitControls.enabled = true;
}

// 启用 FirstPersonControls
_useFirstPersonControls() {
  this.currentControl = 'firstPerson';
  this.orbitControls.enabled = false;
  this.firstPersonControls.enabled = true;
}
 // 更新控制器参数
 updateControlParams(controlType, params) {
  if (controlType === 'orbit' && this.orbitControls) {
    Object.assign(this.controlParams.orbit, params);
    this.orbitControls.enableDamping = this.controlParams.orbit.enableDamping;
    this.orbitControls.dampingFactor = this.controlParams.orbit.dampingFactor;
  } else if (controlType === 'firstPerson' && this.firstPersonControls) {
    Object.assign(this.controlParams.firstPerson, params);
    this.firstPersonControls.lookSpeed = this.controlParams.firstPerson.lookSpeed;
    this.firstPersonControls.movementSpeed = this.controlParams.firstPerson.movementSpeed;
    this.firstPersonControls.noFly = this.controlParams.firstPerson.noFly;
    this.firstPersonControls.lookVertical = this.controlParams.firstPerson.lookVertical;
  } else {
    console.warn('Unsupported control type or invalid parameters:', controlType, params);
  }
}
 // 添加交互事件
 _addInteraction() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    this.container.addEventListener('click', (event) => {
      const rect = this.container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, this.camera);
      const intersects = raycaster.intersectObjects(
        Array.from(this.dataLayers.values()).flat()
      );

      if (intersects.length > 0) {
        this.selectedObject = intersects[0].object;

        console.log(this.selectedObject)
        // 将选中对象附加到变换控制器
        this.transformControls.attach(this.selectedObject);
      } else {
        // 如果没有选中，清除变换控制器
        this.transformControls.detach();
        this.selectedObject = null;
      }

      this.render();
    });
  }

  // 添加数据
  addModel({ type, data, layer = 'default', options = {} }) {
    let object;

    switch (type) {
      case 'points': // 点数据
        object = this._createPointCloud(data, options);
        break;

      case 'indices': // 索引数据
        object = this._createIndexedMesh(data, options);
        break;

      case 'model': // 模型文件
        this._loadModel(data, layer, options);
        return;

      case 'custom': // 自定义渲染
        object = options.renderFunction?.(data, THREE);
        break;
       case 'triangleMesh': // 三角面数据
         object = this._createTriangleMesh(data, options);
         break;
      default:
        console.warn('Unsupported data type:', type);
        return;
    }
    if (object) {
      
      // 添加对象到场景并分层管理
      this._addToLayer(layer, object);
      return { layer, object }; // 返回图层名和对象
    }
    return null;
  }

  // 移除数据
  removeData(layer) {
    if (this.dataLayers.has(layer)) {
      const objects = this.dataLayers.get(layer);
      objects.forEach((obj) => {
        this.scene.remove(obj);

        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      });
      this.dataLayers.delete(layer);
    }
  }
  render() {
    this.renderer.render(this.scene, this.camera);
  }
    /**
   * 根据图层名称获取所有 Mesh 对象
   * @param {string} layer 图层名称
   * @returns {Array<THREE.Object3D>} 图层中的所有对象
   */
    getMeshesByLayer(layer) {
      if (this.dataLayers.has(layer)) {
        return this.dataLayers.get(layer);
      } else {
        console.warn(`Layer "${layer}" does not exist.`);
        return [];
      }
    }
  
// 创建三角面网格
_createTriangleMesh({ vertices, indices, index = 1 }, options = {}) {
  // console.log(options)
  const geometry = new THREE.BufferGeometry();
  // 设置顶点位置
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  // 设置索引
  geometry.setIndex(indices);
  // 计算法向量（生成 `normal` 属性）
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();

  // 创建材质
    const material = new THREE.MeshBasicMaterial({
      color: options.color || 0xffffff, // 默认白色
      side: THREE.DoubleSide, // 双面渲染
    });
    const mesh = new THREE.Mesh(geometry, material);

  
  // 应用缩放
  const scaleFactor = options.scaleFactor || 0.1; // 默认不缩放
  mesh.scale.set(scaleFactor.scaleX||1, scaleFactor.scaleY||1, scaleFactor.scaleZ||1);

  // 应用旋转
  const rotationAngle = options.rotationAngle || {x:0,y:0,z:0}; // 默认无旋转
  mesh.rotation.set(rotationAngle.x||0, rotationAngle.y||0,rotationAngle.z|| 0);

  // 设置渲染顺序
  mesh.renderOrder = 100 - index;
  if(options.textureUrl){
    this.addTexture(mesh,options.textureUrl)
  }
    // scene.add(mesh);
    return mesh
  }

  //更新贴图
  replaceTexture(mesh, textureUrl) {
    const textureLoader = new THREE.TextureLoader();
  
    // 加载新贴图
    textureLoader.load(textureUrl, (texture) => {
      if (mesh.material.map) {
        mesh.material.map.dispose(); // 释放旧贴图
      }
      mesh.material.map = texture; // 应用新贴图
      mesh.material.needsUpdate = true; // 确保更新材质
    });
  }
  
  // 更新数据
  updateData(layer, newData, options = {}) {
    this.removeData(layer);
    this.addModel({ type: options.type, data: newData, layer, options });
  }

  // 创建点云
  _createPointCloud(points, { color = 0x00ff00, size = 0.1 }) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));

    const material = new THREE.PointsMaterial({ color, size });
    return new THREE.Points(geometry, material);
  }

  // 创建索引数据
  _createIndexedMesh({ vertices, indices,index=0 }, { color = 0xffffff }) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    geometry.setIndex(indices);

    const material = new THREE.MeshBasicMaterial({
      color,
      wireframe: true,
    });
    const mesh = new THREE.Mesh(geometry, material);

    const scaleFactor = 0.005; // 缩小为原始大小的 10%
    mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);

    // 设置旋转
    const rotationAngle = Math.PI / 2; // 旋转 45 度
    mesh.rotation.set(rotationAngle, 0, 0);

    mesh.renderOrder = 100 - index;

    // scene.add(mesh);
    return mesh
    // return new THREE.Mesh(geometry, material);
  }

  // 加载模型
  // 加载模型（异步支持贴图）
  _loadModel(url, layer, { scale = 1, position = { x: 0, y: 0, z: 0 } }) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (gltf) => {
          const model = gltf.scene;

          // 设置模型的缩放比例
          model.scale.set(scale, scale, scale);

          // 设置模型的位置
          model.position.set(position.x, position.y, position.z);

          // 如果模型包含贴图，自动更新贴图
          model.traverse((child) => {
            if (child.isMesh && child.material.map) {
              child.material.map.needsUpdate = true;
            }
          });

          this._addToLayer(layer, model);
          resolve({ layer, object: model }); // 返回图层名和模型对象
        },
        undefined,
        (error) => {
          console.error('Error loading model with texture:', error);
          reject(error);
        }
      );
    });
  }


  // 添加对象到指定层
  _addToLayer(layer, object) {
    if (!this.dataLayers.has(layer)) {
      this.dataLayers.set(layer, []);
    }
    this.dataLayers.get(layer).push(object);
    this.scene.add(object);
  }
  //渲染钻孔
  renderDrill(drill, colorFunction,options) {
    console.log("渲染的钻孔数据",drill)
    const { name="unkown", zkx, zky, xyz } = drill; // 解构钻孔数据
    const drillMeshes = new THREE.Group();; // 存储每段钻孔的几何体 
    const scaleFactor = options.scaleFactor || {}; // 默认不缩放
    // 遍历深度数组，渲染每一段钻孔
    for (let i = 0; i < xyz.length - 1; i++) {
      const depth1 = xyz[i]*0.01;
      const depth2 = xyz[i + 1]*0.01;
  
      // 跳过无效或零深度差的段
      if (depth1 === 99.99 || depth2 === 99.99 || depth1 === depth2) {
        continue;
      }
  
      // 计算段的长度和中点位置
      const segmentLength = Math.abs(depth2 - depth1);
      const segmentCenter = (depth1 + depth2) / 2;
  
      // 创建圆柱体几何体
      const geometry = new THREE.CylinderGeometry(1, 1, segmentLength, 32);
  
      // 设置材质颜色
      const material = new THREE.MeshBasicMaterial({
        color: colorFunction(i), // 动态颜色（基于层级）
      });
  
      // 创建网格
      const cylinder = new THREE.Mesh(geometry, material);
      // cylinder.scale.set(scaleFactor.scaleX||1, scaleFactor.scaleY||1, scaleFactor.scaleZ||1);

      // 设置圆柱体的位置
      // cylinder.position.set(zkx, segmentCenter, zky);
      cylinder.position.set(10, segmentCenter, 10);
  
      // 设置初始可见性（如果需要）
      // cylinder.visible = false;
  
      // 添加到场景
      // this.scene.add(cylinder);
  
      // 存储到数组中
      drillMeshes.add(cylinder);
    }
    if (drillMeshes) {
      // 添加对象到场景并分层管理
      this._addToLayer(name, drillMeshes);
      return { name, drillMeshes }; // 返回图层名和对象
    }
    // 返回所有生成的网格（便于后续控制）
    return drillMeshes;
  }
  addTexture(mesh, textureUrl) {
    const textureLoader = new THREE.TextureLoader();
  
    // 加载新贴图
    textureLoader.load(textureUrl, (texture) => {
      // 如果需要计算 UV
      if (boxUvCom && typeof boxUvCom === "function") {
        // 获取顶点位置和法向量
        const positionAttribute = mesh.geometry.getAttribute('position');
        const normalAttribute = mesh.geometry.getAttribute('normal');
  
        if (!positionAttribute || !normalAttribute) {
          console.error("无法计算 UV：缺少 position 或 normal 属性");
          return;
        }
  
        // 计算 UV
        const boundingBox = mesh.geometry.boundingBox || mesh.geometry.computeBoundingBox();
        const uvArray = boxUvCom(
          positionAttribute, 
          normalAttribute, 
          boundingBox.max, 
          boundingBox.min
        );

        // 添加 UV 属性
        if (uvArray) {
          // console.log('添加uv信息')
          // console.log(uvArray)

          mesh.geometry.setAttribute(
            'uv',
            new THREE.BufferAttribute(uvArray, 2)
          );
        }
      }
  
      // 替换纹理
      if (mesh.material.map) {
        mesh.material.map.dispose(); // 释放旧贴图
      }
      mesh.material.map = texture; // 应用新贴图
      mesh.material.needsUpdate = true; // 确保更新材质
  
      // 可选：设置纹理属性
      texture.repeat.set(20,20)
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      // texture.anisotropy = mesh.material.map.anisotropy || 16; // 启用各向异性过滤
    });
  }
  
  // 处理窗口大小变化
  onWindowResize() {
    if (this.camera && this.renderer) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  // 清理资源
  dispose() {
    cancelAnimationFrame(this.animationId);

    this.renderer.dispose();
    this.dataLayers.forEach((objects) => {
      objects.forEach((obj) => {
        this.scene.remove(obj);
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      });
    });
    this.dataLayers.clear();

    if (this.orbitControls) this.orbitControls.dispose();
    if (this.firstPersonControls) this.firstPersonControls.dispose();
    if (this.transformControls) this.transformControls.dispose();

    this.scene = null;
    this.camera = null;
    this.renderer = null;
  }
}

export default SceneManager;