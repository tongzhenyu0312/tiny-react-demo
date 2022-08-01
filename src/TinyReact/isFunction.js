export default function isFunction (virtualDom) {
  return virtualDom && typeof virtualDom.type === 'function';
}