/* Purpose: favorite prompt persistence. */
"use strict";
import {storage} from "./storage.js";
export function isFavorite(id){return storage.get("favorites").includes(String(id))}
export function toggleFavorite(id){
  const key=String(id), list=storage.get("favorites");
  const next=list.includes(key)?list.filter(x=>x!==key):[key,...list];
  storage.set("favorites",next.slice(0,100));
  return next.includes(key);
}
export function getFavorites(){return storage.get("favorites")}
