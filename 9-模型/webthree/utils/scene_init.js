// src/utils/scene_init.js

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import  {FontLoader}  from 'three/examples/jsm/loaders/FontLoader.js'
let scene, camera, renderer, controls,viewHelper
import { zuobiaozhou,zbz } from './axes'
import {loadTxtFile} from './meshInit'
import { ViewHelper } from '../view_util/ViewHelper'
export function scene_init(container) {
  // 初始化场景
  scene = new THREE.Scene()
  const loader = new FontLoader();
  // 初始化相机
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(65, 30, 10)
  camera.lookAt(0, 0, 25)

  // 初始化渲染器
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.appendChild(renderer.domElement)

  // 初始化控制器
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.25
  controls.enableZoom = true
  controls.target.set(0, 0, 10); // 替换 x, y, z 为你需要的目标点坐标

  zuobiaozhou(scene, loader, -50 ,-50,-8,70,30,4);
  zbz(-80,35,-20,5,0,scene, loader);
  loadTxtFile(scene, '/layer.txt');

  // 添加灯光
  const light = new THREE.AmbientLight(0x404040)
  scene.add(light)
  let directLight = new THREE.DirectionalLight(0xffffff,0.5);

        directLight.position.x=100;
        directLight.position.y= -150;
        directLight.position.z= -100;
        scene.add(directLight);

       let directLight1 = new THREE.DirectionalLight(0xffffff,0.5);

        directLight1.position.x=200;
        directLight1.position.y= -10;
        directLight1.position.z= 90;
        scene.add(directLight1);

        let plight = new THREE.PointLight(0xffffff,1);
        plight.position.set(-13, 150, 10);
        scene.add(plight);

        viewHelper = new ViewHelper(camera, renderer.domElement);
        // scene.add(viewHelper);
        // viewHelper.setLabels('X', 'Y', 'Z Label');

  // 窗口大小调整处理
  window.addEventListener('resize', onWindowResize)
  
  animate()
  renderer.domElement.addEventListener('pointerdown', (event) => {
    if (viewHelper.handleClick(event)) {
      console.log('ViewHelper clicked');
    }
  });
}

// 动画渲染函数
function animate() {
  requestAnimationFrame(animate)
  controls.update()

  renderer.render(scene, camera)
  // viewHelper.render(renderer);

}

// 窗口大小调整函数
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
 function setCameraPosition(x, y, z) {
    if (camera) {
      camera.position.set(x, y, z)
      camera.lookAt(scene.position)
    }
  }
  
// 导出全局变量供其他模块使用
export { scene, camera, controls, renderer ,setCameraPosition}
