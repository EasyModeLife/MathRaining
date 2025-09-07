const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/katex-3QKUVNW9.css"])))=>i.map(i=>d[i]);
import{_ as k}from"./index-DOampWFA.js";import{S as g,b as S,s as z,n as h,d as C,e as M,g as R,j as O,q as T,D as P,W as A,X as D,v as L,K as q}from"./utils-Dhpz6cMF.js";/* empty css                                           */function H(o){let r;return{c(){r=R("span"),O(r,"class","math-render svelte-15kbofj")},m(n,a){M(n,r,a),o[5](r)},p:h,i:h,o:h,d(n){n&&C(r),o[5](null)}}}function I(o,r,n){let{expr:a=""}=r,{display:i=!1}=r,{prerender:c=!0}=r,{throwOnError:x=!1}=r,t,f,p=!1,d=!1,l="";const u=T();async function _(){if(!c||!t||d)return!1;try{const s=await fetch(`/latex-render?expr=${encodeURIComponent(a)}&display=${i}&size=1.2`,{method:"GET",headers:{Accept:"text/html",Cache:"force-cache"}});if(s.ok&&s.headers.get("X-Prerendered")==="true"){const m=await s.text();if(m&&m.includes("katex-ssr"))return n(0,t.innerHTML=m,t),p=!0,l=a,w(),u("rendered",{method:"ssr",success:!0}),!0}}catch(e){console.warn("[MathRenderer] SSR failed, falling back to client:",e)}return!1}async function b(){if(!(!t||p))try{if(!f){const e=await k(()=>import("./vendor-ChWnQ-fc.js"),[]);await k(()=>Promise.resolve({}),__vite__mapDeps([0])),f=e.default??e}n(0,t.innerHTML="",t),f.render(a,t,{displayMode:i,throwOnError:!1,errorColor:"#ff6b6b"}),l=a,u("rendered",{method:"client",success:!0})}catch(e){console.error("[MathRenderer] Client-side KaTeX failed:",e),t&&n(0,t.innerHTML=`<span style="color: #ff6b6b; font-family: monospace;">${a}</span>`,t),u("rendered",{method:"fallback",success:!1,error:e instanceof Error?e.message:String(e)})}}function w(){if(!t)return;const e=document.createElement("style");e.textContent=`
      .katex-ssr .katex {
        color: var(--text, #000);
        font-size: 1em;
        margin: 0;
      }
      .katex-ssr .katex-display {
        margin: 0;
      }
      .katex-ssr.katex-size-12 { font-size: 1.2em; }
      .katex-ssr.katex-size-15 { font-size: 1.5em; }
      .katex-error {
        background: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: 4px;
        padding: 4px 8px;
        color: #dc2626;
        font-family: monospace;
        font-size: 0.9em;
      }
    `;const s=t.querySelector("style[data-katex-ssr]");s&&s.remove(),e.setAttribute("data-katex-ssr","true"),t.appendChild(e)}async function y(){!t||d&&l===a||c&&await _()||await b()}P(async()=>{await A(),await y(),d=!0}),D(async()=>{a!==l&&await y()}),L(()=>{t&&t.querySelectorAll("style[data-katex-ssr]").forEach(s=>s.remove())});function E(e){q[e?"unshift":"push"](()=>{t=e,n(0,t)})}return o.$$set=e=>{"expr"in e&&n(1,a=e.expr),"display"in e&&n(2,i=e.display),"prerender"in e&&n(3,c=e.prerender),"throwOnError"in e&&n(4,x=e.throwOnError)},[t,a,i,c,x,E]}class K extends g{constructor(r){super(),S(this,r,I,H,z,{expr:1,display:2,prerender:3,throwOnError:4})}}export{K as default};
