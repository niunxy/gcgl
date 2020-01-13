// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.12/esri/copyright.txt for details.
//>>built
define(["../../core/declare","../../Graphic","../../geometry/Polyline","./TrackManager"],function(p,q,r,t){return p([t],{declaredClass:"esri.layers.support.StreamTrackManager",constructor:function(a){this.inherited(arguments)},initialize:function(a){this.inherited(arguments)},addFeatures:function(a,e){function g(b,d){var c,k,a;h[b]||(h[b]=[]);b=h[b];0<f&&(d.length>f&&d.splice(0,d.length-f),k=d.length+b.length,k>f&&(c=b.splice(0,k-f)));k=d.length;for(a=0;a<k;a+=1)b.push(d[a]);return{deletes:c,adds:d}}
var h,b,k,f,c={},d={},m;if(e)return this.inherited(arguments),c;h=this.trackMap;b=this.layer;k=b._trackIdField;f=b.maximumTrackPoints||0;a.forEach(function(b){var a=b.attributes[k];b.visible&&(d[a]||(d[a]=[]),d[a].push(b))});for(m in d)d.hasOwnProperty(m)&&(b=g(m,d[m]),c[m]=b);return c},removeFeatures:function(a){var e=[],g=this.layer.objectIdField,h=this.layer._trackIdField;a&&(a.forEach(function(b){var a,f,c,d;f=b.attributes[h];a=b.attributes[g];if(c=this.trackMap[f])for(b=0;b<c.length;b+=1)if(d=
c[b],d.attributes[g]===a){this.trackMap[f].splice(b,1);e.push(f);break}},this),0<a.length&&this.refreshTracks(e))},drawTracks:function(a){function e(d){var a=b[d],c=a&&1<a.length,e,n,l;(l=g.trackLineMap[d])&&!c&&(h.remove(l),delete g.trackLineMap[d],l=null);if(!c)return!1;c=[];for(e=a.length-1;0<=e;--e)(n=a[e].geometry)&&c.push([n.x,n.y]);a={};a[f]=d;1<c.length&&(l?(d=l.geometry,d.removePath(0),d.addPath(c),l.setGeometry(d)):(l=new q(new r({paths:[c],spatialReference:k}),null,a),h.add(l),g.trackLineMap[d]=
l))}var g=this,h=this.container,b,k,f,c;if(h)if(b=this.trackMap,k=this.map.spatialReference,f=this.layer._trackIdField,a)a.forEach(function(a){e(a)});else for(c in b)b.hasOwnProperty(c)&&e(c)},refreshTracks:function(a){function e(a){var b,c;a=g[a]||[];b=a.length;for(c=0;c<b;c++)h._repaint(a[c],null,!0)}var g=this.trackMap,h=this.layer,b;this.drawTracks(a);if(a)a.forEach(function(a){e(a)});else for(b in g)g.hasOwnProperty(b)&&e(b)},destroy:function(){this.inherited(arguments);this.trackLineMap=null}})});