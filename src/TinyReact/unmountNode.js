/**
 * 删除某个dom节点
 * @param {*} node
 */
export default function unmountNode(node) {
  // 获取节点的virtualDom
  const virtualDom = node._virtualDom;

  // 根据virtualDom不同类型，作不同处理
  if (virtualDom.type === 'text') {
    // 文本节点可以直接删除
    node.remove();
    return;
  }

  if (virtualDom.component) {
    // 组件生成的节点
    virtualDom.component.componentWillUnmount();
  }

  // 处理ref
  if (virtualDom.props?.ref) {
    virtualDom.props.ref(null);
  }

  // 卸载事件
  Object.keys(virtualDom.props).forEach((propName) => {
    if (propName.slice(0, 2) === 'on') {
      // 事件属性
      const eventName = propName.toLowerCase().slice(2)
      const eventHandler = virtualDom.props[propName];
      node.removeEventListener(eventName, eventHandler);
    }
  });

  // 递归删除子节点
  if (node.children.length > 0) {
    for (let i = 0; i < node.children.length; i++) {
      unmountNode(node.children[i]);
      i--;
    }
  }

  // 删除节点
  node.remove();
}
