import mountElement from "./mountElement";
import updateComponent from './updateComponent'

/**
 * 组件diff
 * @param {*} virtualDom 新组件内部的virtualDom
 * @param {*} oldComponent 旧组件实例，可执行组件生命周期，在新/旧组件为同一个组件时，调用render得到最新的virtualDom
 * @param {*} oldDom 组件对应的oldDom
 * @param {*} container 在新旧组件不是同一个组件时，直接插入新组件
 */
export default function diffComponent (virtualDom, oldComponent, oldDom, container) {
  if (isSameComponent(virtualDom, oldComponent)) {
    console.log('同一个组件');
    updateComponent(virtualDom, oldComponent, oldDom, container);
  } else {
    console.log(`不是同一个组件, 或者原来根本就不是组件`);
    mountElement(virtualDom, container, oldDom);
  }
}

/**
 * 判断更新前后是不是属于同一个组件
 * @param {*} virtualDom 
 * @param {*} oldComponent 
 */
function isSameComponent (virtualDom, oldComponent) {
  return oldComponent && virtualDom.type === oldComponent.constructor;
}