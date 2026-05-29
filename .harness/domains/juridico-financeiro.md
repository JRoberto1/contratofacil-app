# Domínio: Jurídico / Financeiro

## Regras Absolutas
- NUNCA gere cláusula sem base legal (CC/2002, CLT, LGPD)
- NUNCA omita campos — use [DADO_AUSENTE: descrição]
- Valores monetários: SEMPRE centavos (integer), nunca float
- Cálculos: use biblioteca de precisão (Decimal.js)

## Quality Gates
- [ ] Identificação completa das partes
- [ ] Cláusulas: objeto, valor, prazo, rescisão, foro
- [ ] Para TI: cláusula de propriedade intelectual
- [ ] Para dados pessoais: cláusula de LGPD
- [ ] Nenhum [DADO_AUSENTE] no documento final
- [ ] Todos os valores em centavos
