# .harness/index.md — Índice Central do Bifrost
<!-- v3.0.0 -->

> Leia PRIMEIRO. Carregue apenas o que tiver match.

## Directives

| Arquivo | Palavras-chave | Quando carregar |
|---------|---------------|----------------|
| `directives/session-memory.md` | sessão, memória, retomar, parar, continuar | ao iniciar/encerrar |
| `directives/context-management.md` | tokens, contexto, compressão, budget | ao gerenciar tokens |
| `directives/subagent-dispatch.md` | subagente, delegar, tarefa pesada | tarefa > 20k tokens |
| `directives/observation-masking.md` | log longo, output longo, masking | output > 20 linhas |
| `directives/harness-evolution.md` | evolução, hashimoto, melhoria, erro recorrente | ao melhorar harness |
| `directives/diagnose.md` | diagnóstico, investigar, por que quebrou | ao investigar falhas |
| `directives/health-check.md` | saúde, verificar harness, integridade | ao iniciar sessão |
| `directives/spec-driven.md` | spec, especificação, requisitos, antes de código | ao iniciar feature |
| `directives/testing.md` | teste, tdd, cobertura, jest, pytest, vitest | ao escrever/revisar testes |
| `directives/deployment.md` | deploy, produção, release, vercel, docker, ci/cd | antes de qualquer deploy |
| `directives/code-review.md` | review, revisão, pr, pull request, feedback | ao revisar código |
| `directives/refactoring.md` | refactor, refatorar, extrair, simplificar | ao refatorar código |
| `directives/mobile.md` | mobile, react native, flutter, ios, android, expo | ao desenvolver mobile |
| `directives/data-science.md` | pandas, jupyter, ml, dataset, análise de dados | ao analisar dados / ML |
| `directives/architecture.md` | arquitetura, adr, decisão técnica, clean architecture | ao tomar decisões arquiteturais |
| `directives/onboarding.md` | onboarding, novo desenvolvedor, setup, primeiro dia | ao integrar novo dev |

## Domínios

| Arquivo | Palavras-chave |
|---------|---------------|
| `.harness/domains/saas.md` | frontend, UI, autenticação, JWT, produto web |
| `.harness/domains/api.md` | endpoint, API, REST, backend, rota |
| `.harness/domains/automation.md` | script, automação, batch, pipeline |
| `.harness/domains/juridico-financeiro.md` | contrato, cláusula, LGPD, valor, pagamento |

## Camada 2 — Protocolo PEV

| Arquivo | Quando usar |
|---------|------------|
| `.harness/pev/pev.md` | antes de qualquer tarefa complexa — PLAN → EXECUTE → VERIFY |
