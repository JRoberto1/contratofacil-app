# /review — Code Review Multi-Dimensional

Quality gate antes de merge.

## 5 Dimensões
1. Correção — faz o que a spec diz?
2. Legibilidade — nomes claros, responsabilidade única?
3. Arquitetura — segue as camadas?
4. Segurança — inputs validados, sem credenciais hardcoded?
5. Performance — sem N+1, sem loops desnecessários?

## Anti-Rationalization
❌ "Eu escrevi, sei que está certo" → Revisão existe por isso
❌ "Testes passam, está bom" → Testes passam código errado o tempo todo
