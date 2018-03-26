import {commonVariable} from 'api/config';
export function setUserGuid(val){
  commonVariable.userGuid = val;
}
export function getUserGuid(){
  return commonVariable.userGuid;
}
export function setProductGuid(val){
  commonVariable.productGuid = val;
}
export function getProductGuid(){
  return commonVariable.productGuid;
}
export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
  return reg.test(el.className);
}
export function addClass(el, className) {
  if (hasClass(el, className)) {
    return;
  }
  let newClass = el.className.split(' ');
  newClass.push(className);
  el.className = newClass.join(' ');
}

export function getData(el, name, val) {
  const prefix = 'data-';
  const attributeName = prefix + name;
  if (val) {
    return el.setAttribute(attributeName, val);
  }
  return el.getAttribute(attributeName);
}

export var globalVariable = {
  originWidth: 37.5
}
