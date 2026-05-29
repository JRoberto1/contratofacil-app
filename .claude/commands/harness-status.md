# /harness-status — Verificar se o Bifrost está ativo

## Instrução

Confirme que o harness está operando corretamente. Reporte:

1. **Sessão anterior:** last-session.json existe? Se sim, qual o `next_action` registrado?
2. **Directives disponíveis:** quantas estão em `directives/` e quais os nomes
3. **Domínios ativos:** listar os arquivos em `.harness/domains/`
4. **Skills instaladas:** listar os arquivos em `.harness/skills/`
5. **Quality gates ativos:** ler `block_*` de `.harness/config.json`
6. **Versão do harness:** ler `.harness/VERSION`

Formato de resposta:
```
🌉 Bifrost ativo — v[versão]
Sessão anterior: [encontrada / não encontrada]
Próximo passo: [next_action do last-session.json ou "—"]
Directives: [N] carregadas
Domínios: [lista]
Skills: [N] instaladas
Quality gates: secrets ✓ · console.log ✓ · TS any ✓ · float monetário ✓
```
