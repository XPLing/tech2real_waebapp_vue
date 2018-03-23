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
