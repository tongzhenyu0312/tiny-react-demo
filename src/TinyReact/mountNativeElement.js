import mountElement from "./mountElement";
import createDomElement from './createDomElement'
import unmountNode from "./unmountNode";

/**
 * 将普通的virtualDom（React元素）转换为真实Dom，并添加到指定位置
 * @param {*} virtualDom 
 * @param {*} container 
 * @param {*} oldDom 
 */
export default function mountNativeElement (virtualDom, container, oldDom) {
  let newElement = null;
  // 为virtualDom创建真实Dom
  newElement = createDomElement(virtualDom);

  // oldDom存在，就插入在oldDom前面
  if (oldDom) {
    container.insertBefore(newElement, oldDom)
  } else {
    // 插入到元素的指定位置
    container.appendChild(newElement);
  }

  if (oldDom) {
    unmountNode(oldDom);
  }

  const component = virtualDom?.component;
  // 类组件内部的virtualDom才有component
  if (component) {
    component.setDom(newElement);
  }

}