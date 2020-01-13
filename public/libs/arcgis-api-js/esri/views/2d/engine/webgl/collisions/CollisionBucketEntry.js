// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.12/esri/copyright.txt for details.
//>>built
define(["require","exports","../../../../../core/libs/gl-matrix-2/vec2"],function(n,h,k){Object.defineProperty(h,"__esModule",{value:!0});n=function(){function b(){this._reference=null}Object.defineProperty(b.prototype,"dirty",{get:function(){return this.reference&&this.reference.isDirty},set:function(g){this.reference&&this.reference.hasData&&(this.reference.isDirty=g)},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"index",{get:function(){return this._reference&&this._reference.labelIndex},
enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"reference",{get:function(){return this._reference},set:function(g){this._reference=g},enumerable:!0,configurable:!0});b.prototype.reset=function(g,b,p){var n=p.layerView.tileRenderer,d=this.reference;if(!d||!d.hasData)return!1;b&&(d.isDirty=!0);b=d.labelMat2d;for(var h=d.labelMat2d[4],t=d.labelMat2d[5],q=0,u=d.displayObjects;q<u.length;q++)for(var l=u[q],v=n.featuresView.attributeView.getVVSize(l.id),r=0,l=l.metrics;r<l.length;r++){var c=
l[r];p.hasVV()&&c.computeOffset(v,p.vvEval);var m=c.bounds.center,a=c.bounds.centerT;d.isDirty&&(c.minZoom=-1);var e=k.vec2.copy(a,c.anchor);g.rotation?k.vec2.transformMat2d(e,e,b):(a[0]=e[0]+h,a[1]=e[1]+t);k.vec2.add(a,e,m);a[0]+=c.offsetX;a[1]+=c.offsetY;if(c.boxes)for(m=0,a=c.boxes;m<a.length;m++){var e=a[m],f=e.centerT;k.vec2.add(f,c.anchor,e.center);g.rotation?k.vec2.transformMat2d(f,f,b):(f[0]+=h,f[1]+=t)}}return!0};return b}();h.default=n});