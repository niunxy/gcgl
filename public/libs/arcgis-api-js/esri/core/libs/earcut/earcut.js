// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.12/esri/copyright.txt for details.
//>>built
define([],function(){function B(a,c,b){b=b||2;var d=c&&c.length,e=d?c[0]*b:a.length,f=F(a,0,e,b,!0),k=[];if(!f||f.next===f.prev)return k;var m,g,n,l;if(d){var h=b,d=[],p,q,t;l=0;for(p=c.length;l<p;l++)q=c[l]*h,t=l<p-1?c[l+1]*h:a.length,q=F(a,q,t,h,!1),q===q.next&&(q.steiner=!0),d.push(J(q));d.sort(K);for(l=0;l<d.length;l++){c=d[l];h=f;if(h=L(c,h))c=G(h,c),w(c,c.next);f=w(f,f.next)}}if(a.length>80*b){m=n=a[0];g=d=a[1];for(h=b;h<e;h+=b)l=a[h],c=a[h+1],l<m&&(m=l),c<g&&(g=c),l>n&&(n=l),c>d&&(d=c);n=Math.max(n-
m,d-g);n=0!==n?1/n:0}x(f,k,b,m,g,n);return k}function F(a,c,b,d,e){var f;if(e===0<C(a,c,b,d))for(e=c;e<b;e+=d)f=H(e,a[e],a[e+1],f);else for(e=b-d;e>=c;e-=d)f=H(e,a[e],a[e+1],f);f&&t(f,f.next)&&(y(f),f=f.next);return f}function w(a,c){if(!a)return a;c||(c=a);var b;do if(b=!1,a.steiner||!t(a,a.next)&&0!==p(a.prev,a,a.next))a=a.next;else{y(a);a=c=a.prev;if(a===a.next)break;b=!0}while(b||a!==c);return c}function x(a,c,b,d,e,f,k){if(a){if(!k&&f){var m=a,g=m;do null===g.z&&(g.z=D(g.x,g.y,d,e,f)),g.prevZ=
g.prev,g=g.nextZ=g.next;while(g!==m);g.prevZ.nextZ=null;g.prevZ=null;var m=g,n,l,h,r,q,A,u=1;do{g=m;h=m=null;for(r=0;g;){r++;l=g;for(n=q=0;n<u&&(q++,l=l.nextZ,l);n++);for(A=u;0<q||0<A&&l;)0!==q&&(0===A||!l||g.z<=l.z)?(n=g,g=g.nextZ,q--):(n=l,l=l.nextZ,A--),h?h.nextZ=n:m=n,n.prevZ=h,h=n;g=l}h.nextZ=null;u*=2}while(1<r)}for(m=a;a.prev!==a.next;){g=a.prev;l=a.next;if(f)h=M(a,d,e,f);else a:if(h=a,r=h.prev,q=h,u=h.next,0<=p(r,q,u))h=!1;else{for(n=h.next.next;n!==h.prev;){if(v(r.x,r.y,q.x,q.y,u.x,u.y,n.x,
n.y)&&0<=p(n.prev,n,n.next)){h=!1;break a}n=n.next}h=!0}if(h)c.push(g.i/b),c.push(a.i/b),c.push(l.i/b),y(a),m=a=l.next;else if(a=l,a===m){if(!k)x(w(a),c,b,d,e,f,1);else if(1===k){k=c;m=b;g=a;do l=g.prev,h=g.next.next,!t(l,h)&&I(l,g,g.next,h)&&z(l,h)&&z(h,l)&&(k.push(l.i/m),k.push(g.i/m),k.push(h.i/m),y(g),y(g.next),g=a=h),g=g.next;while(g!==a);a=g;x(a,c,b,d,e,f,2)}else if(2===k)a:{k=a;do{for(m=k.next.next;m!==k.prev;){if(g=k.i!==m.i){g=k;l=m;h=void 0;if(h=g.next.i!==l.i&&g.prev.i!==l.i){h=void 0;
b:{h=g;do{if(h.i!==g.i&&h.next.i!==g.i&&h.i!==l.i&&h.next.i!==l.i&&I(h,h.next,g,l)){h=!0;break b}h=h.next}while(h!==g);h=!1}h=!h}r=void 0;if(r=h&&z(g,l)&&z(l,g)){h=g;r=!1;q=(g.x+l.x)/2;l=(g.y+l.y)/2;do h.y>l!==h.next.y>l&&h.next.y!==h.y&&q<(h.next.x-h.x)*(l-h.y)/(h.next.y-h.y)+h.x&&(r=!r),h=h.next;while(h!==g)}g=r}if(g){a=G(k,m);k=w(k,k.next);a=w(a,a.next);x(k,c,b,d,e,f);x(a,c,b,d,e,f);break a}m=m.next}k=k.next}while(k!==a)}break}}}}function M(a,c,b,d){var e=a.prev,f=a.next;if(0<=p(e,a,f))return!1;
var k=e.x>a.x?e.x>f.x?e.x:f.x:a.x>f.x?a.x:f.x,m=e.y>a.y?e.y>f.y?e.y:f.y:a.y>f.y?a.y:f.y,g=D(e.x<a.x?e.x<f.x?e.x:f.x:a.x<f.x?a.x:f.x,e.y<a.y?e.y<f.y?e.y:f.y:a.y<f.y?a.y:f.y,c,b,d);c=D(k,m,c,b,d);b=a.prevZ;for(d=a.nextZ;b&&b.z>=g&&d&&d.z<=c;){if(b!==a.prev&&b!==a.next&&v(e.x,e.y,a.x,a.y,f.x,f.y,b.x,b.y)&&0<=p(b.prev,b,b.next))return!1;b=b.prevZ;if(d!==a.prev&&d!==a.next&&v(e.x,e.y,a.x,a.y,f.x,f.y,d.x,d.y)&&0<=p(d.prev,d,d.next))return!1;d=d.nextZ}for(;b&&b.z>=g;){if(b!==a.prev&&b!==a.next&&v(e.x,e.y,
a.x,a.y,f.x,f.y,b.x,b.y)&&0<=p(b.prev,b,b.next))return!1;b=b.prevZ}for(;d&&d.z<=c;){if(d!==a.prev&&d!==a.next&&v(e.x,e.y,a.x,a.y,f.x,f.y,d.x,d.y)&&0<=p(d.prev,d,d.next))return!1;d=d.nextZ}return!0}function K(a,c){return a.x-c.x}function L(a,c){var b=c,d=a.x,e=a.y,f=-Infinity,k;do{if(e<=b.y&&e>=b.next.y&&b.next.y!==b.y){var m=b.x+(e-b.y)*(b.next.x-b.x)/(b.next.y-b.y);if(m<=d&&m>f){f=m;if(m===d){if(e===b.y)return b;if(e===b.next.y)return b.next}k=b.x<b.next.x?b:b.next}}b=b.next}while(b!==c);if(!k)return null;
if(d===f)return k.prev;c=k;for(var m=k.x,g=k.y,n=Infinity,l,b=k.next;b!==c;)d>=b.x&&b.x>=m&&d!==b.x&&v(e<g?d:f,e,m,g,e<g?f:d,e,b.x,b.y)&&(l=Math.abs(e-b.y)/(d-b.x),(l<n||l===n&&b.x>k.x)&&z(b,a)&&(k=b,n=l)),b=b.next;return k}function D(a,c,b,d,e){a=32767*(a-b)*e;c=32767*(c-d)*e;a=(a|a<<8)&16711935;a=(a|a<<4)&252645135;a=(a|a<<2)&858993459;c=(c|c<<8)&16711935;c=(c|c<<4)&252645135;c=(c|c<<2)&858993459;return(a|a<<1)&1431655765|((c|c<<1)&1431655765)<<1}function J(a){var c=a,b=a;do{if(c.x<b.x||c.x===b.x&&
c.y<b.y)b=c;c=c.next}while(c!==a);return b}function v(a,c,b,d,e,f,k,m){return 0<=(e-k)*(c-m)-(a-k)*(f-m)&&0<=(a-k)*(d-m)-(b-k)*(c-m)&&0<=(b-k)*(f-m)-(e-k)*(d-m)}function p(a,c,b){return(c.y-a.y)*(b.x-c.x)-(c.x-a.x)*(b.y-c.y)}function t(a,c){return a.x===c.x&&a.y===c.y}function I(a,c,b,d){return t(a,c)&&t(b,d)||t(a,d)&&t(b,c)?!0:0<p(a,c,b)!==0<p(a,c,d)&&0<p(b,d,a)!==0<p(b,d,c)}function z(a,c){return 0>p(a.prev,a,a.next)?0<=p(a,c,a.next)&&0<=p(a,a.prev,c):0>p(a,c,a.prev)||0>p(a,a.next,c)}function G(a,
c){var b=new E(a.i,a.x,a.y),d=new E(c.i,c.x,c.y),e=a.next,f=c.prev;a.next=c;c.prev=a;b.next=e;e.prev=b;d.next=b;b.prev=d;f.next=d;d.prev=f;return d}function H(a,c,b,d){a=new E(a,c,b);d?(a.next=d.next,a.prev=d,d.next.prev=a,d.next=a):(a.prev=a,a.next=a);return a}function y(a){a.next.prev=a.prev;a.prev.next=a.next;a.prevZ&&(a.prevZ.nextZ=a.nextZ);a.nextZ&&(a.nextZ.prevZ=a.prevZ)}function E(a,c,b){this.i=a;this.x=c;this.y=b;this.nextZ=this.prevZ=this.z=this.next=this.prev=null;this.steiner=!1}function C(a,
c,b,d){for(var e=0,f=b-d;c<b;c+=d)e+=(a[f]-a[c])*(a[c+1]+a[f+1]),f=c;return e}B.deviation=function(a,c,b,d){var e=c&&c.length,f=Math.abs(C(a,0,e?c[0]*b:a.length,b));if(e)for(var e=0,k=c.length;e<k;e++)f-=Math.abs(C(a,c[e]*b,e<k-1?c[e+1]*b:a.length,b));for(e=c=0;e<d.length;e+=3){var k=d[e]*b,m=d[e+1]*b,g=d[e+2]*b;c+=Math.abs((a[k]-a[g])*(a[m+1]-a[k+1])-(a[k]-a[m])*(a[g+1]-a[k+1]))}return 0===f&&0===c?0:Math.abs((c-f)/f)};B.flatten=function(a){for(var c=a[0][0].length,b={vertices:[],holes:[],dimensions:c},
d=0,e=0;e<a.length;e++){for(var f=0;f<a[e].length;f++)for(var k=0;k<c;k++)b.vertices.push(a[e][f][k]);0<e&&(d+=a[e-1].length,b.holes.push(d))}return b};return B});