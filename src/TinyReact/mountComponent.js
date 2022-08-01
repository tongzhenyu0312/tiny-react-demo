import isFunction from './isFunction';
import isFunctionComponent from './isFunctionComponent'
import mountElement from './mountElement';
import mountNativeElement from './mountNativeElement';

/**
 * 将组件生成对应的dom挂载到指定的dom容器内
 * @param {*} virtualDom 
 * @param {*} container 
 */
export default function mountComponent (virtualDom, container, oldDom) {
  let nextVirtualDom = null;
  let component = null;
  // 组件又分为类组件和函数组件
  if (isFunctionComponent(virtualDom)) {
    // 处理函数组件
    nextVirtualDom = buildFunctionComponent(virtualDom)
  } else {
    // 处理类组件
    nextVirtualDom = buildClassComponent(virtualDom)
    component = nextVirtualDom.component
  }

  // 组件内部的virtualDom也可能是一个React组件
  // 下面的操作好像等同于
  // mountElement(nextVirtualDom, container);
  // 但是视频里不是这样的
  if (isFunction(nextVirtualDom)) {
    // 当前的组件内部得到依然是React组件
    mountComponent(nextVirtualDom, container, oldDom)
  } else {
    // 组件内部是普通的React元素
    mountNativeElement(nextVirtualDom, container, oldDom)
  }

  if (component) {
    if (component.props?.ref) {
      component.props.ref(component)
    }
    component.componentDidMount()
  }
}

/**
 * 获取函数组件内部的virtualDom
 * @param {*} virtualDom 
 * @returns 
 */
function buildFunctionComponent (virtualDom) {
  return virtualDom.type(virtualDom.props || {});
}

/**
 * 获取类组件内部的virtualDom
 * @param {*} virtualDom 
 */
function buildClassComponent (virtualDom) {
  // 通过new得到类的实例，实例化传递props，使通过父类方法
  const component = new virtualDom.type(virtualDom.props || {})
  // 通过实例.render方法得到virtualDom
  const nextVirtualDom = component.render();
  // 将组件的实例对象挂载到nextVirtualDom上，以便于创建真实dom时，能够获取到组件实例
  nextVirtualDom.component = component;
  return nextVirtualDom;
}
