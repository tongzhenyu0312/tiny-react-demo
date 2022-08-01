import diff from './diff'

/**
 * 实现将虚拟Dom渲染到页面上指定位置
 * @param {Object} virtualDom 虚拟Dom对象
 * @param {*} container Dom容器
 */
export default function render (virtualDom, container) {
  diff(virtualDom, container, container?.firstChild);
}