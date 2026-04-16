// test-vercel.js

async function test() {
  const payload = { 
    tipo: "resumido-formal", 
    formulario: { 
      categoria: "designer", 
      prestador: {nomeCompleto:"Teste",cpfCnpj:"000"}, 
      cliente: {nomeRazaoSocial:"Teste",cpfCnpj:"000"}, 
      servico: {descricao:"Teste",valor:100,prazoEntrega:"Teste",formaPagamento:"Teste"}
    } 
  };
  
  console.log("Chamando a Vercel em produção...");
  const devResponse = await fetch("https://contratofacil-app.vercel.app/api/gerar-contrato", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  
  if (!devResponse.ok) {
    const text = await devResponse.text();
    console.log("ERRO VERCEL:", devResponse.status, text);
  } else {
    const data = await devResponse.json();
    console.log("SUCESSO VERCEL!", data.conteudo.substring(0, 100));
  }
}
test();
