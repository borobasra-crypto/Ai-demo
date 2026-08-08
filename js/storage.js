/* Purpose: safe, validated LocalStorage abstraction. */
"use strict";

const DEFAULTS = Object.freeze({
  favorites: [],
  history: [],
  dailyClaim: null,
  theme: "purple",
  language: "en",
  unlockedPrompts: [],
  settings: {}
});

function clone(value){ return JSON.parse(JSON.stringify(value)); }

function validValue(key, value){
  switch(key){
    case "favorites":
    case "history":
    case "unlockedPrompts":
      return Array.isArray(value) && value.every(v => typeof v === "string");
    case "dailyClaim":
      return value === null || (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value));
    case "theme":
    case "language":
      return typeof value === "string" && value.length <= 20;
    case "settings":
      return value && typeof value === "object" && !Array.isArray(value);
    default:
      return false;
  }
}

export const storage = {
  get(key){
    if(!(key in DEFAULTS)) return null;
    try{
      const raw = localStorage.getItem(key);
      if(raw === null) return clone(DEFAULTS[key]);
      const parsed = JSON.parse(raw);
      return validValue(key, parsed) ? parsed : clone(DEFAULTS[key]);
    }catch(_error){ return clone(DEFAULTS[key]); }
  },
  set(key,value){
    if(!(key in DEFAULTS) || !validValue(key,value)) return false;
    try{ localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch(_error){ return false; }
  },
  remove(key){
    if(!(key in DEFAULTS)) return;
    try{ localStorage.removeItem(key); }catch(_error){}
  },
  clearAll(){
    Object.keys(DEFAULTS).forEach(key => this.remove(key));
  }
};
