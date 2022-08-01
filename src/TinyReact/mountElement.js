import mountNativeElement from './mountNativeElement';
import isFunction from './isFunction'
import mountComponent from './mountComponent'

/**
 * 将virtualDom转换为真实Dom，添加到指定位置
 * @param {*} virtualDom 
 * @param {*} container 
 * @param {*} oldDom
 */
export default function mountElement (virtualDom, container, oldDom) {
  // virtualDom有两种（普通的virtualDom和组件virtualDom（函数/类））
  if (isFunction(virtualDom)) {
    // 组件
    mountComponent(virtualDom, container, oldDom)
  } else {
    // React元素
    mountNativeElement(virtualDom, container, oldDom)
  }
}