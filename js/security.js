/* Purpose: client-side safety helpers. LocalStorage content is never treated as HTML. */
"use strict";

export function validatePrompt(prompt){
  return Boolean(prompt &&
    typeof prompt.id==="string" &&
    typeof prompt.title==="string" &&
    typeof prompt.description==="string" &&
    typeof prompt.category==="string" &&
    Array.isArray(prompt.tags) &&
    typeof prompt.prompt==="string");
}
export function isSafeHttpUrl(url){
  return typeof url==="string" && /^https?:\/\//i.test(url);
}
export function sanitizeSettings(value){
  if(!value || typeof value!=="object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([k,v]) =>
    typeof k==="string" && k.length<50 &&
    ["string","boolean","number"].includes(typeof v)
  ));
}
