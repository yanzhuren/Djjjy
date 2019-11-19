var gui = require('nw.gui');
var win = gui.Window.get();
//登录主页
function login_home() {
  win.setResizable(true); //允许点击 最大化
  win.setMaximumSize(0, 0); // 设置窗口的最大尺寸
  win.setMinimumSize(1280, 740); // 设置窗口的最小尺寸
  var x = (1280 - 634) / 2;
  var y = (750 - 454) / 2;
  win.moveBy(-x, -y);
  // win.resizeTo(1280, 740); //默认尺寸
//   win.setPosition('center'); //窗口位置
};

function CloseWindow() {
  win.close(true);
};

//最大化
function maximize_window() {
  win.maximize();
};
//最小化
function minimize_window() {
  win.minimize();
  win.leaveFullscreen();
};
//还原
function restore_window() {
  win.restore();
  win.leaveFullscreen();
};
