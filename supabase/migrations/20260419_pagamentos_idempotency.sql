-- Adiciona idempotency_key na tabela pagamentos para evitar duplicação em retries de webhook
ALTER TABLE pagamentos
  ADD COLUMN IF NOT EXISTS idempotency_key TEXT UNIQUE;

-- Preenche registros existentes com o stripe_session_id como chave retroativa
UPDATE pagamentos
  SET idempotency_key = stripe_session_id
  WHERE idempotency_key IS NULL AND stripe_session_id IS NOT NULL;
