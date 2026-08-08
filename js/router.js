/* Purpose: hash-based client-side routing for static hosting. */
"use strict";

const routes=new Set(["home","search","details","favorites","history","profile","daily"]);

export function getRoute(){
  const raw=location.hash.replace(/^#/,"").replace(/^\/+/,"");
  const [page,...params]=raw.split("/");
  return {page:routes.has(page)?page:"home",params};
}
export function navigate(page,param=""){
  location.hash=`#/${page}${param?"/"+encodeURIComponent(param):""}`;
}
export function listen(callback){
  window.addEventListener("hashchange",callback);
  callback();
}
