/* Purpose: application entry point, local prompt catalog, rendering and interactions. */
"use strict";

import {CONFIG} from "../config/config.js";
import {storage} from "./storage.js";
import {telegram} from "./telegram.js";
import {navigate,getRoute,listen} from "./router.js";
import {applyTheme,currentTheme} from "./theme.js";
import {getLanguage,setLanguage} from "./language.js";
import {searchPrompts} from "./search.js";
import {isFavorite,toggleFavorite} from "./favorites.js";
import {addHistory,getHistory} from "./history.js";
import {isDailyClaimed,claimDaily} from "./daily.js";
import {downloadPrompt} from "./download.js";
import {openYoutube} from "./youtube.js";
import {unlockPrompt,isUnlocked,requiredAds} from "./unlock.js";
import {el,formatNumber,copyText,showToast,debounce} from "./helpers.js";
import {validatePrompt,isSafeHttpUrl} from "./security.js";

const IMG_BASE="https://images.unsplash.com/";
const PROMPTS=[
  {id:"p001",title:"Cinematic Product Ad",description:"Create a polished cinematic product advertisement with premium commercial pacing.",category:"Marketing",tags:["video","ads","cinematic"],rating:4.9,usageCount:18240,trendingScore:99,access:"free",createdAt:"2026-07-28",image:IMG_BASE+"photo-1556742049-0cfed4f6a45d?w=900&q=80",youtube:"https://www.youtube.com/results?search_query=cinematic+product+ad+prompt",prompt:"Act as a senior commercial director. Create a cinematic product advertisement for [PRODUCT] aimed at [AUDIENCE]. Include visual direction, camera movement, lighting, pacing, sound design, hook, CTA, and a 30-second shot list."},
  {id:"p002",title:"Expert SEO Article",description:"Generate a research-led SEO article brief with strong structure and search intent.",category:"Writing",tags:["seo","blog","content"],rating:4.8,usageCount:14100,trendingScore:96,access:"free",createdAt:"2026-07-31",image:IMG_BASE+"photo-1455390582262-044cdead277a?w=900&q=80",youtube:"https://www.youtube.com/results?search_query=seo+content+prompt",prompt:"You are an expert SEO strategist and editorial writer. Build an authoritative article about [TOPIC] for [AUDIENCE]. Include search intent, semantic entities, outline, FAQs, examples, internal-link suggestions, and a concise meta title and description."},
  {id:"p003",title:"Premium SaaS Landing Page",description:"High-conversion landing-page copy system for a modern SaaS product.",category:"Business",tags:["saas","landing-page","conversion"],rating:4.9,usageCount:12050,trendingScore:95,access:"premium",createdAt:"2026-08-01",image:IMG_BASE+"photo-1556761175-b413da4baf72?w=900&q=80",youtube:"https://www.youtube.com/results?search_query=saas+landing+page+copy",prompt:"Act as a conversion-rate optimization specialist. Create complete landing-page copy for [SAAS]. Define ICP, core promise, problem agitation, mechanism, benefits, proof, objections, pricing framing, FAQ, CTA hierarchy, and A/B test variants."},
  {id:"p004",title:"Ultra Brand Strategy",description:"A deep strategic framework for positioning, identity and category differentiation.",category:"Branding",tags:["brand","strategy","positioning"],rating:5.0,usageCount:8320,trendingScore:94,access:"ultra",createdAt:"2026-08-02",image:IMG_BASE+"photo-1556761175-5973dc0f32e7?w=900&q=80",youtube:"https://www.youtube.com/results?search_query=brand+strategy+framework",prompt:"Act as a world-class brand strategist. Build a complete brand strategy for [BRAND], including category design, audience segmentation, positioning statement, competitive map, value proposition, personality, verbal identity, visual direction, launch narrative, and measurable brand KPIs."},
  {id:"p005",title:"YouTube Script Architect",description:"Retention-focused script structure for educational or entertainment channels.",category:"YouTube",tags:["youtube","script","retention"],rating:4.7,usageCount:10780,trendingScore:91,access:"free",createdAt:"2026-08-03",image:IMG_BASE+"photo-1485846234645-a62644f84728?w=900&q=80",youtube:"https://www.youtube.com/results?search_query=youtube+script+writing",prompt:"You are a YouTube retention strategist. Write a [LENGTH]-minute script about [TOPIC]. Start with a curiosity gap, maintain open loops, use pattern interrupts, provide concrete examples, and finish with a natural CTA. Avoid filler."},
  {id:"p006",title:"Premium UI/UX Audit",description:"Structured product audit for usability, hierarchy and conversion friction.",category:"Design",tags:["ui","ux","audit"],rating:4.9,usageCount:7640,trendingScore:89,access:"premium",createdAt:"2026-08-04",image:IMG_BASE+"photo-1559028012-481c04fa702d?w=900&q=80",youtube:"https://www.youtube.com/results?search_query=ui+ux+audit",prompt:"Act as a senior product designer. Audit the supplied product interface [DESCRIPTION/SCREENSHOT NOTES]. Evaluate information architecture, hierarchy, affordances, accessibility, mobile ergonomics, visual rhythm, trust signals, conversion friction, and provide prioritized fixes by impact and effort."},
  {id:"p007",title:"Developer Debugging Copilot",description:"A disciplined debugging prompt for reproducible technical diagnosis.",category:"Coding",tags:["debugging","javascript","developer"],rating:4.8,usageCount:15550,trendingScore:97,access:"free",createdAt:"2026-08-05",image:IMG_BASE+"photo-1515879218367-8466d910aaa4?w=900&q=80",youtube:"https://www.youtube.com/results?search_query=debugging+with+ai",prompt:"Act as a senior software engineer. Diagnose this issue: [BUG]. Ask only essential questions, identify likely root causes, propose a minimal reproducible test, then provide a safe fix with explanation, edge cases, and regression tests. Do not invent APIs."},
  {id:"p008",title:"Ultra Executive Research Brief",description:"Decision-ready research structure for executives and founders.",category:"Research",tags:["research","strategy","executive"],rating:5.0,usageCount:6310,trendingScore:88,access:"ultra",createdAt:"2026-08-06",image:IMG_BASE+"photo-1551836022-d5d88e9218df?w=900&q=80",youtube:"https://www.youtube.com/results?search_query=executive+research+brief",prompt:"Act as a senior strategy consultant. Produce a decision-ready research brief on [QUESTION]. Separate facts, assumptions, uncertainties and recommendations. Compare alternatives, identify risks, quantify where possible, state what evidence would change the conclusion, and finish with a one-page executive summary."},
  {id:"p009",title:"Social Media Content Engine",description:"Turn one idea into a multi-platform content system.",category:"Social",tags:["social","content","repurpose"],rating:4.6,usageCount:9300,trendingScore:86,access:"free",createdAt:"2026-08-07",image:IMG_BASE+"photo-1611162617474-5b21e879e113?w=900&q=80",youtube:"https://www.youtube.com/results?search_query=content+repurposing+strategy",prompt:"Turn [CORE IDEA] into a 7-day content system. Create platform-specific hooks, short posts, video concepts, carousel outlines, CTAs, and a repurposing map while keeping one consistent strategic message."},
  {id:"p010",title:"Premium Sales Call Coach",description:"Objection-aware sales call preparation and coaching framework.",category:"Sales",tags:["sales","objections","calls"],rating:4.8,usageCount:6890,trendingScore:84,access:"premium",createdAt:"2026-08-07",image:IMG_BASE+"photo-1556740749-887f6717d7e4?w=900&q=80",youtube:"https://www.youtube.com/results?search_query=sales+call+coaching",prompt:"Act as a consultative sales coach. Prepare a discovery call for [OFFER] and [ICP]. Build qualification questions, listening cues, likely objections, ethical responses, value framing, next-step language, and a post-call scorecard. Never recommend deceptive pressure tactics."}
].filter(validatePrompt);

