-- Migration: renomear status 'gerado' para 'concluido' e adicionar 'enviado'
-- Execute este script no Supabase SQL Editor

-- 1. Remover constraint antiga que pode não incluir 'concluido' ou 'enviado'
ALTER TABLE public.contratos DROP CONSTRAINT IF EXISTS contratos_status_check;

-- 2. Adicionar constraint com todos os valores válidos
ALTER TABLE public.contratos ADD CONSTRAINT contratos_status_check
  CHECK (status IN ('rascunho', 'concluido', 'pago', 'enviado'));

-- 3. Migrar registros com status antigo 'gerado' para 'concluido'
UPDATE public.contratos SET status = 'concluido' WHERE status = 'gerado';

-- 4. Promover contratos que já foram baixados mas ainda estão como 'rascunho'
UPDATE public.contratos
  SET status = 'concluido'
  WHERE downloads_count > 0 AND status = 'rascunho';

-- 5. Corrigir a função check_imutavel para não bloquear mudanças de status
CREATE OR REPLACE FUNCTION public.check_imutavel()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.imutavel = TRUE THEN
    -- Apenas bloqueia alterações no conteúdo do contrato, não no status
    IF NEW.conteudo IS DISTINCT FROM OLD.conteudo THEN
      RAISE EXCEPTION 'Contrato imutável: conteúdo não pode ser alterado.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- 6. Recriar o trigger
DROP TRIGGER IF EXISTS prevent_imutavel_update ON public.contratos;
CREATE TRIGGER prevent_imutavel_update
  BEFORE UPDATE ON public.contratos
  FOR EACH ROW EXECUTE FUNCTION public.check_imutavel();

-- 7. Recarregar schema cache do PostgREST
NOTIFY pgrst, 'reload schema';
