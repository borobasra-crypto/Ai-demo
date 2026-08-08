/* Purpose: small DOM, formatting, validation and utility helpers. */
"use strict";

export const $ = (selector, root=document) => root.querySelector(selector);
export const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];

export function el(tag, className="", text=""){
  const node=document.createElement(tag);
  if(className) node.className=className;
  if(text) node.textContent=text;
  return node;
}
export function safeId(value){ return String(value).replace(/[^a-zA-Z0-9_-]/g,"").slice(0,80); }
export function escapeText(value){ return String(value ?? ""); }
export function todayISO(){ return new Date().toISOString().slice(0,10); }
export function formatNumber(value){ return new Intl.NumberFormat().format(Number(value)||0); }
export function debounce(fn, wait=180){
  let timer;
  return (...args)=>{ clearTimeout(timer); timer=setTimeout(()=>fn(...args),wait); };
}
export async function copyText(text){
  if(typeof text !== "string") return false;
  try{
    await navigator.clipboard.writeText(text);
    return true;
  }catch(_error){
    const ta=document.createElement("textarea");
    ta.value=text; ta.setAttribute("readonly","");
    ta.style.position="fixed"; ta.style.opacity="0";
    document.body.appendChild(ta); ta.select();
    let ok=false; try{ok=document.execCommand("copy")}catch(_e){}
    ta.remove(); return ok;
  }
}
export function showToast(message){
  const region=$("#toast-region");
  if(!region) return;
  const item=el("div","toast",message);
  region.appendChild(item);
  setTimeout(()=>item.remove(),2600);
}
