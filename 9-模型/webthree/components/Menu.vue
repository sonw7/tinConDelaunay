<template>
    <div class="menu" :class="{ collapsed: isCollapsed }">
      <div class="menu-header">
        <h3 v-if="!isCollapsed">{{ title }}</h3>
        <button class="toggle-button" @click="toggleMenu">
          {{ isCollapsed ? '展开菜单' : '收缩菜单' }}
        </button>
      </div>
      <div v-if="!isCollapsed" class="menu-content">
        <div v-for="(item, index) in items" :key="index" class="menu-item">
          <!-- 下拉框 -->
          <div v-if="item.type === 'select'">
            <label :for="'menu-item-' + index">{{ item.label }}</label>
            <select
              :id="'menu-item-' + index"
              v-model="localValues[item.key]"
              @change="emitChange(item.key)"
            >
              <option
                v-for="(option, idx) in item.options"
                :key="idx"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
  
          <!-- 按钮 -->
          <button
            v-else-if="item.type === 'button'"
            @click="emitAction(item.key)"
          >
            {{ item.label }}
          </button>
  
          <!-- 开关 -->
          <div v-else-if="item.type === 'switch'">
            <label :for="'menu-item-' + index">
              <input
                type="checkbox"
                :id="'menu-item-' + index"
                v-model="localValues[item.key]"
                @change="emitChange(item.key)"
              />
              {{ item.label }}
            </label>
          </div>
  
          <!-- 滑块 -->
          <div v-else-if="item.type === 'slider'">
            <label :for="'menu-item-' + index">{{ item.label }}</label>
            <input
              type="range"
              :id="'menu-item-' + index"
              v-model.number="localValues[item.key]"
              :min="item.min"
              :max="item.max"
              :step="item.step"
              @input="emitChange(item.key)"
            />
            <span>{{ localValues[item.key].toFixed(item.decimal || 1) }}</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Menu",
    props: {
      title: {
        type: String,
        default: "",
      },
      items: {
        type: Array,
        required: true,
      },
      values: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        isCollapsed: false, // 菜单是否收缩
        localValues: { ...this.values }, // 本地存储菜单的初始值
      };
    },
    methods: {
      // 切换菜单的展开/收缩状态
      toggleMenu() {
        this.isCollapsed = !this.isCollapsed;
      },
      // 触发父组件的 change 事件
      emitChange(key) {
        this.$emit("change", { key, value: this.localValues[key] });
      },
      // 触发父组件的 action 事件
      emitAction(key) {
        this.$emit("action", key);
      },
    },
  };
  </script>
  
  <style scoped>
  /* 主菜单容器 */
  .menu {
    position: absolute;
    top: 10px;
    left: 10px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(245, 245, 245, 0.2));
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    width: 220px; /* 默认宽度 */
    transition: all 0.3s ease;
    font-family: 'Arial', sans-serif;
    font-size: 14px;
    color: #333;
  }
  
  .menu.collapsed {
    width: 50px; /* 收缩时宽度 */
    height: 50px; /* 收缩时高度 */
    overflow: hidden;
    display: flex;
    justify-content: center; /* 居中内容 */
    align-items: center;
    background: rgba(255, 255, 255, 0.9);
  }
  
  /* 菜单头部 */
  .menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .menu-header h3 {
    font-size: 16px;
    font-weight: bold;
    color: #007bff;
  }
  
  .menu-content {
    margin-top: 10px;
  }
  
  /* 菜单项通用样式 */
  .menu-item {
    margin-bottom: 10px;
  }
  
  .menu-item label {
    display: block;
    font-size: 13px;
    font-weight: bold;
    color: #555;
    margin-bottom: 5px;
  }
  
  /* 滑块样式 */
  .menu-item input[type="range"] {
    width: calc(100% - 10px);
    margin: 5px auto;
    display: block;
  }
  
  /* 按钮样式 */
  .toggle-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 5px 12px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.2s ease;
  }
  
  .toggle-button:hover {
    background-color: #0056b3;
  }
  
  .toggle-button:active {
    transform: scale(0.98); /* 按下时缩放效果 */
  }
  
  /* 收缩状态下的按钮样式 */
  .menu.collapsed .toggle-button {
    padding: 0;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    font-size: 12px;
    background-color: #007bff;
    color: white;
  }
  
  .menu.collapsed .toggle-button:hover {
    background-color: #0056b3;
    text-decoration: none;
  }
  </style>
  
  