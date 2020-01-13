// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.12/esri/copyright.txt for details.
//>>built
define("require exports ../../../../../core/Logger ../../../../../core/libs/gl-matrix-2/vec2f32 ../definitions ./BoundingBox ../util/serializationUtils".split(" "),function(h,k,l,m,f,q,r){Object.defineProperty(k,"__esModule",{value:!0});var n=l.getLogger("esri/views/2d/engine/webgl/collisions/Metric");h=function(){function d(a,b,c,e,g){this.id=a;this.range=b;this.boxes=null;this.minZoom=-1;this.offsetY=this.offsetX=this.directionY=this.directionX=this.size=0;this.anchor=m.vec2f32.fromValues(c,e);
this.baseZoom=g}d.prototype.add=function(a){this.bounds?(this.boxes?this.boxes.push(a):(this.boxes=[this.bounds,a],this.bounds=this.bounds.clone()),this.bounds.extend(a)):this.bounds=a};d.prototype.computeIndex=function(){var a=this.bounds,b=this.anchor[0],c=this.anchor[1],e=Math.floor(b/f.COLLISION_BUCKET_SIZE),g=Math.floor(c/f.COLLISION_BUCKET_SIZE),d=0;if(e>f.COLLISION_TILE_BOX_SIZE||g>f.COLLISION_TILE_BOX_SIZE)g=e=f.COLLISION_TILE_BOX_SIZE,d=1;if(0>e||0>g)g=e=0,d=1;a=2*Math.max(a.halfWidth+Math.abs(a.center[0]),
a.halfHeight+Math.abs(a.center[1]));b%=f.COLLISION_BUCKET_SIZE;c%=f.COLLISION_BUCKET_SIZE;this.xBucket=e;this.yBucket=g;this.xOverflow=Math.ceil(Math.abs((a-b)/f.COLLISION_BUCKET_SIZE))+d;this.yOverflow=Math.ceil(Math.abs((a-c)/f.COLLISION_BUCKET_SIZE))+d};d.prototype.findCollisionDelta=function(a){var b=this.bounds.findCollisionDelta(a.bounds),c=this.boxes&&this.boxes.length,e=a.boxes&&a.boxes.length;return Math.abs(b)>f.COLLISION_MAX_ZOOM_DELTA||!c&&!e?b:c&&e?this._boxesToBoxes(a):c?this._boxesToBox(a):
this._boxToBoxes(a)};d.prototype.computeOffset=function(a,b){b||n.error("mapview-labeling","Unable to compute label offset. Expected an evaluator function but found "+b);var c=this.size;this.hasVV&&(a=b(a),c=isNaN(a)||null==a||Infinity===a?this.size:a);this.offsetX=this.directionX*(c/2+f.COLLISION_PLACEMENT_PADDING);this.offsetY=this.directionY*(c/2+f.COLLISION_PLACEMENT_PADDING)};d.prototype.setVV=function(a,b,c){this.hasVV=!0;this.size=a;this.directionX=b;this.directionY=c};d.prototype.clone=function(){var a=
new d(this.id,this.range,this.anchor[0],this.anchor[1],this.baseZoom);a.minZoom=this.minZoom;this.bounds&&(a.bounds=this.bounds.clone());this.boxes&&(a.boxes=this.boxes.map(function(a){return a.clone()}));a.xBucket=this.xBucket;a.yBucket=this.yBucket;a.xOverflow=this.xOverflow;a.yOverflow=this.yOverflow;a.hasVV=this.hasVV;a.size=this.size;a.directionX=this.directionX;a.directionY=this.directionY;a.offsetX=this.offsetX;a.offsetY=this.offsetY;return a};d.prototype._boxToBoxes=function(a){var b=-Infinity,
c=0;for(a=a.boxes;c<a.length;c++)var e=this.bounds.findCollisionDelta(a[c]),b=Math.max(e,b);return b};d.prototype._boxesToBox=function(a){for(var b=this.boxes[0].findCollisionDelta(a.bounds),c=1;c<this.boxes.length;c++)var e=this.boxes[c].findCollisionDelta(a.bounds),b=Math.max(e,b);return b};d.prototype._boxesToBoxes=function(a){for(var b=-Infinity,c=0;c<this.boxes.length;c++)for(var e=this.boxes[c],d=0,f=a.boxes;d<f.length;d++)var p=e.findCollisionDelta(f[d]),b=Math.max(p,b);return b};d.prototype.serialize=
function(a){a.push(this.id);this.bounds.serialize(a);a.push(this.range.from);a.push(this.range.count);a.push(this.anchor[0]);a.push(this.anchor[1]);a.push(this.baseZoom);a.push(this.hasVV?1:0);a.push(this.size);a.push(this.directionX);a.push(this.directionY);a.push(this.offsetX);a.push(this.offsetY);r.serializeList(a,this.boxes);return a};d.deserialize=function(a){var b=a.readInt32(),c=q.default.deserialize(a),e=a.readInt32(),f=a.readInt32(),h={from:e,count:f},p=a.readInt32(),k=a.readInt32(),l=a.readInt32(),
e=a.readInt32(),f=a.readInt32(),m=a.readInt32(),n=a.readInt32(),t=a.readInt32(),u=a.readInt32();a=r.deserializeList(a,q.default);b=new d(b,h,p,k,l);b.bounds=c;b.boxes=a;b.computeIndex();e&&b.setVV(f,m,n);b.offsetX=t;b.offsetY=u;return b};return d}();k.default=h});