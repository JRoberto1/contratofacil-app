-- Substitui a função check_imutavel() por implementação correta.
-- A versão original estava causando violação de constraint ao tentar
-- definir status='gerado' via UPDATE.

CREATE OR REPLACE FUNCTION public.check_imutavel()
RETURNS TRIGGER AS $$
BEGIN
  -- Bloqueia apenas mudança de conteúdo em contratos já finalizados.
  IF OLD.imutavel = true AND NEW.conteudo IS DISTINCT FROM OLD.conteudo THEN
    RAISE EXCEPTION 'Acesso negado: O conteúdo deste contrato foi finalizado e não pode ser sobrescrito.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Garante que prevent_imutavel_update aponta para a função correta.
DROP TRIGGER IF EXISTS prevent_imutavel_update ON public.contratos;
CREATE TRIGGER prevent_imutavel_update
BEFORE UPDATE ON public.contratos
FOR EACH ROW
EXECUTE FUNCTION public.check_imutavel();

-- Atualiza contratos com downloads para status gerado (corrige histórico).
UPDATE public.contratos
  SET status = 'gerado'
  WHERE downloads_count > 0 AND status = 'rascunho';
