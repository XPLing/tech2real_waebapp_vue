/**
 * Created by XPL on 2017/6/11.
 */
;(function (win, doc) {
  'user strict';
  var common = {
    initial: function () {
      // window.outerWidth  在ios中为0，所以改为screen.width
      var windowW = parseInt(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
      windowW = windowW > 768 ? 768 : windowW;
      document.getElementsByTagName('html')[0].style.fontSize = windowW / 10 + 'px';
    }
  };
  common.initial();
}(window, document));


