-- Converte servico_valor de NUMERIC (reais) para INTEGER (centavos)
-- Regra: domínio jurídico-financeiro exige valores monetários como inteiros em centavos
-- Ex: 1500.00 → 150000 (R$ 1.500,00)

ALTER TABLE contratos
  ALTER COLUMN servico_valor TYPE INTEGER
  USING ROUND(COALESCE(servico_valor, 0) * 100)::INTEGER;
