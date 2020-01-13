// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.12/esri/copyright.txt for details.
//>>built
define(["require","exports","../../../../core/tsSupport/extendsHelper","./Bucket"],function(B,C,y,z){return function(h){function b(c,A,b,a){c=h.call(this,c,A)||this;c._circleVertexBuffer=b;c._circleIndexBuffer=a;return c}y(b,h);Object.defineProperty(b.prototype,"circleIndexStart",{get:function(){return this._circleIndexStart},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"circleIndexCount",{get:function(){return this._circleIndexCount},enumerable:!0,configurable:!0});b.prototype.assignBufferInfo=
function(c){c._circleIndexStart=this._circleIndexStart;c._circleIndexCount=this._circleIndexCount};b.prototype.processFeatures=function(c,b){b=this._circleVertexBuffer;var t=this._circleIndexBuffer;this._circleIndexStart=t.index;this._circleIndexCount=0;var a=this.layer,f=this.zoom;c&&c.setExtent(this.layerExtent);for(var k=1,l=[1,1,1,1],m=1,n=0,p=1,q=[1,1,1,1],r=1,u=0,h=this._features;u<h.length;u++){var d=h[u],v=d.getGeometry(c);if(v)for(a.hasDataDrivenRadius&&(k=a.getPaintValue("circle-radius",
f,d)),a.hasDataDrivenColor&&(l=a.getPaintValue("circle-color",f,d)),a.hasDataDrivenOpacity&&(m=a.getPaintValue("circle-opacity",f,d)),a.hasDataDrivenStrokeWidth&&(p=a.getPaintValue("circle-stroke-width",f,d)),a.hasDataDrivenStrokeColor&&(q=a.getPaintValue("circle-stroke-color",f,d)),a.hasDataDrivenStrokeOpacity&&(r=a.getPaintValue("circle-stroke-opacity",f,d)),a.hasDataDrivenBlur&&(n=a.getPaintValue("circle-blur",f,d)),d=0;d<v.length;d++){var w=v[d];if(w)for(var x=0;x<w.length;x++){var e=w[x],g=b.index;
b.add(e.x,e.y,0,0,k,l,m,n,p,q,r);b.add(e.x,e.y,0,1,k,l,m,n,p,q,r);b.add(e.x,e.y,1,0,k,l,m,n,p,q,r);b.add(e.x,e.y,1,1,k,l,m,n,p,q,r);t.add(g+0,g+1,g+2);t.add(g+1,g+2,g+3);this._circleIndexCount+=6}}}};return b}(z)});