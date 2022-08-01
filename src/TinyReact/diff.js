import createDomElement from './createDomElement';
import mountElement from './mountElement';
import updateNodeElement from './updateNodeElement';
import updateTextNode from './updateTextNode';
import unmountNode from './unmountNode';
import diffComponent from './diffComponent';
import mountNativeElement from './mountNativeElement';

/**
 * 比对新旧Dom，实现将虚拟Dom渲染到页面上指定位置(最小化Dom更新)
 * @param {Object} virtualDom 虚拟Dom对象
 * @param {*} container Dom容器
 * @param {Object} oldDom 旧的Dom
 */
export default function diff(virtualDom, container, oldDom) {
  const oldVirtualDom = oldDom?._virtualDom;

  // 根据oldDom，决定是直接渲染还是更新
  if (!oldDom) {
    // 如果不存在oldDom的话，那就生成真实Dom，并添加到指定位置
    mountElement(virtualDom, container);
  } else if (
    virtualDom.type !== oldVirtualDom.type &&
    typeof virtualDom.type !== 'function'
  ) {
    // 节点类型不一致（节点并非是组件）
    // 当节点类型不一致时，使用新的dom对象替换旧的dom对象即可
    const newElement = createDomElement(virtualDom);
    oldDom.parentNode.replaceChild(newElement, oldDom);
  } else if (typeof virtualDom.type === 'function') {
    const oldComponent = oldVirtualDom?.component;
    // 组件更新
    diffComponent(virtualDom, oldComponent, oldDom, container);
  } else if (oldVirtualDom && virtualDom.type === oldVirtualDom.type) {
    // 节点类型一致
    // 对于一个节点来说，不同的类型有不同的方法
    if (virtualDom.type === 'text') {
      // 文本节点更新内容
      updateTextNode(virtualDom, oldVirtualDom, oldDom);
    } else {
      // 元素节点更新属性
      updateNodeElement(oldDom, virtualDom, oldVirtualDom);
    }

    // 1.将拥有key属性的子dom对象元素，放在一个数组里
    const keyedElements = {};
    for (let i = 0; i < oldDom.childNodes.length; i++) {
      const domElement = oldDom.childNodes[i];
      if (domElement.nodeType === 1) {
        const key = domElement.getAttribute('key');
        if (key) {
          keyedElements[key] = domElement;
        }
      }
    }

    let hasNoKey = Object.entries(keyedElements).length === 0;
    if (hasNoKey) {
      // 对于子节点也要遍历diff
      virtualDom.children.forEach((child, i) => {
        // 暂时通过索引确定传入子diff的oldDom
        diff(child, oldDom, oldDom.childNodes[i]);
      });
    } else {
      // 2.循环virtualDom，获取children的key属性，查找dom元素
      virtualDom.children.forEach((child, i) => {
        let key = child.props.key;
        if (key) {
          const domElement = keyedElements[key];
          // 3.查看元素是不是期望元素(判断位置是否正确)
          if (domElement) {
            if (oldDom.childNodes[i] && oldDom.childNodes[i] !== domElement) {
              oldDom.insertBefore(domElement, oldDom.childNodes[i]);
            }
          } else {
            // 说明dom元素是新增
            mountNativeElement(child, oldDom, oldDom.childNodes[i]);
          }
        }
      });
    }

    // 删除节点发生在同级同类型的节点(在节点更新之后)
    const oldChildNodes = oldDom.childNodes;
    if (oldChildNodes.length > virtualDom.children.length) {
      // 旧dom节点大于新节点的数量，代表需要删除
      if (hasNoKey) {
        // 原来没有写key
        for (
          let i = oldChildNodes.length - 1;
          i > virtualDom.children.length - 1;
          i--
        ) {
          unmountNode(oldChildNodes[i]);
        }
      } else {
        // 通过key的方式删除元素
        for (let i = 0; i < oldChildNodes.length; i++) {
          const oldChild = oldChildNodes[i];
          const oldChildKey = oldChild._virtualDom.props.key;
          let found = false;
          for (let n = 0; n < virtualDom.children.length; n++) {
            if (oldChildKey === virtualDom.children[n].props.key) {
              found = true;
              break;
            }
          }
          if (!found) {
            unmountNode(oldChild);
          }
        }
      }
    }
  }
}
