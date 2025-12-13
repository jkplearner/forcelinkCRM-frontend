export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Keep your models EXACTLY the same
export const PRIMARY_MODEL = "gemini-2.5-flash";
export const FALLBACK_MODEL = "gemini-2.5-flash-lite";

// 🔒 GLOBAL HARD LOCK (across entire app)
let inFlight = false;
let lastCallTime = 0;
const MIN_INTERVAL_MS = 4000; // 4 seconds hard throttle

export const generateGeminiResponse = async (
    systemPrompt,
    userMessage,
    contextData,
    history = []
) => {
    if (!GEMINI_API_KEY) {
        throw new Error("Missing Gemini API Key");
    }

    const now = Date.now();

    // 🛑 Absolute throttle
    if (inFlight || now - lastCallTime < MIN_INTERVAL_MS) {
        throw new Error("Gemini cooling down");
    }

    inFlight = true;
    lastCallTime = now;

    const today = new Date().toISOString().split("T")[0];

    const formattedHistory = history.map(msg => ({
        role: msg.role === "ai" ? "model" : "user",
        parts: [{ text: msg.text }]
    }));

    const finalPrompt = `
[SYSTEM_RULES]
${systemPrompt}

[CURRENT_DATE]
${today}

[CURRENT_CRM_DATA_CONTEXT]
${contextData}

[USER_QUESTION]
${userMessage}
`;

    const contents = [
        ...formattedHistory,
        {
            role: "user",
            parts: [{ text: finalPrompt }]
        }
    ];

    // 🔑 IMPORTANT: only try ONE model per call
    const MODEL_NAME = PRIMARY_MODEL;

    try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 800
                }
            })
        });

        if (!response.ok) {
            const err = await response.json();

            // 🚫 DO NOT retry on 429
            if (response.status === 429) {
                throw new Error("Gemini rate limit hit");
            }

            throw new Error(err?.error?.message || "Gemini API error");
        }

        const data = await response.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text
            || "No response generated.";
    } finally {
        inFlight = false;
    }
};
