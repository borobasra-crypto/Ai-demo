/* Purpose: safe Telegram WebApp integration with a browser fallback. */
"use strict";

const tg = window.Telegram?.WebApp ?? null;

export const telegram = {
  available: Boolean(tg),
  init(){
    if(!tg) return;
    try{
      tg.ready();
      tg.expand();
      tg.setHeaderColor("#090711");
      tg.setBackgroundColor("#090711");
      tg.enableClosingConfirmation?.();
    }catch(_error){}
  },
  user(){
    const u = tg?.initDataUnsafe?.user;
    if(!u) return {id:"guest",first_name:"Guest",last_name:"",username:"",photo_url:""};
    return {
      id: String(u.id ?? "guest"),
      first_name: String(u.first_name ?? ""),
      last_name: String(u.last_name ?? ""),
      username: String(u.username ?? ""),
      photo_url: typeof u.photo_url === "string" ? u.photo_url : ""
    };
  },
  openLink(url){
    if(typeof url !== "string" || !/^https?:\/\//i.test(url)) return;
    try{ tg?.openLink ? tg.openLink(url) : window.open(url,"_blank","noopener,noreferrer"); }
    catch(_error){}
  },
  haptic(type="light"){
    try{ tg?.HapticFeedback?.impactOccurred(type); }catch(_error){}
  }
};
