// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.12/esri/copyright.txt for details.
//>>built
define("require exports ../../../../core/maybe ../../../../core/screenUtils ../../../../core/libs/gl-matrix-2/mat2d ../../../../core/libs/gl-matrix-2/mat2df32 ../../../../core/libs/gl-matrix-2/vec2 ../../../../core/libs/gl-matrix-2/vec2f32 ../../../../geometry/SpatialReference ../../../../geometry/support/aaBoundingRect ../../../../geometry/support/boundsUtils ../../../../geometry/support/intersects ../../../../geometry/support/jsonUtils ../../../../geometry/support/normalizeUtils ../../../../geometry/support/spatialReferenceUtils ../../../../geometry/support/spatialReferenceUtils ../../engine".split(" "),
function(ja,q,Y,p,n,Z,g,w,A,aa,K,L,r,M,ba,ca,k){function N(a,d,c,b,e){var f,l,u=p.pt2px(c.xoffset),h=p.pt2px(c.yoffset),t=v*c.angle;e*=v;switch(c.type){case "simple-marker":f=l=p.pt2px(c.size);break;case "picture-marker":f=p.pt2px(c.width),l=p.pt2px(c.height)}c=n.mat2d.identity(E);n.mat2d.translate(c,c,g.vec2.set(m,a,d));n.mat2d.rotate(c,c,e-t);n.mat2d.scale(c,c,g.vec2.set(m,b,-b));n.mat2d.translate(c,c,g.vec2.set(m,u,-h));a=[0,0];g.vec2.transformMat2d(a,g.vec2.set(m,-.5*f,-.5*l),c);d=[0,0];g.vec2.transformMat2d(d,
g.vec2.set(m,-.5*f,.5*l),c);b=[0,0];g.vec2.transformMat2d(b,g.vec2.set(m,.5*f,-.5*l),c);u=[0,0];g.vec2.transformMat2d(u,g.vec2.set(m,.5*f,.5*l),c);return{rings:[[a,b,u,d,a]]}}function O(a,d,c,b,e){var f=k.CIMSymbolHelper.getEnvelope(c.data);if(!f)return null;c=p.pt2px(f.width);var l=p.pt2px(f.height),u=p.pt2px(f.x),f=p.pt2px(f.y),h=0*v,t=v*e;e=n.mat2d.identity(E);n.mat2d.translate(e,e,g.vec2.set(m,a,d));n.mat2d.rotate(e,e,t-h);n.mat2d.scale(e,e,g.vec2.set(m,b,-b));n.mat2d.translate(e,e,g.vec2.set(m,
u,-f));a=[0,0];g.vec2.transformMat2d(a,g.vec2.set(m,-.5*c,-.5*l),e);d=[0,0];g.vec2.transformMat2d(d,g.vec2.set(m,-.5*c,.5*l),e);b=[0,0];g.vec2.transformMat2d(b,g.vec2.set(m,.5*c,-.5*l),e);u=[0,0];g.vec2.transformMat2d(u,g.vec2.set(m,.5*c,.5*l),e);return{rings:[[a,b,u,d,a]]}}function P(a,d,c,b,e,f){var l=k.alignmentUtils.getYAnchorDirection(c.verticalAlignment||"baseline"),u="baseline"===(c.verticalAlignment||"baseline"),h=p.pt2px(c.xoffset),t=p.pt2px(c.yoffset),Q=p.pt2px(c.font.size)/24,R=4*Q,l=u?
25*Q:b[1]+(1+l)*b[3]*.5;c=v*c.angle;u=v*f;f=n.mat2d.identity(E);n.mat2d.translate(f,f,g.vec2.set(m,a,d));n.mat2d.rotate(f,f,u-c);n.mat2d.scale(f,f,g.vec2.set(m,e,-e));n.mat2d.translate(f,f,g.vec2.set(m,h,-t));n.mat2d.translate(f,f,g.vec2.set(m,-R,-R-l));a=[0,0];g.vec2.transformMat2d(a,g.vec2.set(m,b[0],b[1]),f);d=[0,0];g.vec2.transformMat2d(d,g.vec2.set(m,b[0],b[1]+b[3]),f);e=[0,0];g.vec2.transformMat2d(e,g.vec2.set(m,b[0]+b[2],b[1]),f);h=[0,0];g.vec2.transformMat2d(h,g.vec2.set(m,b[0]+b[2],b[1]+
b[3]),f);return{rings:[[a,e,h,d,a]]}}function F(a,d,c){if(!c||0===c.glyphMosaicItems.length)return a;var b=k.bidiText(d.text),e=b[0],b=b[1],f=k.alignmentUtils.getJustification(d.horizontalAlignment||"center"),l=k.alignmentUtils.getXAnchorDirection(d.horizontalAlignment||"center");c=(new k.TextShapingNew([c.glyphMosaicItems],k.definitions.TEXT_MAX_WIDTH,k.definitions.TEXT_LINE_HEIGHT,k.definitions.TEXT_SPACING,[0,.5*-G],.5*(1-l),0,f)).getShaping(e,b);e=k.fontUtils.getFontDecorationTop(d.font.decoration);
isNaN(e)||k.TextShapingNew.addDecoration(c,e);c=k.TextShapingNew.getBox(c);d=p.pt2px(d.font.size)/S;a[0]=d*c.x;a[1]=d*c.y;a[2]=d*c.width;a[3]=d*c.height;return a}function x(a,d){return Math.ceil((a-d)/(2*d))}function da(a,d){var c;c=r.isPolygon(a)?a.rings:a.paths;for(var b=0;b<c.length;b++)for(var e=0,f=c[b];e<f.length;e++)f[e][0]+=d;return a}function ea(a,d){if(!d)return a;var c=fa(a,d).map(function(b){return b.extent});return 2>c.length?c[0]||a:2<c.length?(a.xmin=d.valid[0],a.xmax=d.valid[1],a):
{rings:c.map(function(b){return[[b.xmin,b.ymin],[b.xmin,b.ymax],[b.xmax,b.ymax],[b.xmax,b.ymin],[b.xmin,b.ymin]]})}}function fa(a,d){var c=[],b=a.ymin,e=a.ymax,f=a.xmax-a.xmin,l=a.xmin,g=a.xmax,h,t=d.valid,m=t[0],k=t[1];h=T(a.xmin,d);var n=h.x,t=h.frameId;h=T(a.xmax,d);d=h.x;a=h.frameId;h=n===d&&0<f;if(f>2*k){f={xmin:l<g?n:d,ymin:b,xmax:k,ymax:e};l={xmin:m,ymin:b,xmax:l<g?d:n,ymax:e};g={xmin:0,ymin:b,xmax:k,ymax:e};b={xmin:m,ymin:b,xmax:0,ymax:e};e=[];m=[];B(f,g)&&e.push(t);B(f,b)&&m.push(t);B(l,
g)&&e.push(a);B(l,b)&&m.push(a);for(k=t+1;k<a;k++)e.push(k),m.push(k);c.push({extent:f,frameIds:[t]},{extent:l,frameIds:[a]},{extent:g,frameIds:e},{extent:b,frameIds:m})}else n>d||h?c.push({extent:{xmin:n,ymin:b,xmax:k,ymax:e},frameIds:[t]},{extent:{xmin:m,ymin:b,xmax:d,ymax:e},frameIds:[a]}):c.push({extent:{xmin:n,ymin:b,xmax:d,ymax:e},frameIds:[t]});return c}function T(a,d){var c=d.valid;d=c[0];var b=c[1],c=2*b,e=0;a>b?(d=Math.ceil(Math.abs(a-b)/c),a-=d*c,e=d):a<d&&(d=Math.ceil(Math.abs(a-d)/c),
a+=d*c,e=-d);return{x:a,frameId:e}}function B(a,d){var c=d.xmin,b=d.ymin,e=d.xmax;d=d.ymax;return C(a,c,b)&&C(a,c,d)&&C(a,e,d)&&C(a,e,b)}function C(a,d,c){return d>=a.xmin&&d<=a.xmax&&c>=a.ymin&&c<=a.ymax?!0:!1}function U(a,d,c){if(Array.isArray(a)){var b=a[0];if(b>d){var e=x(b,d);a[0]=b+-2*e*d}else b<c&&(e=x(b,c),a[0]=b+-2*e*c)}else b=a.x,b>d?(e=x(b,d),a.x+=-2*e*d):b<c&&(e=x(b,c),a.x+=-2*e*c);return a}Object.defineProperty(q,"__esModule",{value:!0});var v=Math.PI/180,ga=k.definitions.TEXT_MAX_WIDTH,
G=k.definitions.TEXT_LINE_HEIGHT,ha=k.definitions.TEXT_SPACING,E=Z.mat2df32.create(),m=w.vec2f32.create(),y=aa.create();q.ensureClosedRings=function(a){if(r.isPolygon(a)){var d=0;for(a=a.rings;d<a.length;d++){var c=a[d];3>c.length||c[0][0]===c[c.length-1][0]&&c[0][1]===c[c.length-1][1]||c.push(c[0])}}};q.getBounds=function(a,d,c,b,e,f,l,g){if(!b||!c)return a[0]=a[1]=a[2]=a[3]=0,d[0]=d[1]=d[2]=d[3]=0,a;if(r.isPoint(b)){l=b.x;b=b.y;"text"===c.type&&0===d[2]&&0===d[3]&&F(d,c,e);var h;switch(c.type){case "simple-marker":case "picture-marker":h=
N(l,b,c,f,0);break;case "text":h=P(l,b,c,d,f,0);break;case "cim":h=O(l,b,c,f,0)}for(f=d=0;f<h.rings[0].length-1;f++)c=h.rings[0][f],c=(l-c[0])*(l-c[0])+(b-c[1])*(b-c[1]),d=Math.max(d,c);d=Math.sqrt(d);f=M.normalizeMapX(l-d,g);l=M.normalizeMapX(l+d,g);f>l&&(g=ca.getInfo(g))&&(f=g.valid,g=f[1],f=f[0],l=g);a[0]=f;a[1]=b-d;a[2]=l;a[3]=b+d}else{K.getBoundsXY(a,b);b=d[0];if(0===b){a:switch(b=0,c.type){case "simple-fill":case "picture-fill":b=c.outline;if(!b){b=0;break a}b=b.width;break;case "simple-line":b=
c.width;break;case "simple-marker":b=c.size;break;case "picture-marker":b=Math.max(c.width,c.height);break;case "text":b=[0,0,0,0];F(b,c,e);b=Math.max(b[0],b[1]);break;case "cim":b=k.CIMSymbolHelper.getEnvelope(c.data),b=Math.sqrt(b.width*b.width+b.height*b.height)}d[0]=b}b=f*b/2;a[0]-=b;a[1]-=b;a[2]+=b;a[3]+=b}return a};q.isMarkerSymbol=function(a){return"simple-marker"===a||"picture-marker"===a||"text"===a};q.graphicGeometryToNumber=function(a){switch(Y.expect(a.geometry).type){case "polyline":return 1;
case "polygon":case "extent":return 2}return 0};var H=w.vec2f32.create(),V=w.vec2f32.create(),W=w.vec2f32.create(),z=w.vec2f32.create(),I=w.vec2f32.create(),X=w.vec2f32.create(),J=w.vec2f32.create();q.isPointOnPolyline=function(a,d,c,b){g.vec2.set(W,d,c);a=a.paths;for(var e,f,l,k,h,m,n,p,q=Infinity,w=0;w<a.length;w++){var r=a[w];if(!(2>r.length))for(var v=1;v<r.length;v++)e=r[v-1][0],l=r[v-1][1],f=r[v][0],k=r[v][1],h=Math.min(e,f)-b,m=Math.min(l,k)-b,n=Math.max(e,f)+b,p=Math.max(l,k)+b,d<h||d>n||
c<m||c>p||(g.vec2.set(H,e,l),g.vec2.set(V,f,k),g.vec2.subtract(z,V,H),g.vec2.subtract(I,H,W),g.vec2.scale(X,z,g.vec2.dot(z,I)/g.vec2.dot(z,z)),g.vec2.subtract(J,I,X),e=g.vec2.dot(J,J),q>e&&(q=e))}return Math.sqrt(q)<=b};q.getMarkerSymbolBounds=N;q.getCIMMarkerBounds=O;q.getTextSymbolBounds=P;q.normalizeCentralMeridian=function(a){var d,c,b,e,f,g=null;if(!a)return null;d=a.spatialReference;c=ba.getInfo(d);f=d.isWebMercator?102100:4326;b=D[f].maxX;e=D[f].minX;d=D[f].plus180Line;f=D[f].minus180Line;
var k,h=a.toJSON();if(!c)return h;"mesh"===a.type?k=h:r.isPoint(h)?k=U(h,b,e):r.isMultipoint(h)?(h.points=h.points.map(function(a){return U(a,b,e)}),k=h):r.isExtent(h)?k=ea(h,c):r.isPolygon(h)||r.isPolyline(h)?(K.getBoundsXY(y,h),a={xmin:y[0],ymin:y[1],xmax:y[2],ymax:y[3]},c=2*x(a.xmin,e)*b,h=0===c?h:da(h,c),a.xmin+=c,a.xmax+=c,L.extentIntersectsPolyline(a,d)&&a.xmax!==b?g=h:L.extentIntersectsPolyline(a,f)&&a.xmin!==e?g=h:k=h):k=a.clone();return null!==g?(new ia).cut(g,b):k};var S=24;q.getTextSymbolSize=
F;q.getTextSymbolEstimatedSize=function(a,d,c){var b=k.bidiText(d.text),e=b[0],b=b[1],f=k.alignmentUtils.getJustification(d.horizontalAlignment||"center"),g=k.alignmentUtils.getXAnchorDirection(d.horizontalAlignment||"center");c=(new k.TextShapingNew([],ga,G,ha,[0,.5*-G],.5*(1-g),0,f)).getEstimatedShaping(e,b,c);c=k.TextShapingNew.getBox(c);d=p.pt2px(d.font.size)/S;a[0]=d*c.x;a[1]=d*c.y;a[2]=d*c.width;a[3]=d*c.height;return a};var D={102100:{maxX:2.0037508342788905E7,minX:-2.0037508342788905E7,plus180Line:{paths:[[[2.0037508342788905E7,
-2.0037508342788905E7],[2.0037508342788905E7,2.0037508342788905E7]]],spatialReference:A.WebMercator},minus180Line:{paths:[[[-2.0037508342788905E7,-2.0037508342788905E7],[-2.0037508342788905E7,2.0037508342788905E7]]],spatialReference:A.WebMercator}},4326:{maxX:180,minX:-180,plus180Line:{paths:[[[180,-180],[180,180]]],spatialReference:A.WGS84},minus180Line:{paths:[[[-180,-180],[-180,180]]],spatialReference:A.WGS84}}},ia=function(){function a(){}a.prototype.cut=function(a,c){var b;if(a.rings)this.closed=
!0,b=a.rings,this.minPts=4;else if(a.paths)this.closed=!1,b=a.paths,this.minPts=2;else return null;var d=b.length;c*=-2;for(var f=0;f<d;f++){var g=b[f];if(g&&g.length>=this.minPts){for(var k=[],h=0;h<g.length;h++){var m=g[h];k.push([m[0]+c,m[1]])}b.push(k)}}this.closed?a.rings=b:a.paths=b;return a};return a}()});