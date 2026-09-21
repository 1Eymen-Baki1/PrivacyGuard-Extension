importScripts("utils/gemini-api.js");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "analyzePage") {
    handleAnalyzeRequest()
      .then((result) => sendResponse({ ok: true, result }))
      .catch((err) => sendResponse({ ok: false, error: err.message }));
    return true; // async response
  }
});

async function handleAnalyzeRequest() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id) {
    throw new Error("Aktif sekme bulunamadı.");
  }

  const [{ result: pageText }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => document.body ? document.body.innerText : ""
  });

  const { apiKey } = await chrome.storage.local.get("apiKey");
  const analysis = await analyzePrivacyPolicy(pageText, apiKey);
  return { analysis, pageUrl: tab.url };
}
