// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.12/esri/copyright.txt for details.
//>>built
define("require exports ../../core/tsSupport/declareExtendsHelper ../../core/tsSupport/decorateHelper ../../Color ../../core/JSONSupport ../../core/lang ../../core/accessorSupport/decorators ./materialUtils".split(" "),function(b,a,g,e,h,k,l,d,f){Object.defineProperty(a,"__esModule",{value:!0});b=function(b){function c(){var a=null!==b&&b.apply(this,arguments)||this;a.color=new h([0,0,0,1]);a.size=0;return a}g(c,b);a=c;c.prototype.clone=function(){return new a({color:l.clone(this.color),size:this.size})};
var a;e([d.property(f.colorAndTransparencyProperty)],c.prototype,"color",void 0);e([d.property(f.screenSizeProperty)],c.prototype,"size",void 0);return c=a=e([d.subclass("esri.symbols.support.Symbol3DHalo")],c)}(d.declared(k));a.Symbol3DHalo=b;a.default=b});