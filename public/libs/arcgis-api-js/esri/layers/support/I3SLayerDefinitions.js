// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.12/esri/copyright.txt for details.
//>>built
define("require exports ../../core/tsSupport/declareExtendsHelper ../../core/tsSupport/decorateHelper ../../core/JSONSupport ../../core/accessorSupport/decorators".split(" "),function(h,f,g,c,e,b){Object.defineProperty(f,"__esModule",{value:!0});h=function(d){function a(){var a=null!==d&&d.apply(this,arguments)||this;a.nodesPerPage=null;a.rootIndex=0;a.lodSelectionMetricType=null;return a}g(a,d);c([b.property({type:Number})],a.prototype,"nodesPerPage",void 0);c([b.property({type:Number})],a.prototype,
"rootIndex",void 0);c([b.property({type:String})],a.prototype,"lodSelectionMetricType",void 0);return a=c([b.subclass("esri.layer.support.I3SNodePageDefinition")],a)}(b.declared(e));f.I3SNodePageDefinition=h;var l=function(d){function a(){var a=null!==d&&d.apply(this,arguments)||this;a.factor=1;return a}g(a,d);c([b.property({type:Number})],a.prototype,"textureSetDefinitionId",void 0);c([b.property({type:Number})],a.prototype,"factor",void 0);return a=c([b.subclass("esri.layer.support.I3SMaterialTexture")],
a)}(b.declared(e));f.I3SMaterialTexture=l;var m=function(d){function a(){var a=null!==d&&d.apply(this,arguments)||this;a.baseColorFactor=[1,1,1,1];a.baseColorTexture=null;a.metallicRoughnessTexture=null;a.metallicFactor=1;a.roughnessFactor=1;return a}g(a,d);c([b.property({type:[Number]})],a.prototype,"baseColorFactor",void 0);c([b.property({type:l})],a.prototype,"baseColorTexture",void 0);c([b.property({type:l})],a.prototype,"metallicRoughnessTexture",void 0);c([b.property({type:Number})],a.prototype,
"metallicFactor",void 0);c([b.property({type:Number})],a.prototype,"roughnessFactor",void 0);return a=c([b.subclass("esri.layer.support.I3SMaterialPBRMetallicRoughness")],a)}(b.declared(e));f.I3SMaterialPBRMetallicRoughness=m;h=function(d){function a(){var a=null!==d&&d.apply(this,arguments)||this;a.alphaMode="opaque";a.alphaCutoff=.25;a.doubleSided=!1;a.cullFace="none";a.normalTexture=null;a.occlusionTexture=null;a.emissiveTexture=null;a.emissiveFactor=null;a.pbrMetallicRoughness=null;return a}g(a,
d);c([b.enumeration.serializable()({opaque:"opaque",mask:"mask",blend:"blend"})],a.prototype,"alphaMode",void 0);c([b.property({type:Number})],a.prototype,"alphaCutoff",void 0);c([b.property({type:Boolean})],a.prototype,"doubleSided",void 0);c([b.enumeration.serializable()({none:"none",back:"back",front:"front"})],a.prototype,"cullFace",void 0);c([b.property({type:l})],a.prototype,"normalTexture",void 0);c([b.property({type:l})],a.prototype,"occlusionTexture",void 0);c([b.property({type:l})],a.prototype,
"emissiveTexture",void 0);c([b.property({type:[Number]})],a.prototype,"emissiveFactor",void 0);c([b.property({type:m})],a.prototype,"pbrMetallicRoughness",void 0);return a=c([b.subclass("esri.layer.support.I3SMaterialDefinition")],a)}(b.declared(e));f.I3SMaterialDefinition=h;var n=function(d){function a(){return null!==d&&d.apply(this,arguments)||this}g(a,d);c([b.property({type:String,json:{read:{source:["name","index"],reader:function(a,b){return null!=a?a:""+b.index}}}})],a.prototype,"name",void 0);
c([b.enumeration.serializable()({jpg:"jpg",png:"png",dds:"dds","ktx-etc2":"ktx-etc2"})],a.prototype,"format",void 0);return a=c([b.subclass("esri.layer.support.I3STextureFormat")],a)}(b.declared(e));f.I3STextureFormat=n;h=function(d){function a(){var a=null!==d&&d.apply(this,arguments)||this;a.atlas=!1;return a}g(a,d);c([b.property({type:[n]})],a.prototype,"formats",void 0);c([b.property({type:Boolean})],a.prototype,"atlas",void 0);return a=c([b.subclass("esri.layer.support.I3STextureSetDefinition")],
a)}(b.declared(e));f.I3STextureSetDefinition=h;var k=function(d){function a(){return null!==d&&d.apply(this,arguments)||this}g(a,d);c([b.enumeration.serializable()({Float32:"Float32",UInt64:"UInt64",UInt32:"UInt32",UInt16:"UInt16",UInt8:"UInt8"})],a.prototype,"type",void 0);c([b.property({type:Number})],a.prototype,"component",void 0);return a=c([b.subclass("esri.layer.support.I3SGeometryAttribute")],a)}(b.declared(e));f.I3SGeometryAttribute=k;var p=function(d){function a(){return null!==d&&d.apply(this,
arguments)||this}g(a,d);c([b.enumeration.serializable()({draco:"draco"})],a.prototype,"encoding",void 0);c([b.property({type:[String]})],a.prototype,"attributes",void 0);return a=c([b.subclass("esri.layer.support.I3SGeometryAttribute")],a)}(b.declared(e));f.I3SGeometryCompressedAttributes=p;h=function(d){function a(){var a=null!==d&&d.apply(this,arguments)||this;a.offset=0;return a}g(a,d);c([b.property({type:Number})],a.prototype,"offset",void 0);c([b.property({type:k})],a.prototype,"position",void 0);
c([b.property({type:k})],a.prototype,"normal",void 0);c([b.property({type:k})],a.prototype,"uv0",void 0);c([b.property({type:k})],a.prototype,"color",void 0);c([b.property({type:k})],a.prototype,"uvRegion",void 0);c([b.property({type:k})],a.prototype,"featureId",void 0);c([b.property({type:k})],a.prototype,"faceRange",void 0);c([b.property({type:p})],a.prototype,"compressedAttributes",void 0);return a=c([b.subclass("esri.layer.support.I3SGeometryBuffer")],a)}(b.declared(e));f.I3SGeometryBuffer=h;
e=function(d){function a(){return null!==d&&d.apply(this,arguments)||this}g(a,d);c([b.enumeration.serializable()({triangle:"triangle"})],a.prototype,"topology",void 0);c([b.property()],a.prototype,"geometryBuffers",void 0);return a=c([b.subclass("esri.layer.support.I3SMeshDefinition")],a)}(b.declared(e));f.I3SGeometryDefinition=e});