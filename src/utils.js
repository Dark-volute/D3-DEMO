export function createDiv() {
    const div = document.createElement('div');
    document.body.appendChild(div);
    return div;
  }
  
  function createContext(width, height) {
    // 创建画布 svg 节点，并且设置宽高
    const svg = createSVGElement('svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  
    // 创建挂载 g 节点，并且把该 g 节点挂载到 svg 节点上
    const g = createSVGElement('g');
    mount(svg, g);
  
    //返回画布节点和挂载节点
    return {
      node: svg,
      group: g,
    };
  }
  
  function applyTransform(element, transform) {
    const oldTransform = element.getAttribute('transform') || '';
    // 将新的变换指定到后面的变换后，这里需要字符串拼接
    const prefix = oldTransform ? `${oldTransform} ` : '';
    element.setAttribute('transform', `${prefix}${transform}`);
  }
  
  function transform(type, context, ...params) {
    // type 是希望的变换种类：scale，translate，rotate 等
    const { group } = context;
    applyTransform(group, `${type}(${params.join(', ')})`);
  }
  
  function translate(context, tx, ty) {
    transform('translate', context, tx, ty);
  }
  
  function rotate(context, theta) {
    transform('rotate', context, theta);
  }
  
  function scale(context, sx, sy) {
    transform('scale', context, sx, sy);
  }
  
  export function createRenderer(width, height) {
    const context = createContext(width, height); // 创建上下文信息
    return {
      path: (options) => path(context, options),
      line: (options) => line(context, options),
      translate: (...args) => translate(context, ...args),
      scale: (...args) => scale(context, ...args),
      rotate: (args) => rotate(context, args),
      node: () => context.node, // 下面会讲解
      group: () => context.group, // 下面会讲解
    };
  }
  
  
  function shape(type, context, attributes) {
    const { group } = context; // 挂载元素
    const el = createSVGElement(type); // 创建对应的元素
    applyAttributes(el, attributes); // 设置属性
  
    mount(group, el); // 挂载
    return el; // 返回该元素
  
  }
  
   function applyAttributes(element, attributes) {
    for (const [key, value] of Object.entries(attributes)) {
      // 这里需要把类似 strokeWidth 的属性转换成 stroke-width 的形式
      // 思路就是将大写字母替成 - + 对应的小写字母的形式
      // 下面涉及到正则匹配，不太了解的同学可以去下面的链接学习：
      // https://juejin.cn/post/6844903487155732494
      const kebabCaseKey = key.replace(/[A-Z]/g, (d) => `-${d.toLocaleLowerCase()}`);
      element.setAttribute(kebabCaseKey, value);
    }
  }
  
  function line(context, attributes) {
    return shape('line', context, attributes);
  }
  
 // 对 path 不熟悉的同学可以去这里学习
// https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths
// path 的属性 d （路径）是一个字符串，拼接起来比较麻烦，这里我们通过数组去生成
// [
//  ['M', 10, 10],
//  ['L', 100, 100],
//  ['L', 100, 10],
//  ['Z'],
// ];
// 上面的二维数组会被转换成如下的字符串
// 'M 10 10 L 100 100 L 100 10 Z'
function path(context, attributes) {
  const { d } = attributes;
  return shape('path', context, { ...attributes, d: d.flat().join(' ') });
}
  
  // 创建 SVG 元素
  function createSVGElement(type) {
    return document.createElementNS('http://www.w3.org/2000/svg', type);
  }
  
  // 将 child 节点挂载到 parent 节点上面
   export function mount(parent, child) {
    if (parent) {
      parent.appendChild(child);
    }
  }
  