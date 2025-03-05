import * as THREE from 'three';

class RaycasterModule {
  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.intersectedObjects = [];
  }

  init(manager) {
    this.manager = manager;

    // 添加鼠标事件监听
    manager.container.addEventListener('click', this.onMouseClick.bind(this));
  }

  onMouseClick(event) {
    const rect = this.manager.container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.manager.camera);

    // 检测射线交点
    const intersects = this.raycaster.intersectObjects(
      this.manager.scene.children,
      true
    );
    if (intersects.length > 0) {
      console.log('Picked object:', intersects[0].object);
      this.intersectedObjects = intersects;
    } else {
      this.intersectedObjects = [];
    }
  }

  dispose() {
    this.manager.container.removeEventListener(
      'click',
      this.onMouseClick.bind(this)
    );
  }
}

export default RaycasterModule;