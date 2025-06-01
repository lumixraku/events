import Konva from 'konva';
import { Event, EventManager, globalEventManager } from './event-system';
import { Node } from './node'; // 可以保留，因为这是单向依赖

// 移除const globalEventManager = new EventManager();这行

// 初始化 Konva 舞台
const stage = new Konva.Stage({
  container: 'container',
  width: 800,
  height: 600,
});
stage.scale({ x: 2, y: 2 }); // 整个舞台放大2倍

const layer = new Konva.Layer();
stage.add(layer);

// 创建根节点
const rootNode = new Node(0, 0, 400, 300);
rootNode.scaleX = 2;
rootNode.scaleY = 2;

// 创建矩形节点
const rect = new Node(100, 100, 100, 100);
rect.on('click', (event) => {
  console.log('✅ 矩形被点击了!');
  console.log('全局坐标:', event.data.global);
  console.log('本地坐标:', event.data.local);
  rotateRect();
});
rootNode.addChild(rect);

// 用 Konva 绘制矩形
const konvaRect = new Konva.Rect({
  x: rect.x,
  y: rect.y,
  width: rect.width,
  height: rect.height,
  fill: 'red',
  stroke: 'black',
  strokeWidth: 1,
  draggable: false,
  offsetX: rect.width / 2,
  offsetY: rect.height / 2,
});

// 将 Konva 矩形的位置设置为几何中心
konvaRect.x(rect.getCenterX());
konvaRect.y(rect.getCenterY());

layer.add(konvaRect);

// 添加一个参考点显示矩形中心
const centerDot = new Konva.Circle({
  x: rect.getCenterX(),
  y: rect.getCenterY(),
  radius: 3,
  fill: 'blue'
});
layer.add(centerDot);

// 更新显示
function updateDisplay() {
  konvaRect.rotation(rect.rotation);
  document.getElementById('rotationDisplay').textContent = `当前旋转: ${rect.rotation}°`;
  layer.batchDraw();
}

// 旋转矩形按钮
function rotateRect() {
  rect.rotation = (rect.rotation + 15) % 360;
  updateDisplay();
}

// DOM 事件监听
document.getElementById('rotateButton').addEventListener('click', rotateRect);

const container = document.getElementById('container');
container.addEventListener('click', (e) => {
  const { offsetX, offsetY } = e;
  console.log(`\n🖱️ 点击画布: (${offsetX}, ${offsetY})`);

  // 碰撞检测
  const targetNode = rootNode.children.find((child) => child.contains(offsetX, offsetY));
  if (targetNode) {
    const localPoint = targetNode.getLocalPoint(offsetX, offsetY);
    targetNode.trigger('click', {
      global: { x: offsetX, y: offsetY },
      local: localPoint,
    });
  } else {
    console.log('❌ 没有点击到任何节点');
  }
});

// 初始渲染
updateDisplay();

// 导出全局事件管理器供其他模块使用
export { globalEventManager };