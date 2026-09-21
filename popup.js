const analyzeBtn = document.getElementById("analyzeBtn");
const statusEl = document.getElementById("status");
const resultBox = document.getElementById("resultBox");
const riskScoreEl = document.getElementById("riskScore");
const summaryEl = document.getElementById("summary");
const errorBox = document.getElementById("errorBox");
const settingsLink = document.getElementById("settingsLink");

settingsLink.addEventListener("click", (e) => {
  e.preventDefault();
  chrome.runtime.openOptionsPage();
});

analyzeBtn.addEventListener("click", async () => {
  resultBox.classList.add("hidden");
  errorBox.classList.add("hidden");
  statusEl.classList.remove("hidden");
  statusEl.textContent = "🔍 Sayfa taranıyor ve analiz ediliyor...";
  analyzeBtn.disabled = true;

  chrome.runtime.sendMessage({ action: "analyzePage" }, (response) => {
    analyzeBtn.disabled = false;
    statusEl.classList.add("hidden");

    if (chrome.runtime.lastError) {
      showError(chrome.runtime.lastError.message);
      return;
    }
    if (!response || !response.ok) {
      showError((response && response.error) || "Bilinmeyen bir hata oluştu.");
      return;
    }
    renderResult(response.result.analysis);
  });
});

function showError(message) {
  errorBox.textContent = "❌ " + message;
  errorBox.classList.remove("hidden");
}

function renderResult(analysisText) {
  const scoreMatch = analysisText.match(/RISK_SCORE:\s*(\d+)/i);
  const score = scoreMatch ? parseInt(scoreMatch[1], 10) : null;

  let riskClass = "risk-mid";
  let riskLabel = "🟡 Belirsiz";
  if (score !== null) {
    if (score <= 3) { riskClass = "risk-low"; riskLabel = `🟢 Risk: ${score}/10 (Güvenli)`; }
    else if (score <= 6) { riskClass = "risk-mid"; riskLabel = `🟡 Risk: ${score}/10 (Dikkat)`; }
    else { riskClass = "risk-high"; riskLabel = `🔴 Risk: ${score}/10 (Tehlikeli)`; }
  }

  riskScoreEl.className = "risk-score " + riskClass;
  riskScoreEl.textContent = riskLabel;

  const summaryText = analysisText.replace(/RISK_SCORE:\s*\d+/i, "").trim();
  summaryEl.textContent = summaryText;

  resultBox.classList.remove("hidden");
}
