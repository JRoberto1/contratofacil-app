# HANDOFF.md — ContratoFácil
> Gerado em 2026-04-19. Atualizar a cada sessão de trabalho relevante.

---

## 1. O que foi feito (fases concluídas)

### Fase 0 — Fundação (pré-sessão de bugs)
- Stack definida: Next.js 16.2.3 App Router, Supabase PostgreSQL + RLS, Groq (llama-3.3-70b), Stripe, Resend, pdf-lib
- Schema do banco criado: `contratos`, `perfis`, `pagamentos`, `logs_qualidade`
- Autenticação: Google OAuth + email/senha via Supabase Auth
- Planos configurados no Stripe: Grátis (2/mês), Avulso, Mensal, Semestral, Anual
- Documentação arquitetural: `docs/architecture.md`, `docs/coding-standards.md`, `docs/domain-rules.md`
- Rate limiting em `src/proxy.ts`: gerar-contrato 10/min, gerar-pdf 20/min, criar-checkout 5/min

### Fase 1 — Correção de bugs críticos (sessão 1)
Todos os bugs bloqueadores do fluxo principal foram resolvidos. Ver `CHANGELOG.md` bugs #1–10.

| Corrigido | Detalhe |
|-----------|---------|
| Contrato ficava RASCUNHO após download | CHECK constraint Supabase não aceitava `'concluido'` |
| `[object Object]` na geração | `data.error` é objeto, não string |
| "Dados inválidos" no formulário | Enum `categoriaContrato` com slugs errados |
| Servidor não iniciava | `middleware.ts` e `proxy.ts` coexistindo |
| Duplicar redirecionava para Planos | Query com coluna errada (`user_id` vs `id`) |
| Editor abria em Markdown | `markdownParaTexto()` adicionado antes de editar |
| Categorias exibidas em inglês | `nomeCategoria()` usando `lib/categorias` |
| Referências CF-XXXX-NNN ausentes | Geração no `salvar-contrato` + migration retroativa |
| PF/PJ não auto-selecionava | `handleChange` detecta 11/14 dígitos no CPF/CNPJ |
| Testemunhas sempre apareciam | Prompt v2 com regra ABSOLUTA de bloco de assinaturas |
| 4 modelos geravam texto idêntico | Prompt v2 com word counts e vocabulário distintos por modelo |

### Fase 2 — Funcionalidade "Enviar por E-mail" (sessão 2)
Bugs #11–18 corrigidos. Ver `CHANGELOG.md`.

| Entregue | Detalhe |
|----------|---------|
| Modal de e-mail | Campo de destinatário, loading, erro, toast, fechamento |
| API `/api/enviar-contrato` | Gera PDF → Resend → atualiza status `enviado` |
| Auto-save antes do envio | Se contrato sem ID, salva primeiro automaticamente |
| Redirect pós-envio | Toast "Contrato enviado por e-mail!" → `/meus-contratos` |
| Build Vercel corrigido | TypeScript: `string \| undefined` em `nomeCategoria()` |
| Constraint `contratos_tipo_check` | Atualizada para aceitar os 4 tipos novos |
| Referências retroativas | Migration gerou CF-YYYY-NNN para 23 contratos antigos |

---

## 2. O que está em andamento

### Funcionalidade de e-mail — quase completa, pendências:
- **`RESEND_API_KEY` na Vercel**: não confirmado se está configurado. Próximo erro esperado ao enviar: `"Serviço de e-mail não configurado"`. Verificar em Vercel → Settings → Environment Variables.
- O status `'enviado'` precisa estar no CHECK constraint do banco (`contratos_status_check`). Confirmar:
  ```sql
  SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE conname = 'contratos_status_check';
  ```

### Sem ROADMAP.md ou STATE.md detectados
Nenhum arquivo de planejamento de features futuras foi encontrado. Toda rastreabilidade está no `CHANGELOG.md` e nos commits.

---

## 3. Decisões tomadas fora dos docs

| Decisão | Motivo | Onde afeta |
|---------|--------|-----------|
| `proxy.ts` é o único middleware (não `middleware.ts`) | Next.js 16 só aceita um; coexistência causava crash no boot | `src/proxy.ts` |
| Status machine: `rascunho → concluido → enviado` | `gerado` foi removido — causava confusion; `concluido` é promovido no primeiro download | `atualizar-contrato/route.ts`, CHECK constraint |
| `perfis.id` é o PK (não `user_id`) | Supabase cria a coluna como `id` por padrão — queries anteriores usavam `user_id` e sempre falhavam | `meus-contratos/page.tsx`, `duplicar-contrato/route.ts` |
| `servico_valor` armazenado em centavos (INTEGER) | Evita problemas de ponto flutuante; exibição divide por 100 | `salvar-contrato/route.ts`, `DashboardContratosLayout.tsx` |
| Imports dinâmicos em `enviar-contrato/route.ts` | `pdf-lib` e `resend` como imports estáticos causavam crash HTML antes do try/catch | `src/app/api/enviar-contrato/route.ts` |
| Mock formulário em `EditarContratoClient` | Contratos com conteúdo no DB não têm o formulário original — o mock usa os campos desnormalizados da tabela `contratos` | `src/app/contrato/[id]/EditarContratoClient.tsx` |
| `categoriaContrato` enum: `["designer","dev","photo","consultant","maintenance","other"]` | Slugs reais da tabela. Documentos anteriores listavam slugs em PT que não existiam no banco | `src/lib/schemas/index.ts` |
| Referência gerada no servidor na inserção | Usa `COUNT(*) + 1` por `usuario_id` para sequencial; não é global, é por usuário | `salvar-contrato/route.ts` |

