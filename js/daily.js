/* Purpose: daily reward availability and claim state. */
"use strict";
import {storage} from "./storage.js";
import {todayISO} from "./helpers.js";
export function isDailyClaimed(){return storage.get("dailyClaim")===todayISO()}
export function claimDaily(){
  const date=todayISO();
  if(isDailyClaimed()) return false;
  return storage.set("dailyClaim",date);
}
