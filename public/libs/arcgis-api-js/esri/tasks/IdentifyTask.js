// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.12/esri/copyright.txt for details.
//>>built
define(["../request","../core/lang","../geometry/support/normalizeUtils","./Task","./support/IdentifyResult"],function(e,c,f,g,h){return g.createSubclass({declaredClass:"esri.tasks.IdentifyTask",properties:{gdbVersion:{value:null,type:String},parsedUrl:{get:function(){var a=this._parseUrl(this.url);a.path+="/identify";return a}},url:{}},execute:function(a,d){return f.normalizeCentralMeridian(a.geometry?[a.geometry]:[]).then(function(b){b=this._encode(c.mixin({},this.parsedUrl.query,{f:"json"},a.toJSON({geometry:b&&
b[0]})));this.gdbVersion&&(b.gdbVersion=this.gdbVersion);b={query:b};if(this.requestOptions||d)b=c.mixin({},this.requestOptions,d,b);return e(this.parsedUrl.path,b)}.bind(this)).then(this._handleExecuteResponse)},_handleExecuteResponse:function(a){a=a.data;a.results=(a.results||[]).map(function(a){return h.fromJSON(a)});return a}})});