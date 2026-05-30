# HANDOFF — ContratoFácil | Sessão 2 | 30 de maio de 2026

## Estado do Produto — 100% implementado e em produção
URL: https://contratofacil-app.vercel.app

### Funcionalidades completas
- Geração de contrato por IA (4 modelos: Completo Formal, 
  Executivo, Simplificado, Minimalista)
- Export PDF e Word
- Aceite eletrônico completo com PDF anexado por email
- Dashboard com histórico, controle de cota e feedback visual
- Onboarding: redirect para /gerar após cadastro
- Recuperação de senha completa
- SEO: meta tags em todas as páginas
- 404 personalizada
- Pré-seleção de categoria via URL (?categoria=slug)
- Página /sucesso personalizada por plano
- Customer Portal Stripe ativo (gerenciar/cancelar assinatura)

### Pagamento — Stripe live conectado
- Stripe account: contratofacil.net.br (em análise — 2-3 dias)
- STRIPE_SECRET_KEY: configurada na Vercel (live)
- STRIPE_WEBHOOK_SECRET: configurada na Vercel
- Webhook registrado: checkout.session.completed
- Planos funcionando: avulso R$4,90 | mensal R$19 | 
  semestral R$89 | anual R$159
- Avulso: paga no momento do download do PDF
- Mensal/Semestral/Anual: paga na página /planos

### Variáveis de ambiente — Vercel
- NEXT_PUBLIC_SUPABASE_URL ✅
- NEXT_PUBLIC_SUPABASE_ANON_KEY ✅
- SUPABASE_SERVICE_ROLE_KEY ✅
- GROQ_API_KEY ✅
- RESEND_API_KEY ✅ (resolvido hoje)
- EMAIL_FROM ✅
- NEXT_PUBLIC_APP_URL ✅
- STRIPE_SECRET_KEY ✅ (adicionado hoje — live)
- STRIPE_WEBHOOK_SECRET ✅ (adicionado hoje)
- PRECO_AVULSO_CENTAVOS=490 ✅
- PRECO_MENSAL_CENTAVOS=1900 ✅
- PRECO_SEMESTRAL_CENTAVOS=8900 ✅
- PRECO_ANUAL_CENTAVOS=15900 ✅
- NEXT_PUBLIC_GA_MEASUREMENT_ID ❌ (aguarda domínio)

### Supabase — migrations aplicadas
- Tabela contratos: token_aceite, aceite_status, 
  aceite_em, aceite_ip, cliente_email ✅
- Tabela pagamentos: idempotency_key, 
  stripe_customer_id ✅
- CHECK metodo: ('pix', 'cartao', 'card', 'link') ✅
- RLS ativo ✅

### Infraestrutura
- Ping automático Supabase: cron-job.org a cada 4 dias ✅
- PWA configurado ✅
- Customer Portal Stripe: ativo ✅

## Commits importantes desta sessão
- 86aba74: grid categorias home navegando
- f1c6f80: pré-seleção categoria via URL
- 3b41d66: controle de cota no download PDF + reset mensal
- 4b93cfe: fluxo pagamento completo (webhook + botões + /sucesso)
- 1633a79: valores default corretos nos planos
- 9e0d03a: fluxo avulso corrigido (paga no download)
- a8d56d7: Stripe Customer Portal
- 9cb42eb: página /sucesso personalizada por plano
- 6df16f4: PDF anexado no email de aceite
- 032ff81: cliente_email salvo e usado no aceite
- 6233358: logs de debug removidos
- 00c0719: SEO + 404 + CTA dashboard vazio
- 06e7dc7: email de boas-vindas após cadastro
- 0fdcf68: recuperação de senha completa
- f94be94: onboarding redirect /gerar após cadastro
- 40f8980: feedback visual de cota no dashboard
- 160e1ab: rota morta baixar-pdf-salvo removida

## Pendências antes do lançamento público
1. Domínio contratofacil.net.br — registrado, 
   ainda não apontado para Vercel
   - No Registro.br: adicionar DNS apontando para Vercel
   - Na Vercel: adicionar domínio customizado
   - Atualizar NEXT_PUBLIC_APP_URL na Vercel
2. GA4 — configurar após domínio estar ativo
   - Criar conta GA4 em analytics.google.com
   - Adicionar NEXT_PUBLIC_GA_MEASUREMENT_ID na Vercel
3. Stripe — aguardar aprovação da conta (2-3 dias)

## Backlog pós-lançamento
### 🔴 Importante
- Pix: integração pendente (PagBank não funcionou, 
  AbacatePay exige CNPJ, Efí Bank é próxima opção)
  DECISÃO: implementar após abrir MEI ou testar Efí Bank com CPF

### 🟡 Qualidade
- Testes automatizados: Vitest + Playwright
  Stack definida, escopo mapeado (~45 testes, 2.5 dias)
  Rotas críticas: gerar-pdf, stripe-webhook, 
  registrar-aceite, criar-checkout

### 🟢 Produto
- Botões /planos conectar ao Pix quando implementado
- Cron reset mensal (lazy funciona, cron seria mais limpo)

## Próxima sessão — por onde começar
1. Verificar aprovação Stripe
2. Apontar domínio contratofacil.net.br para Vercel
3. Configurar GA4
4. Lançar nas comunidades da Onda 1
