# Itens Adiados (Postponed)

> Este arquivo mantém o registro de tarefas e funcionalidades que foram temporariamente adiadas para focar em outras prioridades. Quando verificar "o que falta fazer", inclua os itens listados aqui.

## Implantação e Variáveis de Ambiente
- [ ] **Integração de E-mail (Resend):** A feature de envio de e-mails foi desenvolvida, mas a configuração da chave de API (`RESEND_API_KEY`, `EMAIL_FROM`) na Vercel e o teste de ponta a ponta em produção foram adiados.
- [ ] **Ajustes de Constraints no Banco:** Validação (e possível adição) do status `'enviado'` na constraint `contratos_status_check` do Supabase foi adiada junto com a feature de e-mail.

## Outras Funcionalidades
- [ ] **Limpeza de Contratos Antigos:** Implementação do cron job/rotina para excluir rascunhos após 30 dias.
- [ ] **Integração Pix (AbacatePay):** Finalizar desenvolvimento do checkout via Pix.