let state={query:"",category:"all",sort:"trending",visible:CONFIG.pageSize};

telegram.init();
applyTheme(currentTheme());
setLanguage(getLanguage());

function header(){
  const host=document.querySelector("#app-header");
  host.replaceChildren();
  const inner=el("div","header-inner");
  const brand=el("a","brand");
  brand.href="#/home";
  const mark=el("span","brand-mark","✦");
  const title=el("span","AI Prompt Vault");
  brand.append(mark,title);
  const actions=el("div","header-actions");
  const search=el("button","icon-btn","⌕");
  search.type="button"; search.setAttribute("aria-label","Search");
  search.addEventListener("click",()=>navigate("search"));
  const profile=el("button","icon-btn");
  profile.type="button"; profile.setAttribute("aria-label","Open profile");
  profile.textContent="●";
  profile.addEventListener("click",()=>navigate("profile"));
  actions.append(search,profile); inner.append(brand,actions); host.append(inner);
}

function nav(){
  const host=document.querySelector("#bottom-nav"); host.replaceChildren();
  const items=[["home","⌂","Home"],["search","⌕","Explore"],["daily","★","Daily"],["profile","●","Profile"]];
  const current=getRoute().page;
  items.forEach(([route,icon,label])=>{
    const a=el("a","nav-item"+(current===route?" active":""));
    a.href="#/"+route; a.setAttribute("aria-label",label);
    a.append(el("span","",icon),el("span","",label)); host.append(a);
  });
}

