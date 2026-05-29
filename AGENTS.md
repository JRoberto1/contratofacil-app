<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# ContratoFácil — Bifrost Harness

> Leia este bloco completamente antes de qualquer ação.

## Identidade

App web de geração de contratos jurídicos via IA.
Stack: Next.js 16 · React 19 · Supabase · Stripe · Groq · Resend · pdf-lib · TypeScript 5

## Memória de Sessão

**Ao iniciar:** se `.harness/memory/last-session.json` existir, leia-o e apresente um briefing antes de qualquer ação.
**Ao encerrar:** salve o contexto em `.harness/memory/last-session.json`.
**Claude Code:** use `/wrap-session` para encerrar · `/brief-session` para retomar.

## Directives

Consulte `.harness/index.md` para saber qual directive carregar por tarefa.
Carregue apenas a directive com match — não carregue tudo de uma vez.

## Domínios Ativos

- `.harness/domains/saas.md` — JWT ≤ 24h, validação cliente + servidor
- `.harness/domains/juridico-financeiro.md` — valores em centavos (integer), base legal obrigatória

## Regras Absolutas

1. Nunca avance sem validar o output da etapa anterior
2. Nunca invente — marque `[VERIFICAR: motivo]`
3. Valores monetários: SEMPRE centavos (integer), nunca float — use Decimal.js
4. Nunca use `any` em TypeScript nem ignore erros silenciosamente
5. Nunca toque em: `.env`, `.env.*`, `secrets/`, `credentials/`, `*.pem`, `*.key`
6. Perguntar antes de: deletar arquivo · modificar `package.json` / `tsconfig.json` · fazer commit ou push

## Quality Gates

Bloqueiam qualquer entrega:
- Segredos hardcoded no código
- `console.log` / `console.error` em produção
- `any` em TypeScript
- Float em valores monetários
- `.env` commitado
