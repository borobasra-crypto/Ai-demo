/* Purpose: viewed-prompt history persistence. */
"use strict";
import {storage} from "./storage.js";
export function addHistory(id){
  const key=String(id), list=storage.get("history").filter(x=>x!==key);
  list.unshift(key);
  storage.set("history",list.slice(0,50));
}
export function getHistory(){return storage.get("history")}
