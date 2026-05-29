# Sessão 2026-05-29 — Formulário, Prompts v2 e Bifrost Hook

## O que foi feito

### Bugfixes críticos
- **marked v18** — `marked.setOptions()` removido na v18; corrigido para `marked.parse(text, { breaks, gfm })`
- **Login/cadastro** — página era UI decorativa sem chamadas ao Supabase; reescrita completa com `signInWithOAuth`, `signInWithPassword`, `signUp`
- **Logout redirect** — `router.push('/')` não desautentica view do App Router; substituído por `window.location.href='/'`
- **PDF markdown** — modo Aceite Eletrônico gerava PDF com markdown cru; corrigido adicionando `markdownParaTexto()` no início de `gerarPDFBuffer()`
- **Máscara de moeda** — aplicada no `onChange` (era só no `onBlur`); campo nunca mostrava valor formatado durante digitação
- **Overflow do contrato** — texto ultrapassava margem direita; adicionado `overflow-wrap: break-word` no `.contrato-preview`
- **Build failures** — `useSearchParams()` sem `Suspense`, `setSucesso` residual — ambos removidos

### Prompt v2
- Substituiu arquivo monolítico por três funções: `gerarSystemPrompt(categoria, modelo)`, `gerarUserPrompt(dados)`, `prepararPrompt()` adapter
- System prompt com cláusulas específicas para 10 categorias e instruções por modelo
- Adapter `prepararPrompt()` preserva compatibilidade com `route.ts` sem alterações

### Formulário expandido (Formulario.tsx)
**Campos novos universais:**
- Estado civil e Profissão do prestador — sempre visíveis (fora do bloco PF)
- Representante legal do cliente PJ — obrigatório com validação
- Forma de recebimento (Pix / transferência / a combinar)
- Preview de cálculo em tempo real (entrada+saldo, parcelas)

**Campos condicionais por categoria:**
- `CAT_CRIATIVOS_E_DEV`: revisões, toggle PI, toggle portfólio, toggle subcontratação
- `CAT_DEV` extra: dias de garantia, hospedagem/cloud, toggle manutenção mensal → valor + escopo
- `CAT_FOTO_VIDEO`: toggle RAW, rodadas de seleção
- `CAT_CONSTRUCAO`: quem fornece materiais, garantia de mão de obra
- `CAT_BELEZA` + `CAT_SAUDE`: política de cancelamento sem aviso
- `CAT_CONSULTORIA`: toggle sessões gravadas

**Seção Configurações Avançadas (colapsável):**
- Aviso prévio rescisão, prazo aprovação entregáveis, prazo materiais do cliente

**UX:**
- "Modelo do contrato" movido para 2ª posição (logo após categoria)
- Descrições dos 4 modelos atualizadas

### Bifrost Hook
- Hook post-commit global em `C:/Users/leegr/.config/git/hooks/post-commit`
- `core.hooksPath` configurado globalmente
- Guard: só executa se `.harness/VERSION` existir no repo

## Pendências (open_items)
1. RESEND_API_KEY + EMAIL_FROM na Vercel — e-mail não testado em produção
2. Constraint `contratos_status_check` — confirmar inclui `'enviado'`
3. AbacatePay/Pix — variável existe, código não feito
4. Cron de limpeza 30 dias — não implementado
5. `console.error` em `meus-contratos/page.tsx:24` — viola quality gate
6. `/api/dev/liberar-perfil` — verificar guard `NODE_ENV`
7. Zero testes automatizados

## Aprendizados Hashimoto
- `useSearchParams()` no App Router exige `<Suspense>` — remover o hook é mais simples que adicionar wrapper
- Após `supabase.auth.signOut()`, o App Router não re-renderiza componentes que checam sessão via `useEffect` — hard navigation obrigatória
- `core.hooksPath` global substitui completamente `.git/hooks` local — hooks locais são ignorados quando global está ativo

## Próximo passo
Confirmar `RESEND_API_KEY` e `EMAIL_FROM` na Vercel e testar envio de e-mail end-to-end.
