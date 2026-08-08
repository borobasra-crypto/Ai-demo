/* Purpose: premium unlock state and rewarded-ad provider boundary.
 *
 * IMPORTANT:
 * A static LocalStorage-only app cannot prove to a server that an ad was watched.
 * Replace `RewardedAdAdapter.show()` with the official SDK callback from your
 * chosen ad provider. The adapter must resolve TRUE only after the provider
 * confirms a completed rewarded event.
 */
"use strict";

import {storage} from "./storage.js";

const LEVELS=Object.freeze({free:0,normal:1,premium:3,ultra:5});

const RewardedAdAdapter={
  async show(){
    // Safe default: no fake reward is granted. Configure a real provider here.
    return false;
  }
};

export function requiredAds(level){return LEVELS[level] ?? 1}
export function isUnlocked(id){return storage.get("unlockedPrompts").includes(String(id))}

export async function unlockPrompt(prompt,onProgress=()=>{}){
  if(!prompt?.id) return {ok:false,reason:"invalid"};
  if(prompt.access==="free") return {ok:true,already:true};
  if(isUnlocked(prompt.id)) return {ok:true,already:true};

  const total=requiredAds(prompt.access);
  for(let i=1;i<=total;i++){
    onProgress(i,total);
    const rewarded=await RewardedAdAdapter.show();
    if(!rewarded) return {ok:false,reason:"ad-not-completed",step:i,total};
  }
  const list=storage.get("unlockedPrompts");
  if(!list.includes(String(prompt.id))){
    storage.set("unlockedPrompts",[...list,String(prompt.id)].slice(0,200));
  }
  return {ok:true,already:false};
}
