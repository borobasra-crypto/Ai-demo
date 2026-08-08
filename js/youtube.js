/* Purpose: validate and open a prompt's YouTube tutorial in Telegram/browser. */
"use strict";
import {telegram} from "./telegram.js";
export function openYoutube(url){
  if(typeof url!=="string" || !/^https:\/\/(www\.)?youtube\.com\/|^https:\/\/youtu\.be\//i.test(url)) return false;
  telegram.openLink(url);
  return true;
}
