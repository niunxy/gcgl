// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.12/esri/copyright.txt for details.
//>>built
define("require exports ../core/tsSupport/declareExtendsHelper ../core/tsSupport/decorateHelper ../core/Error ../core/JSONSupport ../core/promiseUtils ../core/accessorSupport/decorators ./PortalFolder ./PortalGroup".split(" "),function(l,q,m,d,g,n,f,c,p,h){return function(k){function b(){var a=k.call(this)||this;a.access=null;a.created=null;a.culture=null;a.description=null;a.email=null;a.fullName=null;a.modified=null;a.orgId=null;a.portal=null;a.preferredView=null;a.privileges=null;a.region=null;
a.role=null;a.roleId=null;a.units=null;a.username=null;a.userType=null;return a}m(b,k);Object.defineProperty(b.prototype,"thumbnailUrl",{get:function(){var a=this.url,b=this.thumbnail;return a&&b?this.portal._normalizeUrl(a+"/info/"+b+"?f\x3djson"):null},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"userContentUrl",{get:function(){var a=this.get("portal.restUrl");return a?a+"/content/users/"+this.username:null},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,
"url",{get:function(){var a=this.get("portal.restUrl");return a?a+"/community/users/"+this.username:null},enumerable:!0,configurable:!0});b.prototype.addItem=function(a){var b=this,e=a&&a.item,c=a&&a.data;a=a&&a.folder;var d={method:"post"};e&&(d.query=e._getPostQuery(),null!=c&&("string"===typeof c?d.query.text=c:"object"===typeof c&&(d.query.text=JSON.stringify(c))));c=this.userContentUrl;a&&(c+="/"+("string"===typeof a?a:a.id));return this.portal._request(c+"/addItem",d).then(function(a){e.id=
a.id;e.portal=b.portal;return e.loaded?e._reload():e.load()})};b.prototype.deleteItem=function(a){var b=this.userContentUrl;a.ownerFolder&&(b+="/"+a.ownerFolder);return this.portal._request(b+("/items/"+a.id+"/delete"),{method:"post"}).then(function(){a.id=null;a.portal=null})};b.prototype.deleteItems=function(a){var b=this.userContentUrl+"/deleteItems",c=a.map(function(a){return a.id});return c.length?(c={method:"post",query:{items:c.join(",")}},this.portal._request(b,c).then(function(){a.forEach(function(a){a.id=
null;a.portal=null})})):f.resolve(void 0)};b.prototype.fetchFolders=function(){var a=this;return this.portal._request(this.userContentUrl,{query:{num:1}}).then(function(b){return b&&b.folders?b.folders.map(function(b){b=p.fromJSON(b);b.portal=a.portal;return b}):[]})};b.prototype.fetchGroups=function(){var a=this;return this.portal._request(this.url).then(function(b){return b&&b.groups?b.groups.map(function(b){b=h.fromJSON(b);b.portal=a.portal;return b}):[]})};b.prototype.fetchItems=function(a){var b=
this;a||(a={});var c=this.userContentUrl;a.folder&&(c+="/"+a.folder.id);var d;return f.create(function(a){return l(["./PortalItem"],a)}).then(function(e){d=e;return b.portal._request(c,{query:{folders:!1,num:a.num||10,start:a.start||1}})}).then(function(a){var c;return a&&a.items?(c=a.items.map(function(a){a=d.fromJSON(a);a.portal=b.portal;return a}),f.all(c.map(function(a){return a.load()})).catch(function(a){return a}).then(function(){return{items:c,nextStart:a.nextStart,total:a.total}})):{items:[],
nextStart:-1,total:0}})};b.prototype.getThumbnailUrl=function(a){var b=this.thumbnailUrl;b&&a&&(b+="\x26w\x3d"+a);return b};b.prototype.queryFavorites=function(a){return this.favGroupId?(this._favGroup||(this._favGroup=new h({id:this.favGroupId,portal:this.portal})),this._favGroup.queryItems(a)):f.reject(new g("internal:unknown","Unknown internal error",{internalError:"Unknown favGroupId"}))};b.prototype.toJSON=function(){throw new g("internal:not-yet-implemented","PortalGroup.toJSON is not yet implemented");
};d([c.property()],b.prototype,"access",void 0);d([c.property({type:Date})],b.prototype,"created",void 0);d([c.property()],b.prototype,"culture",void 0);d([c.property()],b.prototype,"description",void 0);d([c.property()],b.prototype,"email",void 0);d([c.property()],b.prototype,"favGroupId",void 0);d([c.property()],b.prototype,"fullName",void 0);d([c.property({type:Date})],b.prototype,"modified",void 0);d([c.property()],b.prototype,"orgId",void 0);d([c.property()],b.prototype,"portal",void 0);d([c.property()],
b.prototype,"preferredView",void 0);d([c.property()],b.prototype,"privileges",void 0);d([c.property()],b.prototype,"region",void 0);d([c.property()],b.prototype,"role",void 0);d([c.property()],b.prototype,"roleId",void 0);d([c.property()],b.prototype,"thumbnail",void 0);d([c.property({dependsOn:["url","thumbnail","portal.credential.token"],readOnly:!0})],b.prototype,"thumbnailUrl",null);d([c.property()],b.prototype,"units",void 0);d([c.property({dependsOn:["portal.restUrl"],readOnly:!0})],b.prototype,
"userContentUrl",null);d([c.property({dependsOn:["portal.restUrl"],readOnly:!0})],b.prototype,"url",null);d([c.property()],b.prototype,"username",void 0);d([c.property()],b.prototype,"userType",void 0);return b=d([c.subclass("esri.portal.PortalUser")],b)}(c.declared(n))});