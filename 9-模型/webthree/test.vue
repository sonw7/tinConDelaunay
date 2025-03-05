<template>
    <div>
      <h1>Pinia 场景状态测试页面</h1>
      <p>当前模式: {{ mode }}</p>
      <button @click="toggleMode">切换模式 (2D / 3D)</button>
  
      <br/><br/>
      
      <p>当前相机位置: X: {{ cameraPosition.x }}, Y: {{ cameraPosition.y }}, Z: {{ cameraPosition.z }}</p>
      <button @click="setCameraPosition(5, 5, 10)">设置相机位置为 X: {{ -cameraPosition.x }}, Y: {{ -cameraPosition.y }}, Z: {{ -cameraPosition.z }}</button>
  
      <br/><br/>
      
      <p>当前是否显示网格: {{ showGrid ? '是' : '否' }}</p>
      <button @click="toggleGrid">切换网格显示</button>
    </div>
  </template>
  
  <script setup>
  import { onMounted, onBeforeUnmount } from 'vue'

  import useSceneStore from '@/store/modules/scene'
  import { storeToRefs } from 'pinia'

  const sceneStore = useSceneStore()
  
  const { mode, cameraPosition, showGrid } = storeToRefs(sceneStore)
  const {toggleMode, setCameraPosition, toggleGrid} = sceneStore
  const handleStorageChange = (event) => {
  if (event.key === 'scene') {
    const updatedData = JSON.parse(event.newValue)
    if (updatedData) {
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
}
onMounted(() => {
  window.addEventListener('storage', handleStorageChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', handleStorageChange)

})
  </script>
  