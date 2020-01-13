// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.12/esri/copyright.txt for details.
//>>built
define("require exports ../../../../../core/libs/gl-matrix-2/vec3 ../../../../../core/libs/gl-matrix-2/vec3f64 ../../../support/mathUtils ../../../support/projectionUtils".split(" "),function(h,k,d,f,g,a){var b;(function(b){var e=function(){function a(a,c){this._startPosition=f.vec3f64.create();this._endPosition=f.vec3f64.create();d.vec3.copy(this._startPosition,a);d.vec3.copy(this._endPosition,c)}a.prototype.eval=function(a,c){d.vec3.lerp(c,this._startPosition,this._endPosition,a)};return a}();b.Linear=
e;e=function(){function b(b,c,d,e){this._startPosition=f.vec3f64.create();this._endPosition=f.vec3f64.create();a.vectorToVector(b,d,this._startPosition,a.SphericalECEFSpatialReference);a.vectorToVector(c,d,this._endPosition,a.SphericalECEFSpatialReference);this._destSR=e}b.prototype.eval=function(b,c){g.slerp(this._startPosition,this._endPosition,b,c);a.vectorToVector(c,a.SphericalECEFSpatialReference,c,this._destSR)};return b}();b.Spherical=e})(b||(b={}));return b});