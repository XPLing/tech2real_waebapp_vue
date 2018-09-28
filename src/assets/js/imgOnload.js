/**
 * @param singerLoadFn: 每个img加载完成后的回调
 * @param allLoadFn: 当全部img加载完成后的回调
 *
 * */
export function imgOnload (imgs, vm, flag, singerLoadFn, allLoadFn) {
  var loaded = [], promiseArr = [];
  for (var i = 0, len = imgs.length; i < len; i++) {
    var img = imgs[i], src = img.src;
    var imgObj = new Image();
    var me = vm;
    if (!src || src === window.location.href) {
      continue;
    }
    promiseArr.push(new Promise(function (resolve, reject) {
      (function (i, imgObj, img) {
        imgObj.onload = function () {
          // singerLoadFn && singerLoadFn();
          // if (i === len - 1) {
          //   me[flag] = true;
          //   allLoadFn && allLoadFn();
          // }
          loaded.push(i);
          imgObj = null;
          resolve(img);
        };
        imgObj.onerror = function () {
          loaded.push(i);
          imgObj = null;
          reject(img);
        };
        imgObj.src = src;
      })(i, imgObj, img);
    }));
  }
  return promiseArr;
}
