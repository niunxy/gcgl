// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.12/esri/copyright.txt for details.
//>>built
define("require exports ../../../core/tsSupport/assignHelper dojo/i18n!../nls/SymbolStyler ../../../core/domUtils ../../../core/events ../../../core/maybe ../../../core/promiseUtils ../../../core/screenUtils ../../../symbols/support/Symbol3DOutline ../../../symbols/support/symbolLayerUtils".split(" "),function(U,c,R,h,S,D,p,E,n,T,F){function r(a,b){a[b]||(a[b]={})}function g(a,b){return-1<a.indexOf(b)}function k(a){return a&&"icon"===a.type}function m(a){return a&&"object"===a.type}function u(a){return a&&
"extrude"===a.type}function v(a){return a&&"text"===a.type}function w(a){return l(a,"simple-line","2d")}function q(a){return l(a,"simple-marker","2d")}function x(a){return l(a,"picture-marker","2d")}function d(a){return g(a.type,"3d")}function f(a){return a.symbolLayers.getItemAt(0)}function G(a,b){return l(a,"timeline_marker.png",b)||l(a,"point",b)}function l(a, b, e){b=g(a&&a.type,b);return e?b&&("3d"===e?d(a):!d(a)):b}function H(a, b){return l(a,"line",b)}function I(a, b){return l(a,"fill",b)}function y(a){return d(a)?
!1:a&&"string"===typeof a.style&&g(t,a.style)}function z(a){if(d(a)){a:{a=f(a);if("outline"in a&&p.isSome(a.outline)){var b=a.outline,e=b.color,b=b.size;if(!k(a)||J(a)){a={color:p.unwrap(e),size:n.pt2px(b)};break a}}a&&"line"===a.type||a&&"path"===a.type?(e=p.get(a,"material","color"),a={color:p.unwrap(e),size:n.pt2px(a.size)}):a=null}return a}a=w(a)?{color:a.color,size:a.width}:l(a,"fill","2d")||q(a)?{color:a.get("outline.color"),size:a.get("outline.width")}:null;return a}function K(a,b){!isNaN(b)&&
a&&(d(a)?(a=f(a),k(a)||a&&"fill"===a.type?(r(a,"outline"),p.expect(a.outline).size=n.px2pt(b)):a&&"line"===a.type?(r(a,"size"),a.size=n.px2pt(b)):a&&"path"===a.type&&(r(a,"size"),a.size=b)):w(a)?a.width=b:a&&a.outline&&(a.outline.width=b))}function L(a,b){b&&a&&!d(a)&&(b=z(a).color?b:"none",w(a)?a.style=b:a&&a.outline&&(a.outline.style=b))}function M(a,b){if(a&&!isNaN(b))if(d(a))if(a=f(a),k(a)||v(a))a.size=n.px2pt(b);else if(m(a)){var e=a.width,c=a.height,h=a.depth;b/=Math.max(e,c,h);a.set({width:e*
b,height:c*b,depth:h*b})}else u(a)&&(a.size=b);else e=a.width,e!==b&&(x(a)?(c=a.url,b=N({dimensions:a,targetDimension:"width",targetSize:b}),a.height=b.height,a.width=b.width,c&&"http://"!==c&&(g(c,"http://")||g(c,"data:"))&&(a.xoffset||a.yoffset)&&(b=a.width/e,a.xoffset=Math.round(a.xoffset*b),a.yoffset=Math.round(a.yoffset*b))):a.size=b)}function O(a,b){d(a)?A(a,{color:b}):a.color=b}function B(a,b){if(d(a)){var e=f(a);e&&"line"===e.type||e&&"path"===e.type?A(a,{color:b}):(r(e,"outline"),e.outline.color=
b)}else z(a).color=b}function N(a){var b=a.dimensions,e=a.targetSize;return"height"===("height"===a.targetDimension?"height":"width")?{height:e,width:b.width/b.height*e}:{height:b.height/b.width*e,width:e}}function A(a,b){a=f(a);b.color?"water"===a.type?a.color=b.color:a.material=R({},a.material,b):"water"!==a.type&&(a.material=void 0)}function P(a){return k(a)&&g(t,a.get("resource.primitive"))}function J(a){return k(a)?!a.get("resource.href"):!1}function Q(a,b){return d(a)&&d(b)?(a=f(a),b=f(b),k(a)&&
k(b)&&!a.resource.href&&!b.resource.href&&!g(t,a.resource.primitive)&&g(t,b.resource.primitive)):C(a,b)}function C(a,b){return q(a)&&q(b)&&!y(a)&&y(b)}Object.defineProperty(c,"__esModule",{value:!0});var t=["x","cross"];c.is3d=d;c.getSymbolLayer=f;c.isPoint=G;c.hasExtrudeSymbolLayer=function(a){return d(a)&&u(f(a))};c.hasTextSymbolLayer=function(a){return d(a)&&v(f(a))};c.isLine=H;c.isPolygon=I;c.hasPureOutlineStyle=y;c.getOutline=z;c.setOutlineWidth=K;c.setOutlineStyle=L;c.setSize=M;c.getMarkerLength=
function(a){if(d(a)){a=f(a);if(k(a)||v(a))return n.pt2px(a.size);if(m(a))return Math.max(a.width,a.height,a.depth);if(u(a))return a.size}else{if(q(a))return a.size;if(x(a))return Math.max(a.width,a.height,a.depth)}};c.setFillColor=O;c.getFillColor=function(a){return d(a)?(a=f(a),a.get("water"===a.type?"color":"material.color")):a.color};c.setOutlineColor=B;c.preserveAspectRatio=N;c.testImageUrl=function(a){var b,e,c,d=E.create(function(d,f){c=document.createElement("img");b=D.on(c,"load",function(){0===
c.width&&0===c.height?f("image has both width and height of 0"):d({width:c.width,height:c.height})});e=D.on(c,"error",function(a){f("error ocurred while loading image")});c.src=a});d.catch(function(){}).then(function(){b.remove();e.remove();S.remove(c)});return d};c.updateShape=function(a){d(a.symbol);M(a.symbol,a.size)};c.updateFill=function(a){d(a.symbol);O(a.symbol,a.color)};c.updateOutline=function(a){d(a.symbol)?B(a.symbol,a.color):(B(a.symbol,a.color),L(a.symbol,a.pattern));K(a.symbol,a.size)};
c.blendsIntoBackground=function(a){if(d(a))return!1;var b=void 0;return(b=a&&a.outline?a.outline.color:a.color)&&246<b.r&&246<b.g&&246<b.b};c.updateSymbol3DLayerColor=A;c.ensureSupportedSimpleFillSymbolStyle=function(a){l(a,"simple-fill","2d")&&"solid"!==a.style&&"none"!==a.style&&(a.style="solid")};c.getApplicableTabs=function(a,b){void 0===b&&(b=[]);if(d(a)){a=f(a);var c=a.type,h=["icon","object"],l="icon object fill water extrude text".split(" "),m=["icon","fill","line","path"];return{shape:{state:g(b,
"shape")||!g(h,c)?"excluded":"enabled"},fill:{state:g(b,"fill")||!g(l,c)?"excluded":P(a)?"disabled":"enabled"},outline:{state:g(b,"outline")||!g(m,c)?"excluded":!k(a)||J(a)||P(a)?"enabled":"disabled"}}}var c=a.type,h=["simple-marker","picture-marker"],l=["simple-marker","simple-fill"],m=["simple-marker","simple-line","simple-fill"],n=H(a),p=I(a);return{shape:{state:g(b,"shape")||n||p?"excluded":g(h,c)?"enabled":"disabled"},fill:{state:g(b,"fill")||n?"excluded":l[0]===c&&g(["circle","square","diamond",
"triangle"],a.style)||l[1]===c?"enabled":"disabled"},outline:{state:g(b,"outline")?"excluded":g(m,c)?"enabled":"disabled"}}};c.getSizeUnit=function(a){return d(a)&&(a=f(a).type,"extrude"===a||"object"===a)?"meters":"pixels"};c.getOutlineUnit=function(a){return d(a)&&"path"===f(a).type?"meters":"pixels"};c.getSymbolSource=function(a){return d(a)?G(a)?(a=f(a),m(a)?"web-style:volumetric":k(a)?"web-style:flat":"web-style"):"web-style":"symbol-set"};c.getDimensionality=function(a){a=f(a).type;return"object"===
a||"path"===a||"extrude"===a?"volumetric":"flat"};c.ensureProps=function(a){if(d(a)){var b=f(a);if(k(b)&&(b.outline||(b.outline=new T.Symbol3DOutline({color:void 0,size:0})),void 0===b.size))return F.computeLayerSize(b).then(function(c){b.size=c[0];return a});if(m(b)&&void 0===b.width&&void 0===b.height&&void 0===b.depth)return F.computeLayerSize(b).then(function(c){b.set({width:c[0],height:c[1],depth:c[2]});return a})}return E.resolve(a)};c.switchedFromRasterToVectorSymbol=function(a,b){return d(a)&&
d(b)?(a=f(a),b=f(b),k(a)&&m(b)&&!!a.resource.href&&!b.resource.href&&!!b.resource.primitive):x(a)&&q(b)};c.switchedToPureOutline=Q;c.switchedFromPureOutline=function(a,b){return d(a)&&d(b)?Q(b,a):C(b,a)};c.switchedSmsStyleToPureOutline=C;c.getSymbolName=function(a){if(!d(a))return"";var b=f(a);if(!k(b)&&!m(b))return"";if(a.styleOrigin)return a.styleOrigin.name;if(b.get("resource.href")||!b.get("resource.primitive"))return"";a=b.get("resource.primitive");if(k(b))return h[a];if(m(b)){var c=b.depth,
g=b.height,b=b.width;return{sphere:h.sphere,cylinder:h.cylinder,"tall-cylinder":h.tallCylinder,cube:h.cube,"tall-cube":h.tallCube,cone:h.cone,"tall-cone":h.tallCone,"inverted-cone":h.invertedCone,diamond:h.diamond,tetrahedron:h.tetrahedron}[b&&c&&g&&b===c&&b<g?"tall-"+a:a]}}});