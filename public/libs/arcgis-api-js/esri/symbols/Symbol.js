// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.12/esri/copyright.txt for details.
//>>built
define("require exports ../core/tsSupport/declareExtendsHelper ../core/tsSupport/decorateHelper ../core/tsSupport/generatorHelper ../core/tsSupport/awaiterHelper ../Color ../core/jsonMap ../core/JSONSupport ../core/accessorSupport/decorators".split(" "),function(q,r,h,d,k,l,f,m,n,c){var e=new m.default({esriSMS:"simple-marker",esriPMS:"picture-marker",esriSLS:"simple-line",esriSFS:"simple-fill",esriPFS:"picture-fill",esriTS:"text",esriSHD:"shield-label-symbol",PointSymbol3D:"point-3d",LineSymbol3D:"line-3d",
PolygonSymbol3D:"polygon-3d",MeshSymbol3D:"mesh-3d",LabelSymbol3D:"label-3d",CIMSymbolReference:"cim"}),p=0;return function(g){function b(a){a=g.call(this,a)||this;a.id="sym"+p++;a.type=null;return a}h(b,g);Object.defineProperty(b.prototype,"color",{set:function(a){this._set("color",a)},enumerable:!0,configurable:!0});b.prototype.readColor=function(a,b,c){return a&&null!=a[0]?[a[0],a[1],a[2],a[3]/255]:a};b.prototype.collectRequiredFields=function(a,b){return l(this,void 0,void 0,function(){return k(this,
function(a){return[2]})})};b.prototype.clone=function(){};d([c.property({type:e.apiValues,json:{read:e.read,write:{ignoreOrigin:!0,writer:e.write}}})],b.prototype,"type",void 0);d([c.property({type:f,value:new f([0,0,0,1]),json:{write:{allowNull:!0}}})],b.prototype,"color",null);d([c.reader("color")],b.prototype,"readColor",null);return b=d([c.subclass("esri.symbols.Symbol")],b)}(c.declared(n))});