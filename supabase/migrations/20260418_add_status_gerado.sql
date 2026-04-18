-- Adiciona o status 'gerado' ao CHECK constraint da tabela contratos
-- Execute no SQL Editor do Supabase

ALTER TABLE public.contratos DROP CONSTRAINT IF EXISTS contratos_status_check;

ALTER TABLE public.contratos
  ADD CONSTRAINT contratos_status_check
  CHECK (status IN ('rascunho', 'gerado', 'pago', 'enviado'));

-- Atualiza contratos que já têm conteudo e downloads para o novo status
UPDATE public.contratos
  SET status = 'gerado'
  WHERE downloads_count > 0 AND status = 'rascunho';