function card(prompt){
  const article=el("article","prompt-card glass-card animate-in");
  const thumb=el("div","prompt-thumb");
  const img=document.createElement("img"); img.src=prompt.image; img.alt=""; img.loading="lazy";
  thumb.append(img);
  if(prompt.access!=="free" && !isUnlocked(prompt.id)){
    const lock=el("div","lock-overlay"); lock.append(el("span","lock-icon","🔒")); thumb.append(lock);
  }
  const body=el("div","prompt-body");
  const top=el("div","prompt-meta");
  const badge=el("span","badge "+(prompt.access==="premium"?"badge-premium":prompt.access==="ultra"?"badge-ultra":"badge-free"),prompt.access==="free"?"FREE":prompt.access.toUpperCase());
  const rating=el("span","","★ "+prompt.rating);
  top.append(badge,rating);
  const h=el("h3","prompt-title",prompt.title);
  const desc=el("p","muted",prompt.description);
  desc.style.fontSize=".82rem";
  const meta=el("div","prompt-meta");
  meta.append(el("span","",prompt.category),el("span","",formatNumber(prompt.usageCount)+" uses"));
  const actions=el("div","prompt-actions");
  const open=el("a","btn btn-primary","View");
  open.href="#/details/"+encodeURIComponent(prompt.id);
  const fav=el("button","btn favorite-btn"+(isFavorite(prompt.id)?" is-favorite":""),isFavorite(prompt.id)?"♥":"♡");
  fav.type="button"; fav.setAttribute("aria-label",isFavorite(prompt.id)?"Remove Favorite":"Add Favorite");
  fav.addEventListener("click",e=>{
    e.preventDefault(); const yes=toggleFavorite(prompt.id);
    fav.classList.toggle("is-favorite",yes); fav.textContent=yes?"♥":"♡"; showToast(yes?"Added to favorites":"Removed from favorites");
  });
  actions.append(open,fav); body.append(top,h,desc,meta,actions); article.append(thumb,body); return article;
}

function renderGrid(prompts,limit=state.visible){
  const wrap=el("div","grid");
  prompts.slice(0,limit).forEach(p=>wrap.append(card(p)));
  if(!wrap.children.length){
    const empty=el("div","empty-state glass-card"); empty.style.gridColumn="1/-1";
    empty.append(el("div","empty-icon","⌕"),el("h3","", "No prompts found."),el("p","muted","Try another keyword or category."));
    return empty;
  }
  return wrap;
}

