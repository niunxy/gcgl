// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.12/esri/copyright.txt for details.
//>>built
define("require exports ../core/tsSupport/declareExtendsHelper ../core/tsSupport/decorateHelper ../core/tsSupport/paramHelper ../core/lang ../core/accessorSupport/decorators ./Renderer ./support/stretchRendererUtils ../tasks/support/ColorRamp ../tasks/support/colorRamps".split(" "),function(p,q,k,d,r,f,c,l,e,m,n){return function(g){function a(){var b=null!==g&&g.apply(this,arguments)||this;b.colorRamp=null;b.computeGamma=!1;b.dynamicRangeAdjustment=!0;b.gamma=[];b.maxPercent=null;b.minPercent=null;
b.numberOfStandardDeviations=null;b.outputMax=null;b.outputMin=null;b.sigmoidStrengthLevel=null;b.statistics=[];b.useGamma=!1;b.stretchType="none";b.type="raster-stretch";return b}k(a,g);h=a;a.prototype.readColorRamp=function(b,a){if(b)return n.fromJSON(b)};a.prototype.writeStatistics=function(b,a,c){null==b||0===b.length?b=null:b[0]instanceof Array||(b=b.map(function(a){return[a.min,a.max,a.avg,a.stddev]}));a[c]=b};a.prototype.clone=function(){return new h({stretchType:this.stretchType,outputMin:this.outputMin,
outputMax:this.outputMax,useGamma:this.useGamma,computeGamma:this.computeGamma,statistics:f.clone(this.statistics),gamma:f.clone(this.gamma),sigmoidStrengthLevel:this.sigmoidStrengthLevel,numberOfStandardDeviations:this.numberOfStandardDeviations,minPercent:this.minPercent,maxPercent:this.maxPercent,colorRamp:f.clone(this.colorRamp),dynamicRangeAdjustment:this.dynamicRangeAdjustment})};var h;d([c.property({type:m,json:{write:!0}})],a.prototype,"colorRamp",void 0);d([c.reader("colorRamp")],a.prototype,
"readColorRamp",null);d([c.property({type:Boolean,json:{write:!0}})],a.prototype,"computeGamma",void 0);d([c.property({type:Boolean,json:{write:{target:"dra"},read:{source:"dra"}}})],a.prototype,"dynamicRangeAdjustment",void 0);d([c.property({type:[Number],json:{write:{allowNull:!0}}})],a.prototype,"gamma",void 0);d([c.property({type:Number,json:{write:{allowNull:!0}}})],a.prototype,"maxPercent",void 0);d([c.property({type:Number,json:{write:{allowNull:!0}}})],a.prototype,"minPercent",void 0);d([c.property({type:Number,
json:{write:{allowNull:!0}}})],a.prototype,"numberOfStandardDeviations",void 0);d([c.property({type:Number,json:{read:{source:"max"},write:{target:"max",allowNull:!0}}})],a.prototype,"outputMax",void 0);d([c.property({type:Number,json:{read:{source:"min"},write:{target:"min",allowNull:!0}}})],a.prototype,"outputMin",void 0);d([c.property({type:Number,json:{write:{allowNull:!0}}})],a.prototype,"sigmoidStrengthLevel",void 0);d([c.property({json:{write:{allowNull:!0}}})],a.prototype,"statistics",void 0);
d([c.writer("statistics")],a.prototype,"writeStatistics",null);d([c.property({type:Boolean,json:{write:!0}})],a.prototype,"useGamma",void 0);d([c.property({type:e.stretchTypeJSONDict.apiValues,json:{type:e.stretchTypeJSONDict.jsonValues,read:e.stretchTypeJSONDict.read,write:e.stretchTypeJSONDict.write}})],a.prototype,"stretchType",void 0);d([c.enumeration.serializable()({rasterStretch:"raster-stretch"})],a.prototype,"type",void 0);return a=h=d([c.subclass("esri.renderers.StretchRenderer")],a)}(c.declared(l))});