import diff from "./diff";

/**
 * 同一个组件进行更新 
 * @param {*} virtualDom 
 * @param {*} oldComponent 
 * @param {*} oldDom 
 * @param {*} container 
 */
export default function updateComponent (virtualDom, oldComponent, oldDom, container) {
  // 生命周期
  oldComponent.componentWillReceiveProps(virtualDom.props);
  // 生命周期
  if (oldComponent.shouldComponentUpdate(virtualDom.props)) {
    // 生命周期
    oldComponent.componentWillUpdate(virtualDom.props);
    // 更新组件实例的props
    oldComponent.updateProps(virtualDom.props);
    // 获取最新的组件内部的virtualDom
    const nextVirtualDom = oldComponent.render();
    // 新的virtualDom上绑定的组件实例
    nextVirtualDom.component = oldComponent;
    // diff
    diff(nextVirtualDom, container, oldDom);
    // 未更新前的props
    const prevProps = oldComponent.props;
    // 生命周期
    oldComponent.componentDidUpdate(prevProps);
  }
}