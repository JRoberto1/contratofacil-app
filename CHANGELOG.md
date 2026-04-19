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

#### Pós-sessão 1 (continuação)

| # | Sintoma | Causa raiz | Arquivo(s) |
|---|---------|-----------|------------|
| 11 | Build Vercel falhava com **TypeScript error** | `nomeCategoria()` aceitava `string \| null` mas `item.categoria_custom` é `string \| undefined` | `DashboardContratosLayout.tsx:11` |
| 12 | **"Enviar por E-mail" não fazia nada** ao clicar | Guard `if (!contratoId) return` silencioso — sem erro exibido ao usuário | `VisualizadorContrato.tsx:209` |
| 13 | Modal de e-mail mostrava **"Salve o contrato antes de enviar"** | Contrato vindo do path rascunho não tinha `contratoId` — sem auto-save | `VisualizadorContrato.tsx` — adicionado auto-save antes do envio |
| 14 | Auto-save falhava com **"contratos_tipo_check"** | CHECK constraint do banco tinha tipos antigos (`resumido-formal`, `completo-dia-a-dia`) incompatíveis com os novos | Migration via API: constraint atualizada |
| 15 | Rota `/api/enviar-contrato` retornava **HTML** em vez de JSON | Import estático de `pdf-lib`/`resend` crashava a rota antes do `try/catch`; `RESEND_API_KEY` não verificada | `enviar-contrato/route.ts` — imports dinâmicos + verificação antecipada de env |
| 16 | Frontend exibia **"Unexpected token '<'"** em vez do erro real | `res.json()` chamado antes de verificar `res.ok` — HTML retornado pelo servidor quebrava o parse | `VisualizadorContrato.tsx` — parse defensivo com `res.text()` + try/catch |
| 17 | Após envio por e-mail, tela **não redirecionava** para Meus Contratos | `enviarEmail()` só fechava o modal sem chamar `router.push` | `VisualizadorContrato.tsx` — adicionado redirect + toast "Contrato enviado por e-mail!" |
| 18 | Modal "Detalhes do Contrato" exibia **"# Sem Referência"** em contratos antigos | Contratos criados antes da feature de referência não tinham o campo preenchido | `DashboardContratosLayout.tsx` — linha oculta quando null; migration retroativa gerou CF-YYYY-NNN para 23 contratos |

---

### Migrações aplicadas no banco (Supabase)

| Migration | O que faz |
|-----------|-----------|
| `20260419_servico_valor_centavos.sql` | Converte `servico_valor` de decimal para INTEGER (centavos) |
| `20260419_pagamentos_idempotency.sql` | Adiciona `idempotency_key UNIQUE` em `pagamentos` |
| `20260418_status_concluido` (via API) | Adiciona `'concluido'` ao CHECK constraint; migra `'gerado'→'concluido'`; corrige trigger `check_imutavel` |
| `contratos_usados_mes` (via API) | Adiciona coluna `contratos_usados_mes INTEGER DEFAULT 0` em `perfis`; corrige `contratos_mes=0→2` |
| `contratos_tipo_check` (via API) | Substitui tipos antigos (`resumido-formal`, `completo-dia-a-dia`) pelos novos (`simplificado`, `executivo`, `minimalista`) |

---

### Melhorias implementadas

- **Memória do prestador**: dados do Prestador (nome, CPF/CNPJ, cidade, etc.) são salvos no localStorage após cada contrato e pré-preenchidos no próximo
- **Rate limiting**: rotas de custo externo (Groq, Stripe) protegidas com limite por IP em `proxy.ts`
- **Validação Zod**: todas as rotas API usam schemas Zod com envelope `{success, data}` / `{success, error}`
- **Webhook idempotente**: Stripe webhook usa `upsert` com `idempotency_key` para evitar pagamentos duplicados
- **Health check**: `/api/health` verifica conectividade Supabase e variáveis de ambiente
- **Modal "Enviar por E-mail"**: UI completa com campo de destinatário, loading state, exibição de erros e toast de confirmação
- **Auto-save no envio**: se o contrato não tiver ID (rascunho), salva automaticamente antes de enviar por e-mail
- **Categorias em português**: `nomeCategoria()` traduz slugs internos para nomes exibíveis no dashboard
- **Referência CF-XXXX-NNN**: todos os contratos recebem referência sequencial gerada no momento do save
