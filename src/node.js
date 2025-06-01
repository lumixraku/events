import { Event, globalEventManager } from './event-system';

// 移除动态导入index.js的代码

export class Node {
  constructor(x, y, width, height) {
    this.x = x;           // 左上角坐标
    this.y = y;
    this.width = width;
    this.height = height;

    this.scaleX = 1;
    this.scaleY = 1;
    this.rotation = 0;    // 度数，顺时针

    this.parent = null;
    this.children = [];
  }

  addChild(child) {
    child.parent = this;
    this.children.push(child);
  }

  on(type, callback) {
    globalEventManager.addEventListener(this, type, callback);
  }

  trigger(type, data) {
    const event = new Event(type, this, data);
    globalEventManager.dispatchEvent(event);
  }

  // 获取矩形的几何中心点
  getCenterX() {
    return this.x + this.width / 2;
  }

  getCenterY() {
    return this.y + this.height / 2;
  }

  // 碰撞检测
  contains(canvasX, canvasY) {
    // 考虑父节点的缩放
    let worldX = canvasX;
    let worldY = canvasY;

    if (this.parent && (this.parent.scaleX !== 1 || this.parent.scaleY !== 1)) {
      worldX = canvasX / this.parent.scaleX;
      worldY = canvasY / this.parent.scaleY;
    }

    // 计算相对于矩形中心的坐标
    const centerX = this.getCenterX();
    const centerY = this.getCenterY();
    const dx = worldX - centerX;
    const dy = worldY - centerY;

    // 应用反向旋转变换
    const radians = -this.rotation * Math.PI / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const rotatedX = dx * cos - dy * sin;
    const rotatedY = dx * sin + dy * cos;

    // 转换为本地坐标
    const localX = rotatedX + this.width / 2;
    const localY = rotatedY + this.height / 2;

    // 检查是否在矩形范围内
    return localX >= 0 && localX <= this.width && 
           localY >= 0 && localY <= this.height;
  }

  // 获取准确的本地坐标
  getLocalPoint(canvasX, canvasY) {
    // 考虑父节点缩放
    let worldX = canvasX;
    let worldY = canvasY;

    if (this.parent && (this.parent.scaleX !== 1 || this.parent.scaleY !== 1)) {
      worldX = canvasX / this.parent.scaleX;
      worldY = canvasY / this.parent.scaleY;
    }

    const centerX = this.getCenterX();
    const centerY = this.getCenterY();
    const dx = worldX - centerX;
    const dy = worldY - centerY;

    const radians = -this.rotation * Math.PI / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const rotatedX = dx * cos - dy * sin;
    const rotatedY = dx * sin + dy * cos;

    const localX = rotatedX + this.width / 2;
    const localY = rotatedY + this.height / 2;

    return { x: localX, y: localY };
  }
}