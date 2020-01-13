// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.12/esri/copyright.txt for details.
//>>built
define(["require","exports","../Feature","../languageUtils"],function(k,g,h,b){Object.defineProperty(g,"__esModule",{value:!0});g.registerFunctions=function(c){"async"===c.mode&&(c.functions.domainname=function(e,f){return c.standardFunctionAsync(e,f,function(c,d,a){b.pcCheck(a,2,4);if(a[0]instanceof h)return a[0].domainValueLookup(b.toString(a[1]),a[2],void 0===a[3]?void 0:b.toNumber(a[3]));if(b.isFeatureSet(a[0]))return a[0]._ensureLoaded().then(function(){var c=b.getDomain(b.toString(a[1]),a[0],
null,void 0===a[3]?void 0:b.toNumber(a[3]));return b.getDomainValue(c,a[2])});throw Error("Invalid Parameter");})},c.signatures.push({name:"domainname",min:"2",max:"4"}),c.functions.domaincode=function(e,f){return c.standardFunctionAsync(e,f,function(c,d,a){b.pcCheck(a,2,4);if(a[0]instanceof h)return a[0].domainCodeLookup(b.toString(a[1]),a[2],void 0===a[3]?void 0:b.toNumber(a[3]));if(b.isFeatureSet(a[0]))return a[0]._ensureLoaded().then(function(){var c=b.getDomain(b.toString(a[1]),a[0],null,void 0===
a[3]?void 0:b.toNumber(a[3]));return b.getDomainCode(c,a[2])});throw Error("Invalid Parameter");})},c.signatures.push({name:"domaincode",min:"2",max:"4"}));c.functions.text=function(e,f){return c.standardFunctionAsync(e,f,function(c,d,a){b.pcCheck(a,1,2);if(b.isFeatureSet(a[0])){d=b.defaultUndefined(a[2],"");if(""===d)return a[0].castToText();if("schema"===d.toLowerCase())return a[0].convertToText("schema",c.abortSignal);if("featureset"===d.toLowerCase())return a[0].convertToText("featureset",c.abortSignal)}else return b.toStringExplicit(a[0],
a[1])})}}});