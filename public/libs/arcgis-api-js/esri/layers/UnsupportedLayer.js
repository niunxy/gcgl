// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.12/esri/copyright.txt for details.
//>>built
define("require exports ../core/tsSupport/declareExtendsHelper ../core/tsSupport/decorateHelper ../core/Error ../core/lang ../core/MultiOriginJSONSupport ../core/promiseUtils ../core/scheduling ../core/accessorSupport/decorators ./Layer ./mixins/PortalLayer".split(" "),function(q,r,f,c,g,h,k,l,m,d,n,p){return function(e){function a(b){b=e.call(this)||this;b.resourceInfo=null;b.type="unsupported";return b}f(a,e);a.prototype.initialize=function(){var b=this;this.addResolvingPromise(l.create(function(a,
d){m.schedule(function(){var a=b.resourceInfo&&(b.resourceInfo.layerType||b.resourceInfo.type),c="Unsupported layer type";a&&(c+=" "+a);d(new g("layer:unsupported-layer-type",c,{layerType:a}))})}))};a.prototype.read=function(b,a){var c={resourceInfo:b};null!=b.id&&(c.id=b.id);null!=b.title&&(c.title=b.title);this.inherited(arguments,[c,a])};a.prototype.write=function(a,c){return h.mixin(a||{},this.resourceInfo,{id:this.id})};c([d.shared("esri.layers.UnsupportedLayer")],a.prototype,"declaredClass",
void 0);c([d.property({readOnly:!0})],a.prototype,"resourceInfo",void 0);c([d.property({type:["show","hide"]})],a.prototype,"listMode",void 0);c([d.property({json:{read:!1},readOnly:!0,value:"unsupported"})],a.prototype,"type",void 0);return a=c([d.subclass("esri.layers.UnsupportedLayer")],a)}(d.declared(n,k,p))});