function categories(){
  return ["all",...new Set(PROMPTS.map(p=>p.category))];
}

function categoryChips(selected){
  const row=el("div","chip-row");
  categories().forEach(c=>{
    const b=el("button","chip"+(c===selected?" active":""),c==="all"?"All":c);
    b.type="button"; b.addEventListener("click",()=>{state.category=c;state.visible=CONFIG.pageSize;render()}); row.append(b);
  });
  return row;
}

function home(){
  const root=el("div");
  const hero=el("section","hero animate-in");
  hero.append(el("span","eyebrow","CURATED AI LIBRARY"),el("h1","", "Your prompts. Upgraded."),el("p","", "Discover practical prompts for writing, coding, marketing, design, research and more."));
  const acts=el("div","hero-actions");
  const explore=el("a","btn btn-primary","Explore prompts"); explore.href="#/search";
  const daily=el("a","btn","Daily bonus"); daily.href="#/daily";
  acts.append(explore,daily); hero.append(acts); root.append(hero);

  const catSection=el("section","section"); catSection.append(el("div","section-head").append?null:null);
  const ch=el("div","section-head"); ch.append(el("h2","","Categories")); catSection.append(ch,categoryChips("all")); root.append(catSection);

  [["Trending",searchPrompts(PROMPTS,"","all","trending").slice(0,4)],["Recently Added",searchPrompts(PROMPTS,"","all","latest").slice(0,4)],["Premium",PROMPTS.filter(p=>p.access!=="free").slice(0,4)]].forEach(([name,list])=>{
    const s=el("section","section"); const head=el("div","section-head"); head.append(el("h2","",name));
    const more=el("a","btn", "See all"); more.href="#/search"; head.append(more); s.append(head,renderGrid(list)); root.append(s);
  });
  return root;
}

function searchPage(){
  const root=el("div","animate-in");
  root.append(el("h1","page-title","Explore prompts"),el("p","muted","Search the vault and filter by category."));
  const toolbar=el("section","section toolbar");
  const box=el("div","search-box"); box.append(el("span","","⌕"));
  const input=document.createElement("input"); input.type="search"; input.placeholder="Search prompts"; input.value=state.query; input.setAttribute("aria-label","Search prompts");
  input.addEventListener("input",debounce(()=>{state.query=input.value;state.visible=CONFIG.pageSize;updateSearchResults()},150));
  box.append(input);
  const filter=el("div","filter-row");
  const select=document.createElement("select"); select.setAttribute("aria-label","Sort prompts");
  [["trending","Trending"],["latest","Latest"],["popular","Popular"]].forEach(([v,t])=>{const o=el("option","",t);o.value=v;select.append(o)}); select.value=state.sort;
  select.addEventListener("change",()=>{state.sort=select.value;state.visible=CONFIG.pageSize;updateSearchResults()});
  filter.append(select); toolbar.append(box,filter,categoryChips(state.category)); root.append(toolbar);
  const results=el("div"); results.id="search-results"; root.append(results);
  setTimeout(updateSearchResults,0);
  return root;
}
function updateSearchResults(){
  const host=document.querySelector("#search-results"); if(!host)return;
  host.replaceChildren(renderGrid(searchPrompts(PROMPTS,state.query,state.category,state.sort),state.visible));
}

