// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.12/esri/copyright.txt for details.
//>>built
define("require exports ../../core/tsSupport/declareExtendsHelper ../../core/tsSupport/decorateHelper ../../core/jsonMap ../../core/JSONSupport ../../core/accessorSupport/decorators ../../core/accessorSupport/ensureType ./domains ./fieldType".split(" "),function(q,r,g,c,h,k,b,l,e,m){var n=new h.default({binary:"binary",coordinate:"coordinate",countOrAmount:"count-or-amount",dateAndTime:"date-and-time",description:"description",locationOrPlaceName:"location-or-place-name",measurement:"measurement",
nameOrTitle:"name-or-title",none:"none",orderedOrRanked:"ordered-or-ranked",percentageOrRatio:"percentage-or-ratio",typeOrCategory:"type-or-category",uniqueIdentifier:"unique-identifier"});return function(f){function a(a){a=f.call(this)||this;a.alias=null;a.defaultValue=void 0;a.description=null;a.domain=null;a.editable=!0;a.length=-1;a.name=null;a.nullable=!0;a.type=null;a.valueType=null;return a}g(a,f);d=a;a.prototype.readDescription=function(a,b){a=b.description;var c;try{c=JSON.parse(a)}catch(p){}return c?
c.value:null};a.prototype.readValueType=function(a,c){a=c.description;var b;try{b=JSON.parse(a)}catch(p){}return b?n.fromJSON(b.fieldValueType):null};a.prototype.clone=function(){return new d({alias:this.alias,defaultValue:this.defaultValue,description:this.description,domain:this.domain&&this.domain.clone()||null,editable:this.editable,length:this.length,name:this.name,nullable:this.nullable,type:this.type,valueType:this.valueType})};var d;c([b.property({type:String,json:{write:!0}})],a.prototype,
"alias",void 0);c([b.property({type:[String,Number],json:{write:{allowNull:!0}}})],a.prototype,"defaultValue",void 0);c([b.property()],a.prototype,"description",void 0);c([b.reader("description")],a.prototype,"readDescription",null);c([b.property({types:e.types,json:{read:{reader:e.fromJSON},write:!0}})],a.prototype,"domain",void 0);c([b.property({type:Boolean,json:{write:!0}})],a.prototype,"editable",void 0);c([b.property({type:l.Integer,json:{write:!0}})],a.prototype,"length",void 0);c([b.property({type:String,
json:{write:!0}})],a.prototype,"name",void 0);c([b.property({type:Boolean,json:{write:!0}})],a.prototype,"nullable",void 0);c([b.enumeration.serializable()(m.kebabDict)],a.prototype,"type",void 0);c([b.property()],a.prototype,"valueType",void 0);c([b.reader("valueType",["description"])],a.prototype,"readValueType",null);return a=d=c([b.subclass("esri.layers.support.Field")],a)}(b.declared(k))});