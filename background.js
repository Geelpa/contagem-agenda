// Verifica se a URL é válida para injeção de script
function isValidUrl(url) {
  return url &&
    !url.startsWith('chrome://') &&
    !url.startsWith('chrome-extension://') &&
    !url.startsWith('about:') &&
    !url.startsWith('edge://') &&
    url.startsWith('http');
}

chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  if (info.status === "complete" && isValidUrl(tab.url)) {
    chrome.scripting.executeScript({
      target: { tabId: tabId, allFrames: true },
      files: ["content.js"]
    }).catch(err => {
      // Silencia erros de injeção em páginas não permitidas
      console.log('Não foi possível injetar script:', err.message);
    });
  }
});