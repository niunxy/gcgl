// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.12/esri/copyright.txt for details.
//>>built
define("require exports ../../../../core/tsSupport/extendsHelper ../../../../core/tsSupport/generatorHelper ../../../../core/tsSupport/awaiterHelper ../../../../core/libs/gl-matrix-2/vec3 ../../../../core/libs/gl-matrix-2/vec3f64 ../../../../geometry/support/aaBoundingBox ../../../../geometry/support/aaBoundingRect ./graphicUtils".split(" "),function(g,x,y,q,r,t,u,f,v,w){g=function(){function b(a,d,b){this.type="draped";this.graphics3DSymbolLayer=a;this.renderGeometries=d;this.boundingBox=b;this.stage=
null;this._visible=!1}b.prototype.initialize=function(a,d){this.stage=d};b.prototype.setVisibility=function(a){if(null!=this.stage)return this._visible!==a?((this._visible=a)?this.stage.renderView.getDrapedRenderer().addRenderGeometries(this.renderGeometries):this.stage.renderView.getDrapedRenderer().removeRenderGeometries(this.renderGeometries),!0):!1};b.prototype.destroy=function(){this.stage&&this._visible&&this.stage.renderView.getDrapedRenderer().removeRenderGeometries(this.renderGeometries);
this._visible=!1;this.stage=null};b.prototype.getBSRadius=function(){return this.renderGeometries.reduce(function(a,d){return Math.max(a,d.bsRadius)},0)};b.prototype.getCenterObjectSpace=function(a){void 0===a&&(a=u.vec3f64.create());return t.vec3.set(a,0,0,0)};b.prototype.getBoundingBoxObjectSpace=function(a){void 0===a&&(a=f.create());return f.empty(a)};b.prototype.addHighlight=function(a,d){var b=this;this.renderGeometries.forEach(function(e){var c=e.addHighlight(d);a.addRenderGeometry(e,c,b)});
this._visible&&this.stage.renderView.getDrapedRenderer().updateHighlights(this.renderGeometries)};b.prototype.removeHighlight=function(a){this.renderGeometries.forEach(function(d){a.removeRenderGeometry(d)})};b.prototype.removeRenderGeometryHighlight=function(a,d){a.removeHighlight(d);this._visible&&this.stage.renderView.getDrapedRenderer().updateHighlights(this.renderGeometries)};b.prototype.getProjectedBoundingBox=function(a,d,b,e,c){return r(this,void 0,void 0,function(){var m,g,h,n;return q(this,
function(k){switch(k.label){case 0:f.empty(c);for(m=0;m<this.renderGeometries.length;m++)g=this.renderGeometries[m],this._getRenderGeometryProjectedBoundingRect(g,a,p,b),f.expand(c,p);if(!d)return[3,5];f.center(c,l);h=void 0;n=w.demResolutionForBoundingBox(c,d);k.label=1;case 1:return k.trys.push([1,3,,4]),[4,d.service.queryElevation(l[0],l[1],e,n)];case 2:return h=k.sent(),[3,4];case 3:return k.sent(),h=null,[3,4];case 4:null!=h&&(c[2]=Math.min(c[2],h),c[5]=Math.max(c[5],h)),k.label=5;case 5:return[2,
c]}})})};b.prototype._getRenderGeometryProjectedBoundingRect=function(a,b,g,l){if(this.boundingBox)f.set(e,this.boundingBox);else{var c=a.center;a=a.bsRadius;e[0]=c[0]-a;e[1]=c[1]-a;e[2]=c[2]-a;e[3]=c[0]+a;e[4]=c[1]+a;e[5]=c[2]+a}b(e,0,2);this.calculateRelativeScreenBounds&&l.push({location:f.center(e),screenSpaceBoundingRect:this.calculateRelativeScreenBounds()});return f.toRect(e,g)};return b}();var p=v.create(),e=f.create(),l=[0,0,0];return g});