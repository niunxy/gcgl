// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.12/esri/copyright.txt for details.
//>>built
define("require exports ../../../../core/tsSupport/declareExtendsHelper ../../../../core/tsSupport/decorateHelper ../../../../core/tsSupport/assignHelper ../../../../Graphic ../../../../core/Accessor ../../../../core/asyncUtils ../../../../core/Collection ../../../../core/Handles ../../../../core/promiseUtils ../../../../core/watchUtils ../../../../core/accessorSupport/decorators ../../../../layers/Layer ../../../../layers/graphics/dehydratedFeatures ../../../../tasks/support/Query ./constants ./Graphics3DCore ./Graphics3DElevationAlignment ./Graphics3DHighlights ./Graphics3DScaleVisibility ./graphicUtils".split(" "),
function(E,F,l,d,e,f,m,n,p,q,g,r,c,t,u,v,w,x,y,z,A,B){var h={remove:function(){},pause:function(){},resume:function(){}};return function(k){function a(b){b=k.call(this)||this;b.graphicsCore=null;b.elevationAlignment=new y;b.highlights=new z;b.handles=new q;b.suspendResumeExtent=null;return b}l(a,k);a.prototype.normalizeCtorArgs=function(b){var a=null;b.scaleVisibilityEnabled&&(b=e({},b),delete b.scaleVisibilityEnabled,a=new A);var D=new x({owner:b.owner,layer:b.layer,asyncUpdates:!1,graphicSymbolSupported:!0});
return e({},b,{graphicsCore:D,scaleVisibility:a})};a.prototype.initialize=function(){var b=this;this.scaleVisibility&&"minScale"in this.layer&&this.handles.add(this.layer.watch(["minScale","maxScale"],function(){return b.scaleVisibility.layerMinMaxScaleChangeHandler()}))};a.prototype.setup=function(){var b=this,a=function(a,C,c){return b.graphicsCore.spatialIndex.queryGraphicUIDsInExtent(a,C,c)};this.elevationAlignment.setup(this.owner,a,this.graphicsCore,this.view.elevationProvider);this.scaleVisibility&&
"minScale"in this.layer&&this.scaleVisibility.setup(this.owner,this.layer,a,this.graphicsCore,this.owner.view.basemapTerrain);this.highlights&&this.highlights.setup(this.graphicsCore);this.graphicsCore.setup({elevationAlignment:this.elevationAlignment,scaleVisibility:this.scaleVisibility,highlights:this.highlights});this.handles.add(this.view.watch("clippingArea",function(){return b.updateClippingExtent()}));this.updateClippingExtent();this.setupSuspendResumeExtent();this.graphicsCore.startCreateGraphics()};
a.prototype.destroy=function(){this.handles&&(this.handles.destroy(),this.handles=null);this.elevationAlignment&&(this.elevationAlignment.destroy(),this._set("elevationAlignment",null));this.scaleVisibility&&(this.scaleVisibility.destroy(),this._set("scaleVisibility",null));this.graphicsCore&&(this.graphicsCore.destroy(),this._set("graphicsCore",null));this.highlights&&(this.highlights.destroy(),this._set("highlights",null))};Object.defineProperty(a.prototype,"suspended",{get:function(){return!(!this.scaleVisibility||
!this.scaleVisibility.suspended)},enumerable:!0,configurable:!0});Object.defineProperty(a.prototype,"updating",{get:function(){return!!(this.graphicsCore&&this.graphicsCore.updating||this.scaleVisibility&&this.scaleVisibility.updating)},enumerable:!0,configurable:!0});a.prototype.getGraphicFromGraphicUid=function(b){if(this.owner.loadedGraphics){var a=this.owner.loadedGraphics.find(function(a){return a.uid===b});if(a)return u.hydrateGraphic(a,this.layer instanceof t?this.layer:null)}};a.prototype.whenGraphicBounds=
function(b,a){return this.graphicsCore?this.graphicsCore.whenGraphicBounds(b,a):g.reject()};a.prototype.whenSymbolLayerSize=function(b,a){return this.graphicsCore?n.safeCast(this.graphicsCore.whenSymbolLayerSize(b,a)):g.reject()};a.prototype.highlight=function(b,a){void 0===a&&(a={});if(b instanceof v)return h;if("number"===typeof b||b instanceof f)return this.highlight([b],a);b instanceof p&&(b=b.toArray());if(Array.isArray(b)&&0<b.length){if(b[0]instanceof f){b=b.map(function(a){return a.uid});
var c=this.highlights.acquireSet(a,null);a=c.set;c=c.handle;this.highlights.setUids(a,b);return c}if("number"===typeof b[0])return c=this.highlights.acquireSet(a,null),a=c.set,c=c.handle,this.highlights.setObjectIds(a,b),c}return h};a.prototype.updateClippingExtent=function(){this.graphicsCore.setClippingExtent(this.view.clippingArea,this.view.spatialReference)&&this.graphicsCore.recreateAllGraphics()};a.prototype.setupSuspendResumeExtent=function(){var a=this;this.scaleVisibility&&r.init(this.graphicsCore,
"computedExtent",function(b){a.suspendResumeExtent=B.enlargeExtent(b,a.suspendResumeExtent,w.SUSPEND_RESUME_EXTENT_OPTIMISM);a.scaleVisibility.setExtent(a.suspendResumeExtent)},!0)};d([c.property({constructOnly:!0})],a.prototype,"owner",void 0);d([c.property({constructOnly:!0})],a.prototype,"layer",void 0);d([c.property({readOnly:!0,aliasOf:"owner.view"})],a.prototype,"view",void 0);d([c.property({constructOnly:!0})],a.prototype,"graphicsCore",void 0);d([c.property({constructOnly:!0})],a.prototype,
"scaleVisibility",void 0);d([c.property({readOnly:!0})],a.prototype,"elevationAlignment",void 0);d([c.property({readOnly:!0})],a.prototype,"highlights",void 0);d([c.property({readOnly:!0,dependsOn:["scaleVisibility.suspended"]})],a.prototype,"suspended",null);d([c.property({readOnly:!0,dependsOn:["graphicsCore.updating","scaleVisibility.updating"]})],a.prototype,"updating",null);return a=d([c.subclass("esri.views.3d.layers.graphics.Graphics3DGraphicLikeLayerView")],a)}(c.declared(m))});