// Gemini API ile gizlilik politikası / sözleşme analizi
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

function buildPrompt(policyText) {
  return `
You are an expert Data Privacy Lawyer. Your goal is to warn users by creating a flashy, emoji-rich, and eye-catching analysis.
Strictly follow these rules:
1. RISK SCORE: Provide a score between 1 and 10 on its own line in EXACTLY this format: "RISK_SCORE: X" (X is a number 1-10).
2. SHORT SUMMARY: List the 3 most critical points. Add a striking emoji (🚨, 👁️, 🕵️‍♂️, 📍, etc.) at the beginning of each point.
3. The output must be very clean, easy to read, and modern. Respond in Turkish.
Text to Analyze: ${policyText}
`;
}

async function analyzePrivacyPolicy(policyText, apiKey) {
  if (!apiKey) {
    throw new Error("API anahtarı bulunamadı. Lütfen ayarlar sayfasından Gemini API anahtarınızı girin.");
  }
  if (!policyText || policyText.trim().length < 100) {
    throw new Error("Sayfada yeterli miktarda metin bulunamadı. Bir gizlilik politikası/sözleşme sayfasında olduğunuzdan emin olun.");
  }

  const trimmedText = policyText.slice(0, 15000);
  const url = `${GEMINI_URL}?key=${apiKey}`;
  const payload = { contents: [{ parts: [{ text: buildPrompt(trimmedText) }] }] };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    if (response.status === 400 || response.status === 403) {
      throw new Error("API anahtarı geçersiz. Ayarlar sayfasından kontrol edin.");
    }
    if (response.status === 429) {
      throw new Error("İstek limiti aşıldı. Lütfen biraz sonra tekrar deneyin.");
    }
    throw new Error(`Sunucu hatası: ${response.status}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("AI'dan geçerli bir yanıt alınamadı.");
  }
  return text;
}
