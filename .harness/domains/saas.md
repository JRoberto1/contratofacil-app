# Domínio: SaaS / Produto Web

## Regras
- Ações destrutivas exigem confirmação
- JWT: máx 24h · Refresh em httpOnly cookie
- Validação no cliente E servidor
- Dados sensíveis fora dos logs

## Quality Gates
- [ ] Sem console.error em produção
- [ ] Imagens com alt · Formulários acessíveis
- [ ] Variáveis de ambiente validadas no startup
