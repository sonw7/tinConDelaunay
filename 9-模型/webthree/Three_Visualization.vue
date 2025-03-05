 <template>
    <div id="three-container" ref="threeContainer" class="three-container">
    <div class="overlay">
      <h1>Three.js Visualization Test</h1>
      <p>这是一个用于测试 Three.js 的页面</p>
    </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import { scene_init, scene, camera, controls } from './utils/scene_init'

  import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial'
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry'
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2'
import { Line2 } from 'three/examples/jsm/lines/Line2'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

  const threeContainer = ref(null)
  
  onMounted(() => {
    if (threeContainer.value) {
      scene_init(threeContainer.value) // 初始化 Three.js 场景
    }
  })
  </script>
  
  <style scoped>
  .three-container {
    width: 100%;
    height: 100vh;
    position: relative;
  }
  /* 固定文案样式 */
.overlay {
  position: fixed; /* 固定在视口上方 */
  top: 10px;
  left: 10px;
  color: white;
  background: rgba(0, 0, 0, 0.5); /* 半透明背景，确保文字清晰 */
  padding: 10px;
  border-radius: 5px;
  z-index: 10; /* 确保在最上层 */
}

.overlay h1 {
  font-size: 20px;
  margin: 0;
}

.overlay p {
  font-size: 14px;
  margin: 5px 0 0;
}
  </style>
  