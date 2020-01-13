
## 更新代码后需在node_modules下的cesium-navigation-es6包中进行全局替换
## 替换操作：import Cesium from 'cesium/Cesium' 替换为 import * as Cesium from 'cesium'


## 更新代码后需在node_modules下的cesiumvectortile包中build/cesiumvectortile.js中修改部分代码
## 1、42645行 修改为var obj = eval("(" + geojson + ")")    onSuccess(obj);
## 2、42570行 加入 this._myfunc = options.myfunc ? options.myfunc : null;
## 3、43971行 加入 if (found) {//查找成功   var fcInfo; that._myfunc(srcFc) return;