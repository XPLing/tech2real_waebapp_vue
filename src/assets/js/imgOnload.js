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

export function imgOnloadSingle (img) {
  let imgObj = new Image();
  imgObj.setAttribute('crossOrigin', 'Anonymous');
  return new Promise((resolve, reject) => {
    imgObj.onload = function () {
      let imgInfo = {
        width: imgObj.width,
        height: imgObj.height,
        img: imgObj
      };
      imgObj = null;
      resolve(imgInfo);
    };
    imgObj.onerror = function () {
      let imgInfo = {
        width: null,
        height: null,
        img: imgObj
      };
      imgObj = null;
      reject(imgInfo);
    };
    imgObj.src = img;
  });
}
export function changeImgRatio (imgObj, imgBox) {
  let frame = document.createDocumentFragment(), c = document.createElement('canvas'), w = imgObj.width,
    h = imgObj.height, ratio = w / h;
  frame.appendChild(c);

  let x = imgObj.width / 2, y = imgObj.height / 2, xR, yR, realW, realH, boxRatio;
  realW = imgBox.width;
  realH = imgBox.height;
  boxRatio = realW / realH;

  c.width = realW;
  c.height = realH;
  let ctx = c.getContext('2d');
  let sX, sY, clipW, clipH;

  if (ratio > boxRatio) {
    // 高度过小
    clipH = h;
    clipW = clipH * boxRatio;
    xR = clipW / 2;
    sX = Math.max(0, x - xR);
    sY = 0;
  } else if (ratio < boxRatio) {
    // 高度过大
    clipW = w;
    clipH = clipW / boxRatio;
    yR = clipH / 2;
    sY = Math.max(0, y - yR);
    sX = 0;
  } else {
    // 比例正好
    return false;
  }
  ctx.drawImage(imgObj.img, sX, sY, clipW, clipH, 0, 0, realW, realH);
  let imgSrc = c.toDataURL('image/jpeg');
  return imgSrc;
}
