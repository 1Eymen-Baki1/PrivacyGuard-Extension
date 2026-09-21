const apiKeyInput = document.getElementById("apiKey");
const saveBtn = document.getElementById("saveBtn");
const statusEl = document.getElementById("status");

document.addEventListener("DOMContentLoaded", async () => {
  const { apiKey } = await chrome.storage.local.get("apiKey");
  if (apiKey) apiKeyInput.value = apiKey;
});

saveBtn.addEventListener("click", async () => {
  const value = apiKeyInput.value.trim();
  if (!value) {
    showStatus("Lütfen geçerli bir API anahtarı girin.", "error");
    return;
  }
  await chrome.storage.local.set({ apiKey: value });
  showStatus("Kaydedildi ✓", "success");
});

function showStatus(message, type) {
  statusEl.textContent = message;
  statusEl.className = "status " + type;
  setTimeout(() => statusEl.classList.add("hidden"), 3000);
  statusEl.classList.remove("hidden");
}
