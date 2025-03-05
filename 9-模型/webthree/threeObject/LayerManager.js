class LayerManager {
    constructor() {
      this.layers = new Map(); // 存储层的颜色配置
    }
  
    init(manager) {
      this.manager = manager;
    }
  
    addLayer(name, objects, color) {
      objects.forEach((object) => {
        object.material = new THREE.MeshBasicMaterial({ color });
        this.manager.scene.add(object);
      });
      this.layers.set(name, { objects, color });
    }
  
    toggleLayer(name, visible) {
      if (this.layers.has(name)) {
        const { objects } = this.layers.get(name);
        objects.forEach((object) => {
          object.visible = visible;
        });
      }
    }
  
    dispose() {
      this.layers.forEach(({ objects }) => {
        objects.forEach((object) => {
          this.manager.scene.remove(object);
        });
      });
      this.layers.clear();
    }
  }
  
  export default LayerManager;