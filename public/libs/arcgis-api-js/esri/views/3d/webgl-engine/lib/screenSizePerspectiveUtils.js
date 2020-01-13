// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.12/esri/copyright.txt for details.
//>>built
define(["require","exports","../../../../core/mathUtils","../../support/earthUtils","../../support/mathUtils"],function(y,d,w,g,f){function r(a){return Math.abs(a*a*a)}function k(a,b,c,e){void 0===e&&(e=x);var h=c.parameters;c=c.paddingPixelsOverride;e.scale=Math.min(h.divisor/(b-h.offset),1);e.factor=r(a);e.minPixelSize=h.minPixelSize;e.paddingPixels=c;return e}function n(a,b){return 0===a?b.minPixelSize:b.minPixelSize*(1+2*b.paddingPixels/a)}function p(a,b){return Math.max(f.lerp(a*b.scale,a,b.factor),
n(a,b))}function t(a,b,c){a=k(a,b,c);a.minPixelSize=0;a.paddingPixels=0;return p(1,a)}Object.defineProperty(d,"__esModule",{value:!0});d.getSettings=function(a){return new u(a,d.defaultDescription)};d.getLabelSettings=function(a){var b=d.defaultDescription.curvatureDependent;return new u(a,{curvatureDependent:{min:{curvature:b.min.curvature,tiltAngle:b.min.tiltAngle,scaleFallOffFactor:q.curvatureDependent.min.scaleFallOffFactor},max:{curvature:b.max.curvature,tiltAngle:b.max.tiltAngle,scaleFallOffFactor:q.curvatureDependent.max.scaleFallOffFactor}},
scaleStart:d.defaultDescription.scaleStart,scaleFallOffRange:d.defaultDescription.scaleFallOffRange,minPixelSize:q.minPixelSize})};d.perspectiveFactor=r;d.scaleFactor=k;d.applyScaleFactor=p;d.applyScaleFactorVec2=function(a,b,c){void 0===c&&(c=[0,0]);var e=Math.min(Math.max(b.scale,n(a[1],b)/a[1]),1);c[0]=f.lerp(a[0]*e,a[0],b.factor);c[1]=f.lerp(a[1]*e,a[1],b.factor);return c};d.precomputeScale=t;d.precomputeScaleFactor=function(a,b,c,e){e.scale=t(a,b,c);e.factor=0;e.minPixelSize=c.parameters.minPixelSize;
e.paddingPixels=c.paddingPixelsOverride;return e};d.applyPrecomputedScaleFactorVec2=function(a,b,c){void 0===c&&(c=[0,0]);b=Math.min(Math.max(b.scale,n(a[1],b)/a[1]),1);c[0]=a[0]*b;c[1]=a[1]*b;return c};d.scale=function(a,b,c,e){return p(a,k(b,c,e))};var u=function(){function a(b,a,e,h){void 0===e&&(e={camera:{distance:0,fovY:0},divisor:0,offset:0,minPixelSize:0,paddingPixels:0});this.viewingMode=b;this.description=a;this.parameters=e;this._paddingPixelsOverride=h;"local"===this.viewingMode?(this.coverageCompensation=
this.surfaceCoverageCompensationLocal,this.calculateCurvatureDependentParameters=this.calculateCurvatureDependentParametersLocal):(this.coverageCompensation=this.surfaceCoverageCompensationGlobal,this.calculateCurvatureDependentParameters=this.calculateCurvatureDependentParametersGlobal)}Object.defineProperty(a.prototype,"paddingPixelsOverride",{get:function(){return this._paddingPixelsOverride||this.parameters.paddingPixels},enumerable:!0,configurable:!0});a.prototype.update=function(b){if(this.parameters&&
this.parameters.camera.fovY===b.fovY&&this.parameters.camera.distance===b.distance)return!1;this.calculateParameters(b,this.parameters);return!0};a.prototype.overridePadding=function(b){return b!==this.paddingPixelsOverride?new a(this.viewingMode,this.description,this.parameters,b):this};a.prototype.calculateParameters=function(b,a){var c=this.description,h=c.scaleStart,d=c.scaleFallOffRange,c=c.minPixelSize,f=b.fovY,g=b.distance,l=this.calculateCurvatureDependentParameters(b),k=this.coverageCompensation(b,
l),m=l.tiltAngle,l=l.scaleFallOffFactor,g=Math.sin(m)*g,m=.5*Math.PI-m-f*(.5-h*k),h=g/Math.cos(m),d=(h-g/Math.cos(m+f*d*k)*l)/(1-l);a.camera.fovY=b.fovY;a.camera.distance=b.distance;a.offset=d;a.divisor=h-d;a.minPixelSize=c;return a};a.prototype.calculateCurvatureDependentParametersLocal=function(b,a){void 0===a&&(a=v);a.tiltAngle=this.description.curvatureDependent.min.tiltAngle;a.scaleFallOffFactor=this.description.curvatureDependent.min.scaleFallOffFactor;return a};a.prototype.calculateCurvatureDependentParametersGlobal=
function(b,a){void 0===a&&(a=v);var c=this.description.curvatureDependent;b=1+b.distance/g.earthRadius;var d=[c.min.curvature,c.max.curvature],k=d[0];b=w.clamp((Math.sqrt(b*b-1)-k)/(d[1]-k),0,1);d=[c.min,c.max];c=d[0];d=d[1];a.tiltAngle=f.lerp(c.tiltAngle,d.tiltAngle,b);a.scaleFallOffFactor=f.lerp(c.scaleFallOffFactor,d.scaleFallOffFactor,b);return a};a.prototype.surfaceCoverageCompensationLocal=function(a,c){return(a.fovY-c.tiltAngle)/a.fovY};a.prototype.surfaceCoverageCompensationGlobal=function(a,
c){var b=g.earthRadius*g.earthRadius;c=c.tiltAngle+.5*Math.PI;var d=a.fovY;a=a.distance;a=a*a+b-2*Math.cos(c)*a*g.earthRadius;var f=Math.sqrt(a);return(Math.acos(Math.sqrt(a-b)/f)-Math.asin(g.earthRadius/(f/Math.sin(c)))+.5*d)/d};return a}();d.defaultDescription={curvatureDependent:{min:{curvature:f.deg2rad(10),tiltAngle:f.deg2rad(12),scaleFallOffFactor:.5},max:{curvature:f.deg2rad(70),tiltAngle:f.deg2rad(40),scaleFallOffFactor:.8}},scaleStart:.3,scaleFallOffRange:.65,minPixelSize:0};var q={curvatureDependent:{min:{scaleFallOffFactor:.7},
max:{scaleFallOffFactor:.95}},minPixelSize:14};d.copyParameters=function(a,b){b.camera.distance=a.camera.distance;b.camera.fovY=a.camera.fovY;b.divisor=a.divisor;b.offset=a.offset;b.minPixelSize=a.minPixelSize;return b};var x={scale:0,factor:0,minPixelSize:0,paddingPixels:0},v={tiltAngle:0,scaleFallOffFactor:0}});