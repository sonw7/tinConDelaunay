<template>
  <div id="three-scene" ref="sceneContainer" class="scene-container">
    <div class="controls">
      <h1 style="font-size: small;">Pinia 场景状态测试页面</h1>
      <p>当前模式: {{ mode }}</p>
      <button @click="toggleMode">切换模式 (2D / 3D)</button>

      <p>当前相机位置: X: {{ cameraPosition.x }}, Y: {{ cameraPosition.y }}, Z: {{ cameraPosition.z }}</p>
      <button @click="setCameraPosition(0, 0, 0)">设置相机位置为 X: {{ -cameraPosition.x }}, Y: {{ -cameraPosition.y }}, Z: {{ -cameraPosition.z }}</button>

      <p>当前是否显示网格: {{ showGrid ? '是' : '否' }}</p>
      <button @click="toggleGrid">切换网格显示</button>
    </div>
  </div>
</template>

<script setup>
import * as THREE from 'three'
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useSceneStore } from '@/store/modules/scene'
import { storeToRefs } from 'pinia'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const sceneContainer = ref(null)

const sceneStore = useSceneStore()
const { cameraPosition, mode, showGrid } = storeToRefs(sceneStore) 
const {toggleMode, setCameraPosition, toggleGrid} = sceneStore

watchEffect(() => {
  console.log('模式:', sceneStore.mode)
  console.log('相机位置:', sceneStore.cameraPosition)
  console.log('网格显示:', sceneStore.showGrid)
})
let scene, camera, renderer, cube,cube1, raycaster, mouse, controls
const handleStorageChange = (event) => {
  if (event.key === 'scene') {
    const updatedData = JSON.parse(event.newValue)

    if (updatedData.mode) {
      sceneStore.mode = updatedData.mode
    }
    if (updatedData.cameraPosition) {
      sceneStore.cameraPosition = updatedData.cameraPosition
    }
    if (updatedData.showGrid !== undefined) {
      sceneStore.showGrid = updatedData.showGrid
    }
  }
}
// const initScene = () => {
//   scene = new THREE.Scene()

//   camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
//   camera.position.set(cameraPosition.value.x, cameraPosition.value.y, cameraPosition.value.z)

//   renderer = new THREE.WebGLRenderer()
//   renderer.setSize(window.innerWidth, window.innerHeight)
//   sceneContainer.value.appendChild(renderer.domElement)

//   const geometry = new THREE.BoxGeometry()
//   const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
//   cube = new THREE.Mesh(geometry, material)
//   scene.add(cube)

//   const light = new THREE.AmbientLight(0x404040)
//   scene.add(light)
  
//   window.addEventListener('resize', onWindowResize, false)

//   animate()
// }
const initScene = () => {
  scene = new THREE.Scene()

  // 初始化相机位置并指向物体
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(cameraPosition.value.x, cameraPosition.value.y, cameraPosition.value.z)
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  sceneContainer.value.appendChild(renderer.domElement)

  // 创建一个物体并放置在场景的原点
  const geometry = new THREE.BoxGeometry()
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  cube = new THREE.Mesh(geometry, material)
  cube.position.set(0, 0, 0)
  scene.add(cube)

  const geometry1 = new THREE.BoxGeometry()
  const material1 = new THREE.MeshBasicMaterial({ color: 0xff0000 })
  cube1 = new THREE.Mesh(geometry1, material1)
  cube1.position.set(10, 0, 0)
  scene.add(cube1)

  const light = new THREE.AmbientLight(0x404040)
  scene.add(light)
  
  // 初始化射线和鼠标向量
  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()

  // 初始化轨道控制器
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true // 阻尼效果
  controls.dampingFactor = 0.25
  controls.enableZoom = true

  window.addEventListener('resize', onWindowResize, false)
  window.addEventListener('click', onMouseClick, false) // 监听鼠标点击

  animate()
}



const animate = () => {
  requestAnimationFrame(animate)
  // cube.rotation.x += 0.01
  // cube.rotation.y += 0.01
  controls.update() // 更新轨道控制器
  renderer.render(scene, camera)
}

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
const onMouseClick = (event) => {
  // 将鼠标点击位置转换为归一化设备坐标 (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

  // 通过摄像机和鼠标位置更新射线
  raycaster.setFromCamera(mouse, camera)

  // 计算物体和射线的交点
  const intersects = raycaster.intersectObjects(scene.children)
  
  if (intersects.length > 0) {
    console.log('点击了物体:', intersects[0].object)
    intersects[0].object.material.color.set(0x0000ff) // 点击后将物体变为蓝色
  }
}
watch(
  cameraPosition,
  (newPosition) => {
    console.log('cameraPosition 变化:', newPosition)
    if (newPosition) {
      if (camera) { // 确保 camera 已初始化
      camera.position.set(newPosition.x, newPosition.y, newPosition.z)
    }
      // camera.position.set(newPosition.x, newPosition.y, newPosition.z)
    }
  },
  { deep: true, immediate: true }
)

// 监听 mode 的变化
watch(
  mode,
  (newMode,oldvalue) => {
    console.log(`场景模式切换为：${newMode}ssss${oldvalue}`)
    // 可以根据模式的变化进行更多处理，比如切换渲染内容
  },
  { immediate: true }
)

// 监听 showGrid 的变化
watch(
  showGrid,
  (gridState) => {
    console.log(`网格显示状态：${gridState ? '显示' : '隐藏'}`)
    // if (gridState) {
    //   const gridHelper = new THREE.GridHelper(10, 10)
    //   gridHelper.name = 'GridHelper' // 给网格命名以便查找
    //   scene.add(gridHelper)
    // } else {
    //   const gridHelper = scene.getObjectByName('GridHelper')
    //   if (gridHelper) {
    //     scene.remove(gridHelper)
    //   }
    // }
  },
  { immediate: true }
)

onMounted(() => {
  console.log("挂载了")
  window.addEventListener('storage', handleStorageChange)

  initScene()
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', handleStorageChange)

  window.removeEventListener('resize', onWindowResize)
  window.removeEventListener('click', onMouseClick)

  if (renderer) {
    renderer.dispose()
  }
})
</script>


<style scoped>
.scene-container {
  position: relative; /* 设置父容器为相对定位 */
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.controls {
  position: absolute; /* 使按钮浮在 three-scene 上方 */
  top: 10px;
  left: 10px;
  background: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 5px;
  z-index: 10;
}

button {
  margin: 5px 0;
}
</style>
