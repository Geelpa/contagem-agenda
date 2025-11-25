
chrome.tabs.onUpdated.addListener((tabId,info,tab)=>{
  if(info.status==="complete"){
    chrome.scripting.executeScript({
      target:{tabId:tabId, allFrames:true},
      files:["content.js"]
    });
  }
});
