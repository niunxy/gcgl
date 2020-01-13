// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.12/esri/copyright.txt for details.
//>>built
define("require exports ../../../core/tsSupport/awaiterHelper ../../../core/tsSupport/generatorHelper ../../../Color ../../../core/promiseUtils ../../../renderers/support/numberUtils ../../../symbols/support/gfxUtils ./utils @dojo/framework/shim/Promise".split(" "),function(t,g,q,r,l,w,u,x,v){function y(a,b,d){void 0===d&&(d=z);return q(this,void 0,void 0,function(){var c,f;return r(this,function(e){switch(e.label){case 0:return c=new l(d),[4,new Promise(function(a,b){t(["../../../renderers/visualVariables/support/visualVariableUtils"],
a,b)})];case 1:return f=e.sent().getOpacity(b,a),null!=f&&(c.a=f),[2,c]}})})}function m(a,b){a=A(a,b);var d=a.startIndex,c=a.endIndex;if(d===c)return b[d].color;b=l.blendColors(b[d].color,b[c].color,a.weight);return new l(b)}function A(a,b){var d=0,c=b.length-1;b.some(function(b,e){if(a<b.value)return c=e,!0;d=e;return!1});return{startIndex:d,endIndex:c,weight:(a-b[d].value)/(b[c].value-b[d].value)}}Object.defineProperty(g,"__esModule",{value:!0});var z=[64,64,64],B=[255,255,255];g.getRampBorderColor=
function(a){var b=null;if("simple"===a.type)b=a.symbol;else if("unique-value"===a.type||"class-breaks"===a.type)b=(a=(a=a.classBreakInfos||a.uniqueValueInfos)&&a[0])&&a.symbol;return(a=(a=b&&-1===b.type.indexOf("line-symbol")?x.getStroke(b):null)&&a.color)&&0<a.a&&!(240<=a.r&&240<=a.g&&240<=a.b)?a:null};g.getRampOverlayColor=function(a){var b=new l(B);b.a=1-a;return b};g.getRampStops=function(a,b,d){return q(this,void 0,void 0,function(){var a,f,e,h,n,k,g,l,m=this;return r(this,function(c){switch(c.label){case 0:a=
!1;f=[];e=[];b.stops&&(h=b.stops,f=h.map(function(a){return a.value}),(a=h.some(function(a){return!!a.label}))&&(e=h.map(function(a){return a.label})));n=f[0];k=f[f.length-1];if(null==n&&null==k)return[2,null];g=k-n;return[4,w.all(f.map(function(c,k){return q(m,void 0,void 0,function(){var l,h,m;return r(this,function(p){switch(p.label){case 0:return"opacity"!==b.type?[3,2]:[4,y(c,b,d)];case 1:return h=p.sent(),[3,4];case 2:return[4,new Promise(function(a,b){t(["../../../renderers/visualVariables/support/visualVariableUtils"],
a,b)})];case 3:h=p.sent().getColor(b,c),p.label=4;case 4:return l=h,m=a?e[k]:v.getLabelPrefix(k,f.length-1)+u.format(c),[2,{value:c,color:l,label:m,offset:g?1-(c-n)/g:1}]}})})}))];case 1:return l=c.sent(),[2,l.reverse()]}})})};g.getRampStopsForPointCloud=function(a){var b=!1,d=[],c=[],d=a.map(function(a){return a.value});(b=a.some(function(a){return!!a.label}))&&(c=a.map(function(a){return a.label}));var f=d[0],e=d[d.length-1];if(null==f&&null==e)return null;var h=e-f;return d.map(function(e,k){var g=
m(e,a);k=b?c[k]:v.getLabelPrefix(k,d.length-1)+u.format(e);return{value:e,color:g,label:k,offset:h?1-(e-f)/h:1}}).reverse()};g.getColorFromPointCloudStops=m});