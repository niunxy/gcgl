// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.12/esri/copyright.txt for details.
//>>built
define("require exports ../core/tsSupport/declareExtendsHelper ../core/tsSupport/decorateHelper ../core/Identifiable ../core/JSONSupport ../core/lang ../core/accessorSupport/decorators ../core/accessorSupport/ensureType ../geometry/Extent ../webdoc/support/Thumbnail".split(" "),function(q,r,h,d,k,l,m,c,n,p,e){return function(g){function b(a){a=g.call(this)||this;a.extent=null;a.name=null;a.thumbnail=new e.default;return a}h(b,g);f=b;b.prototype.castThumbnail=function(a){return"string"===typeof a?
new e.default({url:a}):n.ensureType(e.default,a)};b.prototype.clone=function(){return new f(m.clone({extent:this.extent,name:this.name,thumbnail:this.thumbnail}))};var f;d([c.property({type:p,nonNullable:!0,json:{write:{isRequired:!0}}})],b.prototype,"extent",void 0);d([c.property({type:String,nonNullable:!0,json:{write:{isRequired:!0}}})],b.prototype,"name",void 0);d([c.property({type:e.default,json:{write:{overridePolicy:function(a){return{enabled:!(!a||!a.url)}}}}})],b.prototype,"thumbnail",void 0);
d([c.cast("thumbnail")],b.prototype,"castThumbnail",null);return b=f=d([c.subclass("esri.webmap.Bookmark")],b)}(c.declared(l,k.Identifiable))});