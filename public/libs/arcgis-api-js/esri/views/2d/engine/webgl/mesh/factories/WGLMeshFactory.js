// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.12/esri/copyright.txt for details.
//>>built
define("require exports ../../../../../../core/tsSupport/extendsHelper ../../../../../../core/tsSupport/generatorHelper ../../../../../../core/tsSupport/awaiterHelper ../../../../../../core/Error ../../../../../../core/has ../../../../../../core/Logger ../../../../../../core/maybe ../../../../../../core/promiseUtils ../../../../../../geometry/SpatialReference ../../../../../../geometry/support/jsonUtils ../../../../../../symbols/SimpleLineSymbol ../../definitions ../../enums ../../WGLDisplayObject ../MeshData ../VertexVector ../templates/WGLLabelTemplate ../templates/WGLLineTemplate ../templates/WGLMarkerTemplate ../templates/WGLTemplateStore".split(" "),
function(v,y,P,B,C,D,Q,E,p,F,G,z,H,w,f,I,J,l,K,L,M,A){function N(a){var d=(a.attributes?Object.keys(a.attributes):[]).map(function(b){return{name:b,alias:b,type:"string"===typeof a.attributes[b]?"esriFieldTypeString":"esriFieldTypeDouble"}});return{geometryType:null!=a.centroid?"esriGeometryPolygon":z.getJsonType(a.geometry),spatialReference:G.fromJSON(a.geometry.spatialReference),fields:d}}Object.defineProperty(y,"__esModule",{value:!0});var u=E.getLogger("esri.views.2d.engine.webgl.WGLMeshFactory"),
O={esriGeometryPoint:"above-right above-center above-left center-center center-left center-right below-center below-left below-right".split(" "),esriGeometryPolygon:["always-horizontal"],esriGeometryPolyline:["center-along"],esriGeometryMultipoint:null,esriGeometryEnvelope:null};v=function(){function a(d,b,k,h,a,e){this._isDD=!1;this._labelsDebugTemplate=null;this._isDD=p.isSome(k)&&"dot-density"===k.type;this._geometryType=d;this._idField=b;this._templateStore=h;a&&this._validateLabelingInfo(a)&&
(this._labelTemplates=a.map(function(b){return K.default.fromLabelClass(k,b,e)}))}Object.defineProperty(a.prototype,"templates",{get:function(){return this._templateStore},enumerable:!0,configurable:!0});a.prototype.createMeshData=function(d){var b=Array(5),k=this._labelTemplates&&0<this._labelTemplates.length,a="esriGeometryPolyline"===this._geometryType?w.HEURISTIC_GLYPHS_PER_LINE:w.HEURISTIC_GLYPHS_PER_FEATURE;b[f.WGLGeometryType.MARKER]=new l.VertexVectors(f.WGLGeometryType.MARKER,d);b[f.WGLGeometryType.FILL]=
new l.VertexVectors(f.WGLGeometryType.FILL,d,this._isDD);b[f.WGLGeometryType.LINE]=new l.VertexVectors(f.WGLGeometryType.LINE,d);b[f.WGLGeometryType.TEXT]=new l.VertexVectors(f.WGLGeometryType.TEXT,d);b[f.WGLGeometryType.LABEL]=new l.VertexVectors(f.WGLGeometryType.LABEL,k?a:0);return new J.MeshData([],b)};a.prototype.analyze=function(d,b,k,a,q){return C(this,void 0,void 0,function(){var e,h,r,c,m,f,n,g,x,l;return B(this,function(t){switch(t.label){case 0:return e=d,F.isAborted(q)?[2,[]]:p.isSome(b)?
[4,b.analyze(this._idField,d,k,a,q)]:[3,2];case 1:t.sent(),t.label=2;case 2:h=0;for(r=e;h<r.length;h++){c=r[h];m=-1;"symbol"in c?null!=c.symbol?(f=null,"cim"===c.symbol.type&&(f=N(c)),m=this._templateStore.createTemplateGroup(c.symbol,null,null,f)):p.isSome(b)&&(m=b.match(this._idField,c,null,null,a)):p.isSome(b)&&(m=b.match(this._idField,c,this._geometryType,k,a));if(A.isDynamicId(m))for(n=this._templateStore.getDynamicTemplateGroup(m),g=0,x=n;g<x.length;g++)(l=x[g])&&l.analyze&&l.analyze(this._templateStore,
c,k,a);c.groupId=m}return[2,this._templateStore.finalize(q).then(function(){return e})]}})})};a.prototype.write=function(d,b,a,h,f,e,t){var k=this._templateStore.getTemplateGroup(b.groupId),c=b.localId;if(null!=c){var m=new I(c),q=!!e&&!!this._labelTemplates&&e.has(c);if(A.isDynamicId(b.groupId))for(var n=0;n<k.length;n++){var g=k[n];g.bindFeature(b,a,h)}if(k&&(b.geometry||b.centroid)){h=m.displayRecords;g=b.insertAfter;void 0!==g&&(m.insertAfter=g);(a=this._geometryType)||(a=null!=b.centroid?"esriGeometryPolygon":
z.getJsonType(b.geometry));for(n=0;n<k.length;n++){var g=k[n],l=d.get(g.geometryType);g.writeMesh(h,l,a,c,b)}q&&(k=this._getLabelReference(k),e=e.get(c),this._writeLabelMesh(m,d,c,b,t,e,k,f,a));d.pushDisplayObject(m)}}};a.prototype._hasBadLabelClass=function(d,b){var a=d.labelPlacement,h=O[b];if(!d.symbol)return u.warn("No LabelClass symbol specified."),!0;if(!h)return u.error(new D("mapview-labeling:unsupported-geometry-type","Unable to create labels for Feature Layer, "+b+" is not supported")),
!0;h.some(function(b){return b===a})||(h=h[0],a&&u.warn("Found invalid label placement type "+a+" for "+b+". Defaulting to "+h),d.labelPlacement=h);return!1};a.prototype._validateLabelingInfo=function(a){var b=this;return!a.some(function(a){return b._hasBadLabelClass(a,b._geometryType)})};a.prototype._getLabelReference=function(a){for(var b=0;b<a.length;b++){var d=a[b];if(d instanceof M.default)return d}return null};a.prototype._writeLabelMesh=function(a,b,k,h,f,e,l,r,c){for(var d=a.displayRecords,
q=[],n=0;n<e.length;n++){var g=e[n],t=g.text,p=g.rtl,g=this._labelTemplates[g.id],u=b.get(g.geometryType),v=f.get(g.symbolId).glyphMosaicItems;g.bindReferenceTemplate(l);g.bindTextInfo(v,t,p);g.writeMesh(d,u,c,k,h,r,q)}a.metrics=q;w.DEBUG_LABELS&&this._debugLabels(a,b)};a.prototype._debugLabels=function(a,b){var d=a.displayRecords,h=a.id,f=0;for(a=a.metrics;f<a.length;f++)for(var e=a[f],l=0,r=e.boxes?e.boxes.concat([e.bounds]):[e.bounds];l<r.length;l++){var c=r[l],c={geometry:{paths:[[[e.anchor[0]+
e.offsetX+c.center[0]-c.width/2,e.anchor[1]+e.offsetY+c.center[1]+c.height/2],[0,-c.height],[c.width,0],[0,c.height],[-c.width,0]]]},attributes:{}},m=this._getLabelDebugTemplate(),p=b.get(m.geometryType);m.writeMesh(d,p,"esriGeometryPolyline",h,c)}};a.prototype._getLabelDebugTemplate=function(){this._labelsDebugTemplate||(this._labelsDebugTemplate=this._createLabelsDebugTemplate());return this._labelsDebugTemplate};a.prototype._createLabelsDebugTemplate=function(){var a=new H({style:"solid",width:1,
color:[255,0,0,1]});return L.default.fromSimpleLine(null,!1,a,null)};return a}();y.WGLMeshFactory=v});