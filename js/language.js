/* Purpose: tiny language preference layer for the static UI. */
"use strict";
import {storage} from "./storage.js";
export const supportedLanguages=["en","bn"];
export function getLanguage(){
  const l=storage.get("language");
  return supportedLanguages.includes(l)?l:"en";
}
export function setLanguage(language){
  const l=supportedLanguages.includes(language)?language:"en";
  storage.set("language",l);
  document.documentElement.lang=l;
  return l;
}
