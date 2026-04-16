// test-groq.js
async function test() {
  const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
  const GROQ_MODEL = "llama-3.3-70b-versatile";
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.error("ERRO: GROQ_API_KEY não configurada");
    return;
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: "Você é um assistente útil." },
          { role: "user", content: "Olá, me mande apenas um 'Oi'!" },
        ],
        temperature: 0.2,
        max_tokens: 10,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`ERRO GROQ (Status ${response.status}):`, error);
      return;
    }

    const data = await response.json();
    console.log("SUCESSO:", data.choices[0].message.content);
  } catch (e) {
    console.error("FALHA CATASTRÓFICA:", e);
  }
}

test();
