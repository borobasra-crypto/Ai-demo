/* Purpose: pure prompt search, category filtering and sorting. */
"use strict";

export function searchPrompts(prompts, query="", category="all", sort="trending"){
  const q=String(query).trim().toLowerCase();
  let result=prompts.filter(p=>{
    const hay=[p.title,p.description,p.category,...p.tags].join(" ").toLowerCase();
    return (!q || hay.includes(q)) && (category==="all" || p.category===category);
  });
  if(sort==="latest") result.sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
  else if(sort==="popular") result.sort((a,b)=>b.usageCount-a.usageCount);
  else result.sort((a,b)=>b.trendingScore-a.trendingScore);
  return result;
}
