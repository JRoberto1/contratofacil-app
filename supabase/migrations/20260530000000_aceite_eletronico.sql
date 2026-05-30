-- Migration: Aceite Eletrônico
-- Adiciona colunas para rastreamento de aceite com validade jurídica (MP 2.200-2/2001)

ALTER TABLE contratos
  ADD COLUMN IF NOT EXISTS token_aceite      UUID         DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS token_expira_em   TIMESTAMPTZ  DEFAULT NOW() + INTERVAL '30 days',
  ADD COLUMN IF NOT EXISTS aceite_em         TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS aceite_ip         VARCHAR(45),
  ADD COLUMN IF NOT EXISTS aceite_user_agent TEXT,
  ADD COLUMN IF NOT EXISTS aceite_status     TEXT         DEFAULT 'pendente'
    CHECK (aceite_status IN ('pendente', 'aceito', 'expirado'));

-- Índice para busca rápida por token (página pública não usa auth)
CREATE INDEX IF NOT EXISTS idx_contratos_token_aceite
  ON contratos(token_aceite);

-- RLS: leitura pública por token (sem autenticação — necessário para a página do cliente)
CREATE POLICY "Leitura pública por token de aceite"
  ON contratos FOR SELECT
  USING (token_aceite IS NOT NULL);
