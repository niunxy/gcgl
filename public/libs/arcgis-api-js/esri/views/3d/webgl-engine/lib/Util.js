// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.12/esri/copyright.txt for details.
//>>built
define("require exports ../../../../core/mathUtils ../../../../core/libs/gl-matrix-2/mat4 ../../../../core/libs/gl-matrix-2/vec2 ../../../../core/libs/gl-matrix-2/vec2f64 ../../../../core/libs/gl-matrix-2/vec3f64 ../../../../core/libs/gl-matrix-2/vec4 ../../../../core/libs/gl-matrix-2/vec4f64".split(" "),function(H,c,l,A,n,B,v,p,C){function q(a,b){if(!a)throw b=b||"assert",a=Error(b),a.stack&&console.log(a.stack),new w(b);}function x(a){for(var b in a)return b}function y(a,b){a[12]=b[0];a[13]=b[1];
a[14]=b[2]}function z(a,b){void 0===b&&(b=0);for(var d=0,g=0;4>g;g++)d+=a[b+g]*D[g];return d}function E(a){return a-Math.floor(a)}Object.defineProperty(c,"__esModule",{value:!0});var f=C.vec4f64.create(),w=function(){function a(a){this.message=a}a.prototype.toString=function(){return"AssertException: "+this.message};return a}();c.AssertException=w;c.VertexAttrConstants={POSITION:"position",NORMAL:"normal",NORMALCOMPRESSED:"normalCompressed",UV0:"uv0",AUXPOS1:"auxpos1",AUXPOS2:"auxpos2",COLOR:"color",
SYMBOLCOLOR:"symbolColor",SIZE:"size",REGION:"region",COMPONENTINDEX:"componentIndex",TANGENT:"aTangent"};c.assert=q;c.verify=function(a,b){a||console.warn("Verify failed: "+(b||"")+"\n"+Error("verify").stack)};c.encodeInt16=function(a){return l.clamp(Math.round(32767*a),-32767,32767)};c.encodeNormal=function(a,b){var d=Math.abs(a[0]),g=Math.abs(a[1]),e=1/(d+g+Math.abs(a[2])),c=Math.min(a[2]*e,0);b[0]=(0>a[0]?-1:1)*(d*e-c);b[1]=(0>a[1]?-1:1)*(g*e-c)};c.fallbackIfUndefined=function(a,b){return void 0===
a?b:a};c.hex2rgb=function(a){a=Math.floor(a);return[(a>>16&255)/255,(a>>8&255)/255,(a&255)/255]};c.rgb2hex=function(a){var b=l.clamp(Math.round(255*a[0]),0,255),d=l.clamp(Math.round(255*a[1]),0,255);a=l.clamp(Math.round(255*a[2]),0,255);return"0x"+((b<<16)+(d<<8)+a).toString(16)};c.dec2hex=function(a){a=a.toString(16);return"00000000".substr(0,8-a.length)+a};c.rayTriangle3D=function(a,b,d,g,e,c,m,h,k){void 0===k&&(k=v.vec3f64.create());var f=g[m]-d[c],r=g[m+1]-d[c+1],l=g[m+2]-d[c+2];g=e[h]-d[c];m=
e[h+1]-d[c+1];e=e[h+2]-d[c+2];var n=b[1]*e-m*b[2],p=b[2]*g-e*b[0],q=b[0]*m-g*b[1];h=f*n+r*p+l*q;if(-1E-5<h&&1E-5>h)return!1;h=1/h;var t=a[0]-d[c],u=a[1]-d[c+1];a=a[2]-d[c+2];k[1]=h*(t*n+u*p+a*q);if(0>k[1]||1<k[1])return!1;d=u*l-r*a;a=a*f-l*t;f=t*r-f*u;k[2]=h*(b[0]*d+b[1]*a+b[2]*f);if(0>k[2]||1<k[1]+k[2])return!1;k[0]=h*(g*d+m*a+e*f);return!0};c.rayBoxTest=function(a,b,d,c){var e,g=(d[0]-a[0])/b[0],f=(c[0]-a[0])/b[0];g>f&&(e=g,g=f,f=e);var h=(d[1]-a[1])/b[1],k=(c[1]-a[1])/b[1];h>k&&(e=h,h=k,k=e);if(g>
k||h>f)return!1;h>g&&(g=h);k<f&&(f=k);d=(d[2]-a[2])/b[2];a=(c[2]-a[2])/b[2];d>a&&(e=d,d=a,a=e);if(g>a||d>f)return!1;a<f&&(f=a);return 0>f?!1:!0};c.rayRay2D=function(a,b,d,c,e,f){void 0===f&&(f=B.vec2f64.create());var g=(c[e]-d[e])*(b[0]-a[0])-(c[0]-d[0])*(b[e]-a[e]);if(0===g)return!1;d=((c[0]-d[0])*(a[e]-d[e])-(c[e]-d[e])*(a[0]-d[0]))/g;f[0]=a[0]+d*(b[0]-a[0]);f[1]=a[e]+d*(b[e]-a[e]);return!0};c.project=function(a,b,d,c,e){e||(e=a);f[0]=a[0];f[1]=a[1];f[2]=a[2];f[3]=1;p.vec4.transformMat4(f,f,b);
2<e.length&&(e[2]=-f[2]);p.vec4.transformMat4(f,f,d);q(0!==f[3]);e[0]=f[0]/f[3];e[1]=f[1]/f[3];e[2]=f[2]/f[3];e[0]=(.5*e[0]+.5)*c[2]+c[0];e[1]=(.5*e[1]+.5)*c[3]+c[1]};c.getFirstObjectKey=x;c.getFirstObjectValue=function(a){return a[x(a)]};c.objectEmpty=function(a){for(var b in a)return!1;return!0};c.logWithBase=function(a,b){return Math.log(a)/Math.log(b)};c.setMatrixTranslation=y;c.setMatrixTranslation3=function(a,b,d,c){a[12]=b;a[13]=d;a[14]=c};c.getMatrixTranslation=function(a,b){void 0===b&&(b=
v.vec3f64.create());b[0]=a[12];b[1]=a[13];b[2]=a[14];return b};c.createTranslationMatrix=function(a,b){a=A.mat4.identity(a);y(a,b);return a};c.isTranslationMatrix=function(a){return 1===a[0]&&0===a[1]&&0===a[2]&&0===a[3]&&0===a[4]&&1===a[5]&&0===a[6]&&0===a[7]&&0===a[8]&&0===a[9]&&1===a[10]&&0===a[11]&&1===a[15]};c.fovx2fovy=function(a,b,d){return 2*Math.atan(d*Math.tan(.5*a)/b)};c.fovy2fovx=function(a,b,d){return 2*Math.atan(b*Math.tan(.5*a)/d)};c.fovx2fovd=function(a,b,d){return 2*Math.atan(Math.sqrt(b*
b+d*d)*Math.tan(.5*a)/b)};c.fovy2fovd=function(a,b,d){return 2*Math.atan(Math.sqrt(b*b+d*d)*Math.tan(.5*a)/d)};c.fovd2fovx=function(a,b,d){return 2*Math.atan(b*Math.tan(.5*a)/Math.sqrt(b*b+d*d))};c.fovd2fovy=function(a,b,d){return 2*Math.atan(d*Math.tan(.5*a)/Math.sqrt(b*b+d*d))};c.packFloatRGBA=function(a,b,d){void 0===d&&(d=0);a=l.clamp(a,0,F);for(var c=0;4>c;c++)b[d+c]=Math.floor(256*E(a*G[c]))};c.unpackFloatRGBA=z;var G=[1,256,65536,16777216],D=[1/256,1/65536,1/16777216,1/4294967296],F=z(new Uint8ClampedArray([255,
255,255,255]));c.inverseProjectionInfo=function(a,b,d,c,e){0===a[11]?(c[0]=2/(b*a[0]),c[1]=2/(d*a[5]),c[2]=(1+a[12])/a[0],c[3]=(1+a[13])/a[5],n.vec2.set(e,0,1)):(c[0]=-2/(b*a[0]),c[1]=-2/(d*a[5]),c[2]=(1-a[8])/a[0],c[3]=(1-a[9])/a[5],n.vec2.set(e,1,0))}});