// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.12/esri/copyright.txt for details.
//>>built
define("require exports ../../core/tsSupport/declareExtendsHelper ../../core/tsSupport/decorateHelper ../../core/Accessor ../../core/Evented ../../core/HandleOwner ../../core/ObjectPool ../../core/watchUtils ../../core/accessorSupport/decorators ./TemplateItem ./TemplateItemGroup".split(" "),function(w,x,m,g,n,p,q,k,r,e,l,t){var u=function(d){d=d.layer;return{key:d,label:d.title}},v=function(d){return d.layer.geometryType};return function(d){function b(a){a=d.call(this)||this;a._templateToLayer=new Map;
a._itemPool=new k(l);a._groupPool=new k(t);a.filterFunction=null;a.groupBy="layer";return a}m(b,d);b.prototype.destroy=function(){this._templateToLayer.clear();this._templateToLayer=null};Object.defineProperty(b.prototype,"layers",{get:function(){return this._get("layers")},set:function(a){var c=this;this.handles.removeAll();if(a){var b=function(){return c.notifyChange("state")};this.handles.add(a.map(function(a){return r.when(a,"loadStatus",b)}))}this._set("layers",a)},enumerable:!0,configurable:!0});
Object.defineProperty(b.prototype,"state",{get:function(){var a=this.layers;return a&&0!==a.length?a.some(function(a){return"loading"===a.loadStatus||"not-loaded"===a.loadStatus})?"loading":"ready":"disabled"},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"items",{get:function(){var a=this,c=this.layers;this._destroyItems(this._get("items"));if(!c||0===c.length)return[];this._templateToLayer.clear();var c=c.filter(function(a){var b=a.capabilities;return a.loaded&&b.operations.supportsEditing&&
b.operations.supportsAdd}).map(function(b){var c=a._getTemplatesForLayer(b);if(0<c.length)return c.forEach(function(c){return a._templateToLayer.set(c,b)}),c}).filter(function(a){return null!=a}),b=this.groupBy;if("none"===b)return c.map(function(b){return b.filter(function(b){b=b.name;return!a.filterFunction||a.filterFunction({label:b})})}).map(function(b){return b.map(function(b){return a._createItem(b)})}).reduce(function(a,b){return a.concat(b)},[]);c=c.reduce(function(c,d){d.forEach(function(d){var f=
("layer"===b?u:"geometry"===b?v:b)({template:d,layer:a._templateToLayer.get(d)});if(f){var h="string"===typeof f?f:f.key,f="string"===typeof f?f:f.label;c.has(h)||c.set(h,{label:f,templates:[]});c.get(h).templates.push(d)}});return c},new Map);if(0===c.size)return[];var d=[],e=this.filterFunction;c.forEach(function(b){var c=b.label,h=b.templates;!e||a.filterFunction(b)?d.push(a._createGroup(c,h.map(function(b){return a._createItem(b)}))):(b=h.filter(function(b){return a.filterFunction({label:b.name})}).map(function(b){return a._createItem(b)}),
0<b.length&&d.push(a._createGroup(c,b)))});return d},enumerable:!0,configurable:!0});b.prototype.refresh=function(){this.notifyChange("items")};b.prototype.select=function(a){a=a.clone();this.emit("select",{item:a,template:a.template})};b.prototype._getTemplatesForLayer=function(a){var b=a.templates||[];a=(a.types||[]).map(function(a){return a.templates}).reduce(function(a,b){return a.concat(b)},[]);return b.concat(a)};b.prototype._createItem=function(a){var b=this._itemPool.acquire();b.set({template:a,
layer:this._templateToLayer.get(a)});return b};b.prototype._createGroup=function(a,b){var c=this._groupPool.acquire();c.set("label",a);c.items=b;return c};b.prototype._destroyItems=function(a){var b=this;a&&(a[0]instanceof l?a.forEach(function(a){return b._destroyItem(a)}):a.forEach(function(a){return b._destroyGroup(a)}))};b.prototype._destroyGroup=function(a){var b=this;a.items.forEach(function(a){return b._itemPool.release(a)});a.items.length=0;this._groupPool.release(a)};b.prototype._destroyItem=
function(a){this._itemPool.release(a)};g([e.property()],b.prototype,"filterFunction",void 0);g([e.property()],b.prototype,"groupBy",void 0);g([e.property()],b.prototype,"layers",null);g([e.property({dependsOn:["layers"]})],b.prototype,"state",null);g([e.property({dependsOn:["filterFunction","groupBy","layers","state"],readOnly:!0})],b.prototype,"items",null);return b=g([e.subclass("esri.widgets.FeatureTemplates.FeatureTemplatesViewModel")],b)}(e.declared(n,q,p))});