function details(id){
  const p=PROMPTS.find(x=>x.id===id); const root=el("div","animate-in");
  if(!p){root.append(el("div","empty-state glass-card", "Prompt not found."));return root}
  addHistory(p.id);
  const article=el("article","detail-hero glass-card");
  const image=el("div","detail-image"); const img=document.createElement("img"); img.src=p.image; img.alt=""; img.loading="eager"; image.append(img);
  const body=el("div","detail-body");
  const badges=el("div","prompt-meta"); badges.append(el("span","badge "+(p.access==="premium"?"badge-premium":p.access==="ultra"?"badge-ultra":"badge-free"),p.access.toUpperCase()),el("span","","★ "+p.rating));
  body.append(badges,el("h1","",p.title),el("p","detail-desc",p.description));
  const tags=el("div","tag-list"); p.tags.forEach(t=>tags.append(el("span","tag","#"+t))); body.append(tags);
  const stats=el("div","stat-grid"); [["Rating",p.rating],["Usage",formatNumber(p.usageCount)],["Access",p.access]].forEach(([a,b])=>{const s=el("div","stat");s.append(el("strong","",String(b)),el("span","",a));stats.append(s)});body.append(stats);
  const actions=el("div","detail-actions");
  const copy=el("button","btn btn-primary","Copy"); copy.type="button";
  const dl=el("button","btn","Download TXT"); dl.type="button";
  const fav=el("button","btn favorite-btn"+(isFavorite(p.id)?" is-favorite":""),isFavorite(p.id)?"♥ Remove Favorite":"♡ Favorite"); fav.type="button";
  const yt=el("button","btn","▶ YouTube Guide");yt.type="button";
  const promptArea=el("div","glass-card");promptArea.style.padding="15px";promptArea.style.marginTop="14px";
  if(p.access==="free" || isUnlocked(p.id)){
    promptArea.append(el("span","eyebrow","PROMPT"),el("p","detail-desc",p.prompt));
    copy.addEventListener("click",async()=>showToast(await copyText(p.prompt)?"Copied":"Copy failed"));
    dl.addEventListener("click",()=>showToast(downloadPrompt(p)?"Download started":"Download failed"));
  }else{
    promptArea.append(el("span","eyebrow","LOCKED"),el("h3","", "Watch rewarded ads to unlock"),el("p","muted",`${requiredAds(p.access)} rewarded ad${requiredAds(p.access)>1?"s":""} required for ${p.access}.`));
    copy.disabled=true;dl.disabled=true;
    const unlock=el("button","btn btn-primary wide","🔓 Unlock Prompt");
    unlock.type="button";
    unlock.addEventListener("click",async()=>{
      unlock.disabled=true; unlock.textContent="Waiting for reward…";
      const result=await unlockPrompt(p,(step,total)=>{unlock.textContent=`Reward ${step}/${total}…`});
      if(result.ok){showToast("Prompt unlocked");render()}else{showToast("Rewarded ad was not completed");unlock.disabled=false;unlock.textContent="🔓 Unlock Prompt"}
    });
    actions.append(unlock);
  }
  fav.addEventListener("click",()=>{const yes=toggleFavorite(p.id);fav.classList.toggle("is-favorite",yes);fav.textContent=yes?"♥ Remove Favorite":"♡ Favorite"});
  yt.addEventListener("click",()=>openYoutube(p.youtube)&&showToast("Opening YouTube guide"));
  actions.append(copy,dl,fav,yt);body.append(actions,promptArea);article.append(image,body);root.append(article);return root;
}

function listPage(title,ids,emptyText){
  const root=el("div","animate-in");root.append(el("h1","page-title",title));
  const prompts=ids.map(id=>PROMPTS.find(p=>p.id===id)).filter(Boolean);
  root.append(prompts.length?renderGrid(prompts):Object.assign(el("div","empty-state glass-card"),{textContent:emptyText}));
  return root;
}

