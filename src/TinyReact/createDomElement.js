import mountElement from './mountElement';
import updateNodeElement from './updateNodeElement';

/**
 * 创建Dom对象
 * @param {*} virtualDom
 */
export default function createDomElement(virtualDom) {
  let newElement = null;
  
  // 当前的节点，需要区分是否为元素节点/文本节点，他们对应的创建方法是不一样的
  if (virtualDom.type === 'text') {
    // 文本节点
    // 文本节点不需要添加属性
    newElement = document.createTextNode(virtualDom.props.textContent);
  } else {
    // 元素节点
    newElement = document.createElement(virtualDom.type);
    // 创建完Dom元素，为Dom元素添加属性，属性存储在virtualDom.props中
    // 只有普通元素需要添加属性
    updateNodeElement(newElement, virtualDom);
  }

  // 创建dom元素时，通过在真实Dom上添加virtualDom，作为将来diff时获取可用的oldVirtualDom
  newElement._virtualDom = virtualDom;

  // 遍历子节点，插入到对应的父容器中
  virtualDom.children && virtualDom.children.forEach((child) => {
    // 子virtualDom并不一定是普通的virtualDom，所以使用mountElement，而非mountNativeElement
    mountElement(child, newElement);
  });

  // 创建完dom元素后，若存在ref属性，需要执行这个回调，并将元素传递
  if (virtualDom?.props?.ref) {
    virtualDom?.props?.ref(newElement)
  }

  return newElement;
}
