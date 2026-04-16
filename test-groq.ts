import "dotenv/config";
import { gerarContrato } from "./src/lib/groq";

async function test() {
  try {
    const res = await gerarContrato("Você é um assistente útil.", "Olá, me mande apenas um 'Oi'!");
    console.log("SUCESSO:", res);
  } catch (e) {
    console.error("ERRO COMPLETO:", e);
  }
}

test();
