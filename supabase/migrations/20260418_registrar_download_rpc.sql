-- Função RPC para registrar download, executada diretamente no PostgreSQL
-- sem passar pela camada de validação do PostgREST.
CREATE OR REPLACE FUNCTION public.registrar_download(p_contrato_id UUID, p_usuario_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
  v_status TEXT;
BEGIN
  SELECT downloads_count, status INTO v_count, v_status
  FROM public.contratos
  WHERE id = p_contrato_id AND usuario_id = p_usuario_id;

  IF NOT FOUND THEN
    RETURN json_build_object('error', 'not_found');
  END IF;

  UPDATE public.contratos
  SET
    downloads_count = COALESCE(v_count, 0) + 1,
    status = CASE WHEN v_status = 'rascunho' THEN 'gerado' ELSE v_status END
  WHERE id = p_contrato_id AND usuario_id = p_usuario_id;

  RETURN json_build_object('ok', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.registrar_download(UUID, UUID) TO authenticated;

-- Reload schema cache do PostgREST
NOTIFY pgrst, 'reload schema';
