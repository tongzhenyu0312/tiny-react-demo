/**
 * 更新文本dom的内容，并更新到原dom上
 * @param {*} virtualDom 
 * @param {*} oldVirtualDom 
 * @param {*} oldDom 
 */
export default function updateTextNode (virtualDom, oldVirtualDom, oldDom) {
  // 文本节点内容变化时，更新文本dom内容
  if (virtualDom.props.textContent !== oldVirtualDom.props.textContent) {
    oldDom.textContent = virtualDom.props.textContent;
  }

  // 除了更新dom内容，还需要更新dom绑定的virtualDom
  oldDom._virtualDom = virtualDom;
}