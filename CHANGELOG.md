# CHANGELOG — Contrato Fácil

## [Unreleased] — 2026-04-19

### Bugs corrigidos

#### Críticos (bloqueavam funcionalidade core)

| # | Sintoma | Causa raiz | Arquivo(s) |
|---|---------|-----------|------------|
| 1 | Contrato ficava como **RASCUNHO** após download | CHECK constraint no Supabase não aceitava `'concluido'` — update silenciosamente rejeitado | `supabase` (migration aplicada via API) |
| 2 | **"[object Object]"** na tela de geração | `data.error` é `{code, message}` mas era passado direto para `new Error()` | `VisualizadorContrato.tsx:72` |
| 3 | Contrato não carregava após geração (**"Dados inválidos"**) | Enum `categoriaContrato` no schema Zod usava slugs errados (`fotografo`, `designer-grafico`) em vez dos reais (`designer`, `dev`, `photo`) | `lib/schemas/index.ts` |
| 4 | **Servidor não iniciava** — crash no boot | `middleware.ts` e `proxy.ts` coexistindo — Next.js 16 só aceita `proxy.ts` | `src/middleware.ts` (deletado), `src/proxy.ts` |
| 5 | **"Duplicar/editar" redirecionava para Planos** | Query usava `.eq('user_id')` mas PK da tabela `perfis` é `id` → perfil sempre null → cota = 0 | `meus-contratos/page.tsx:30` |
| 6 | **Total Concluídos sempre 0** | Consequência do bug #1 — nenhum contrato chegava ao status `concluido` | Supabase + `atualizar-contrato/route.ts` |
| 7 | Valor exibido como **"R$ 150000"** sem formatação | Valor salvo em centavos mas exibido sem `/100` | `DashboardContratosLayout.tsx`, `EditarContratoClient.tsx` |

#### Secundários

| # | Sintoma | Causa raiz | Arquivo(s) |
|---|---------|-----------|------------|
| 8 | `conteudo` do contrato não era lido após geração | Envelope `{success, data:{conteudo}}` — código lia `data.conteudo` em vez de `data.data.conteudo` | `VisualizadorContrato.tsx:73` |
| 9 | `modoAssinatura: "eletrônica"` (com acento) rejeitado pelo Zod | Typo no mock de EditarContratoClient | `EditarContratoClient.tsx:24` |
| 10 | Cache `.next` stale referenciando `middleware.ts` deletado | Turbopack não limpa cache automaticamente após delete | Resolvido com `rm -rf .next` + restart |

---

### Migrações aplicadas no banco (Supabase)

| Migration | O que faz |
|-----------|-----------|
| `20260419_servico_valor_centavos.sql` | Converte `servico_valor` de decimal para INTEGER (centavos) |
| `20260419_pagamentos_idempotency.sql` | Adiciona `idempotency_key UNIQUE` em `pagamentos` |
| `20260418_status_concluido` (via API) | Adiciona `'concluido'` ao CHECK constraint; migra `'gerado'→'concluido'`; corrige trigger `check_imutavel` |
| `contratos_usados_mes` (via API) | Adiciona coluna `contratos_usados_mes INTEGER DEFAULT 0` em `perfis`; corrige `contratos_mes=0→2` |

---

### Melhorias implementadas

- **Memória do prestador**: dados do Prestador (nome, CPF/CNPJ, cidade, etc.) são salvos no localStorage após cada contrato e pré-preenchidos no próximo
- **Rate limiting**: rotas de custo externo (Groq, Stripe) protegidas com limite por IP em `proxy.ts`
- **Validação Zod**: todas as rotas API usam schemas Zod com envelope `{success, data}` / `{success, error}`
- **Webhook idempotente**: Stripe webhook usa `upsert` com `idempotency_key` para evitar pagamentos duplicados
- **Health check**: `/api/health` verifica conectividade Supabase e variáveis de ambiente
