//>>built
define(["./sniff","./dom","./_base/window"],function(d,m,q){function r(b,a,c){a=a.toLowerCase();if("auto"==c){if("height"==a)return b.offsetHeight;if("width"==a)return b.offsetWidth}if("fontweight"==a)switch(c){case 700:return"bold";default:return"normal"}a in k||(k[a]=t.test(a));return k[a]?g(b,c):c}var l,e={};l=d("webkit")?function(b){var a;if(1==b.nodeType){var c=b.ownerDocument.defaultView;a=c.getComputedStyle(b,null);!a&&b.style&&(b.style.display="",a=c.getComputedStyle(b,null))}return a||{}}:
d("ie")&&9>d("ie")?function(b){return 1==b.nodeType&&b.currentStyle?b.currentStyle:{}}:function(b){if(1===b.nodeType){var a=b.ownerDocument.defaultView;return(a.opener?a:q.global.window).getComputedStyle(b,null)}return{}};e.getComputedStyle=l;var g;g=d("ie")?function(b,a){if(!a)return 0;if("medium"==a)return 4;if(a.slice&&"px"==a.slice(-2))return parseFloat(a);var c=b.style,h=b.runtimeStyle,d=c.left,e=h.left;h.left=b.currentStyle.left;try{c.left=a,a=c.pixelLeft}catch(v){a=0}c.left=d;h.left=e;return a}:
function(b,a){return parseFloat(a)||0};e.toPixelValue=g;var f=function(b,a){try{return b.filters.item("DXImageTransform.Microsoft.Alpha")}catch(c){return a?{}:null}},u=9>d("ie")||(d("ie"),0)?function(b){try{return f(b).Opacity/100}catch(a){return 1}}:function(b){return l(b).opacity},n=9>d("ie")||(d("ie"),0)?function(b,a){""===a&&(a=1);var c=100*a;1===a?(b.style.zoom="",f(b)&&(b.style.filter=b.style.filter.replace(/\s*progid:DXImageTransform.Microsoft.Alpha\([^\)]+?\)/i,""))):(b.style.zoom=1,f(b)?
f(b,1).Opacity=c:b.style.filter+=" progid:DXImageTransform.Microsoft.Alpha(Opacity\x3d"+c+")",f(b,1).Enabled=!0);if("tr"==b.tagName.toLowerCase())for(b=b.firstChild;b;b=b.nextSibling)"td"==b.tagName.toLowerCase()&&n(b,a);return a}:function(b,a){return b.style.opacity=a},k={left:!0,top:!0},t=/margin|padding|width|height|max|min|offset/,p={cssFloat:1,styleFloat:1,"float":1};e.get=function(b,a){var c=m.byId(b),h=arguments.length;if(2==h&&"opacity"==a)return u(c);a=p[a]?"cssFloat"in c.style?"cssFloat":
"styleFloat":a;var d=e.getComputedStyle(c);return 1==h?d:r(c,a,d[a]||c.style[a])};e.set=function(b,a,c){var d=m.byId(b),f=arguments.length,k="opacity"==a;a=p[a]?"cssFloat"in d.style?"cssFloat":"styleFloat":a;if(3==f)return k?n(d,c):d.style[a]=c;for(var g in a)e.set(b,g,a[g]);return e.getComputedStyle(d)};return e});