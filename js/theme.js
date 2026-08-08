/* Purpose: persist and apply the selected visual theme. */
"use strict";
import {storage} from "./storage.js";
export function applyTheme(theme){
  const allowed=["purple","dark"], next=allowed.includes(theme)?theme:"purple";
  document.documentElement.dataset.theme=next;
  storage.set("theme",next);
  return next;
}
export function currentTheme(){return storage.get("theme")}