function daily(){
  const root=el("div","animate-in");root.append(el("h1","page-title","Daily Bonus"),el("p","muted","No coins. Just a simple daily reward status."));
  const cardEl=el("section","glass-card");cardEl.style.padding="20px";
  const claimed=isDailyClaimed();
  cardEl.append(el("div","empty-icon",claimed?"✓":"★"),el("h2","",claimed?"Already Claimed":"Today's Bonus Available"),el("p","muted",claimed?"Come back tomorrow for the next daily reward.":"Claim today's reward status."));
  const btn=el("button","btn "+(claimed?"":"btn-primary"),claimed?"Already Claimed":"Claim Daily Reward");btn.type="button";btn.disabled=claimed;
  btn.addEventListener("click",()=>{if(claimDaily()){showToast("Daily reward claimed");render()}});
  cardEl.append(el("div","hero-actions").append?null:null); const actions=el("div","hero-actions");actions.append(btn);cardEl.append(actions);root.append(cardEl);return root;
}

function profile(){
  const u=telegram.user(), root=el("div","animate-in");
  root.append(el("h1","page-title","Profile"),el("p","muted","Your Telegram profile and local app settings."));
  const head=el("section","profile-head glass-card");
  const avatar=document.createElement("img");avatar.className="avatar";avatar.alt="Telegram profile";avatar.src=u.photo_url||"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Crect width='128' height='128' rx='64' fill='%23271b43'/%3E%3Ctext x='64' y='76' text-anchor='middle' font-size='52' fill='white'%3E●%3C/text%3E%3C/svg%3E";
  const info=el("div");info.append(el("h2","",`${u.first_name} ${u.last_name}`.trim()||"Guest"));info.append(el("p","muted",u.username?`@${u.username}`:"Telegram profile"));
  head.append(avatar,info);root.append(head);
  const settings=el("section","setting-list");
  const themeItem=el("div","setting-item"), themeText=el("span");themeText.append(el("strong","","Theme"),el("small","","Purple / Dark"));
  const themeSelect=document.createElement("select");themeSelect.setAttribute("aria-label","Theme");["purple","dark"].forEach(x=>{const o=el("option","",x);o.value=x;themeSelect.append(o)});themeSelect.value=currentTheme();themeSelect.addEventListener("change",()=>{applyTheme(themeSelect.value);showToast("Theme updated")});themeItem.append(themeText,themeSelect);settings.append(themeItem);
  const langItem=el("div","setting-item"),langText=el("span");langText.append(el("strong","","Language"),el("small","","English / বাংলা"));const langSelect=document.createElement("select");langSelect.setAttribute("aria-label","Language");[["en","English"],["bn","বাংলা"]].forEach(([v,t])=>{const o=el("option","",t);o.value=v;langSelect.append(o)});langSelect.value=getLanguage();langSelect.addEventListener("change",()=>{setLanguage(langSelect.value);showToast("Language preference saved")});langItem.append(langText,langSelect);settings.append(langItem);
  [["Privacy","LocalStorage-only app. No account database is used."],["Terms","Use prompts responsibly and verify generated output."]].forEach(([a,b])=>{const i=el("div","setting-item");const t=el("span");t.append(el("strong","",a),el("small","",b));i.append(t);settings.append(i)});
  const clear=el("button","btn btn-danger","Clear Local Data");clear.type="button";clear.addEventListener("click",()=>{if(confirm("Clear favorites, history, daily status, theme, language and unlocks?")){storage.clearAll();applyTheme(CONFIG.defaultTheme);setLanguage(CONFIG.defaultLanguage);showToast("Local data cleared");render()}});
  const actions=el("div","hero-actions");actions.append(clear);settings.append(actions);root.append(settings);return root;
}

function historyPage(){return listPage("History",getHistory(),"No viewed prompts yet.")}
function favoritesPage(){return listPage("Favorites",storage.get("favorites"),"No favorite prompts yet.")}

function render(){
  header();nav();
  const host=document.querySelector("#page-content");host.replaceChildren();
  const {page,params}=getRoute();
  const views={home,search:f=>searchPage(),favorites:favoritesPage,history:historyPage,profile,daily};
  let view;
  if(page==="details") view=()=>details(decodeURIComponent(params[0]||""));
  else view=views[page]||home;
  host.append(view());
  host.focus({preventScroll:true});
}

listen(render);
