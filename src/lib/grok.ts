// =============================================================================
// ContratoFácil — Cliente xAI Grok
// Modelo: grok-4-fast | API 100% compatível com formato OpenAI
// NUNCA importe este arquivo em componentes client-side
// © 2026 FlowIQ. Todos os direitos reservados.
// =============================================================================

const GROK_API_URL = "https://api.x.ai/v1/chat/completions";

export async function gerarContrato(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const apiKey = process.env.GROK_API_KEY;

  if (!apiKey) {
    throw new Error("GROK_API_KEY não configurada");
  }

  const response = await fetch(GROK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-4-fast",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Grok API error ${response.status}: ${error}`);
  }

  const data = await response.json();

  if (!data.choices?.[0]?.message?.content) {
    throw new Error("Resposta inválida da API Grok");
  }

  return data.choices[0].message.content;
}
