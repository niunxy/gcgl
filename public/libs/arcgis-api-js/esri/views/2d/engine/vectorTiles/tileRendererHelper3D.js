// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.12/esri/copyright.txt for details.
//>>built
define("require exports ../../../../geometry ../../../../Viewpoint ../../../../core/libs/gl-matrix-2/mat4 ../../ViewState ../../../webgl/renderState".split(" "),function(u,f,h,m,n,p,a){Object.defineProperty(f,"__esModule",{value:!0});f.renderVectorTile=function(a,g,e,k,b,l,f,c){if(l!==f)throw Error("It is expected that tiles are square!");var d=b.adjustLevel(g[0]);c={context:a,drawPhase:0,state:q,stationary:!0,pixelRatio:c,displayLevel:d,requiredLevel:d,drawphase:0,renderer:k,layerOpacity:1,globalOpacity:1};
k.initializeProgramCache(a);d=b.getScale(g[0]);b=b.getShift(g,d);var h=b[1];e.tileTransform.displayCoord[0]=-1-b[0];e.tileTransform.displayCoord[1]=1+h;b=e.tileTransform.transform;n.mat4.identity(b);d=.25*d/l;b[0]=d;b[5]=-d;c.state.size=[l,f];k.setStateParams(c.state,c.pixelRatio,g[0]);e.attachWithContext(a);a.setPipelineState(r);e.render(c);a.setPipelineState(t);c.drawphase=1;e.render(c);c.drawphase=2;e.render(c)};var q=new p({viewpoint:new m({targetGeometry:new h.Point(0,0),scale:1,rotation:0}),
size:[256,256]}),r=a.makePipelineState({depthTest:{func:515},depthWrite:a.defaultDepthWriteParams,colorWrite:a.defaultColorWriteParams}),t=a.makePipelineState({blending:a.simpleBlendingParams(1,771),depthTest:{func:515},colorWrite:a.defaultColorWriteParams})});