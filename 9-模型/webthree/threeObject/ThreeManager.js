import * as THREE from 'three';

class ThreeManager {
    constructor(container) {
        console.log(container)
      if (!container) {
        throw new Error('Container element is required for ThreeManager.');
      }
  
      this.container = container;
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);
  
      this.camera.position.set(0, 0, 5);
      this.scene.background = new THREE.Color(0x000000); // 黑色背景
      const light = new THREE.AmbientLight(0xffffff, 0.8);
      this.scene.add(light);
      console.log('??')
    }
  
    render() {
      requestAnimationFrame(() => this.render());
      this.renderer.render(this.scene, this.camera);
    }
  
    dispose() {
      this.renderer.dispose();
      this.scene = null;
      this.camera = null;
      this.renderer = null;
    }
  }
  
  export default ThreeManager;