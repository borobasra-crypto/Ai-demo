/* Purpose: create and download a plain-text prompt file without a server. */
"use strict";
export function downloadPrompt(prompt){
  if(!prompt || typeof prompt.prompt!=="string") return false;
  const content=[
    prompt.title,
    "",
    prompt.description,
    "",
    "Category: "+prompt.category,
    "Tags: "+prompt.tags.join(", "),
    "",
    "PROMPT",
    "======",
    prompt.prompt
  ].join("\n");
  const blob=new Blob([content],{type:"text/plain;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;
  a.download=`${prompt.id}-${prompt.title.replace(/[^a-z0-9]+/gi,"-").toLowerCase()}.txt`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  return true;
}
