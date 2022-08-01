import isFunction from "./isFunction";

/**
 * 区分函数组件/类组件（函数原型上是否有render方法）
 * @param {*} virtualDom 
 */
export default function isFunctionComponent (virtualDom) {
  const type = virtualDom.type;
  // 函数原型上是否有render方法
  return type && isFunction(virtualDom) && !(type.prototype && type.prototype.render)
}