---

## 4. Próximo passo exato para continuar

### Prioridade 1 — Confirmar envio de e-mail funcionando
1. Verificar `RESEND_API_KEY` nas env vars da Vercel (Dashboard → Settings → Environment Variables)
2. Verificar `EMAIL_FROM` (remetente; fallback é `onboarding@resend.dev` — só funciona em domínio verificado no Resend)
3. Testar envio: abrir contrato existente → "Enviar por E-mail" → inserir e-mail → Enviar
4. Se erro `"Serviço de e-mail não configurado"`: adicionar `RESEND_API_KEY` na Vercel e fazer redeploy

### Prioridade 2 — Confirmar status `'enviado'` no banco
```sql
-- Verificar:
SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE conname = 'contratos_status_check';
-- Se não incluir 'enviado', adicionar:
ALTER TABLE contratos DROP CONSTRAINT contratos_status_check;
ALTER TABLE contratos ADD CONSTRAINT contratos_status_check
  CHECK (status = ANY (ARRAY['rascunho','concluido','enviado']));
```

### Prioridade 3 — Features pendentes (sem data)
- **Limpeza de contratos antigos**: "Arquivos disponíveis por 30 dias" é só texto de marketing — nenhum pg_cron ou Edge Function implementada
- **Integração AbacatePay (Pix)**: variável `ABACATEPAY_API_KEY` existe mas integração não foi feita
- **Página `/modelo/[categoria]`**: rotas existem mas conteúdo não foi verificado
- **Testes automatizados**: nenhum teste unitário ou E2E existe ainda

---

## 5. Arquivos modificados recentemente

### Últimas 2 sessões (commits da mais recente para mais antiga)

| Arquivo | Última alteração | O que mudou |
|---------|-----------------|-------------|
| `CHANGELOG.md` | dd7332c | Bugs #11–18 documentados |
| `src/components/contrato/DashboardContratosLayout.tsx` | dd7332c | Oculta tag referência quando null; `nomeCategoria()` com `string\|undefined` |
| `src/components/contrato/VisualizadorContrato.tsx` | 3879a8a | Modal e-mail completo; toast separado; redirect pós-envio; auto-save; parse defensivo |
| `src/app/api/enviar-contrato/route.ts` | 22741cc | **NOVO** — imports dinâmicos, check RESEND_API_KEY, try/catch robusto |
| `src/app/api/salvar-contrato/route.ts` | fa9e630 | Expõe erro real do Supabase no response |
| `src/lib/prompts/gerarPromptContrato.ts` | 3c4ce3f | Word counts distintos por modelo; bloco assinaturas explícito |
| `src/components/contrato/Formulario.tsx` | c2fec1f | Auto-select PF/PJ; memória prestador em localStorage |
| `src/app/contrato/[id]/EditarContratoClient.tsx` | c2fec1f | Fix acento `"eletrônica"→"eletronica"` |
| `src/lib/schemas/index.ts` | d13fcb5 | Enum categorias correto; campos opcionais relaxados |
| `src/app/api/duplicar-contrato/route.ts` | 570d6b1 | Fix user_id→id; copia conteudo; redirect correto |
| `src/app/meus-contratos/page.tsx` | 45b8293 | Fix query perfil; fallback cota=2 |
| `src/proxy.ts` | f03b31d | Rate limiting integrado (middleware.ts deletado) |

### Banco de dados (migrations via API — sem arquivo SQL local)
| Data | Migration | Efeito |
|------|-----------|--------|
| 2026-04-19 | `contratos_status_check` | Adicionado `'concluido'` e `'enviado'` |
| 2026-04-19 | `contratos_tipo_check` | Substituídos tipos antigos pelos 4 novos |
| 2026-04-19 | `perfis.contratos_usados_mes` | Nova coluna INTEGER DEFAULT 0 |
| 2026-04-19 | `referencia retroativa` | CF-YYYY-NNN gerada para 23 contratos antigos |

---

## Variáveis de Ambiente Necessárias (Vercel)

| Variável | Status | Onde usar |
|----------|--------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Configurada | Supabase client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Configurada | Supabase client |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Configurada | Server routes |
| `GROQ_API_KEY` | ✅ Funcionando | IA geração de contratos |
| `STRIPE_SECRET_KEY` | ✅ Configurada | Checkout |
| `STRIPE_WEBHOOK_SECRET` | ✅ Configurada | Webhook Stripe |
| `RESEND_API_KEY` | ⚠️ **Não confirmado** | Envio de e-mail |
| `EMAIL_FROM` | ⚠️ **Não confirmado** | Remetente Resend |
| `NEXT_PUBLIC_APP_URL` | ⚠️ Provável | Links nos e-mails |
| `ABACATEPAY_API_KEY` | 🔲 Presente mas sem uso | Pix (não integrado) |
| `INTERNAL_SECRET` | ✅ Configurada | Rota `/api/email` |
