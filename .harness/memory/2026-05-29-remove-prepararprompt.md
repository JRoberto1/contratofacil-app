# Sessão 2026-05-29 — Remove prepararPrompt

## O que foi feito

### Refactor: prepararPrompt → adapter inline no route.ts
- `gerarPromptContrato.ts` agora exporta **apenas** `gerarSystemPrompt` e `gerarUserPrompt`
- Removidas as linhas 379–513 inteiras: imports de `categorias`, `CategoriaSlug`, `FormularioContrato`, `TipoContrato` e a função `prepararPrompt`
- `route.ts` reescrito com adapter inline:
  - `import { gerarSystemPrompt, gerarUserPrompt }` substituindo `prepararPrompt`
  - `import { categorias, CategoriaSlug }` adicionado no route
  - Mapeamento `categoriaParaPrompt` expandido de 6 para 30+ slugs (cobre beleza, saúde, construção, consultoria, foto/video etc.)
  - Mapeamento `modoMap` para `modoAssinatura`
  - Toda lógica de parsing de valores monetários e campos condicionais preservada

### Commits desta sessão
- `7cc7560` — refactor: remove prepararPrompt adapter e inline lógica no route.ts

## Pendências (open_items)
1. RESEND_API_KEY + EMAIL_FROM na Vercel — e-mail não testado em produção
2. Constraint `contratos_status_check` — confirmar inclui `'enviado'`
3. AbacatePay/Pix — variável existe, código não feito
4. Cron de limpeza 30 dias — não implementado
5. `console.error` em `meus-contratos/page.tsx:24` — viola quality gate
6. `console.error` em `route.ts` linhas 195 e 204 — viola quality gate
7. `/api/dev/liberar-perfil` — verificar guard `NODE_ENV`
8. Zero testes automatizados

## Aprendizados Hashimoto
- `prepararPrompt` existia no arquivo mesmo quando a premissa era que havia sido removido — **sempre ler o arquivo real antes de corrigir**
- Quality gate `block_console_log: true` ainda tem dois `console.error` vivos no route.ts — não quebram build mas violam diretriz

## Próximo passo
Verificar build Vercel do commit `7cc7560` — depois corrigir os dois `console.error` no route.ts e o de `meus-contratos/page.tsx`.
