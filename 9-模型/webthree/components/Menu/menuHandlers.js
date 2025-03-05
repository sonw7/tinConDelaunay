export function handleMenuChange({ key, value }, sceneManager) {
    console.log(`菜单项 ${key} 值变更为:`, value);
  
    if (key === "controlType") {
      sceneManager.switchControl(value);
    } else if (key === "moveSpeed" || key === "lookSpeed") {
      sceneManager.updateControlParams("firstPerson", {
        [key === "moveSpeed" ? "movementSpeed" : "lookSpeed"]: value,
      });
    }
  }
  
  export function handleMenuAction(key, sceneManager) {
    console.log(`触发菜单动作:`, key);
  
    if (key === "resetCamera") {
      sceneManager.resetCamera();
    }
  }
  