ALTER TABLE public.contratos ADD COLUMN IF NOT EXISTS referencia TEXT;
ALTER TABLE public.contratos ADD COLUMN IF NOT EXISTS downloads_count INTEGER DEFAULT 0;
ALTER TABLE public.contratos ADD COLUMN IF NOT EXISTS imutavel BOOLEAN DEFAULT FALSE;

-- Marcar como imutável contratos que já estavam finalizados.
UPDATE public.contratos SET imutavel = TRUE WHERE status = 'gerado';

-- Tabela downloads
CREATE TABLE IF NOT EXISTS public.downloads (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    contrato_id UUID REFERENCES public.contratos(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seus próprios downloads"
    ON public.downloads
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários logados podem registrar downloads"
    ON public.downloads
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- TRIGGER PostgreSQL de Imutabilidade e Segurança Estrutural Absoluta
CREATE OR REPLACE FUNCTION public.prevent_imutavel_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Se o campo anterior era imutavel verdadeiro E O conteudo na atualização foi modificado: barrar.
  IF OLD.imutavel = true AND NEW.conteudo IS DISTINCT FROM OLD.conteudo THEN
    RAISE EXCEPTION 'Acesso negado: O conteúdo deste contrato foi finalizado. Por motivos de segurança, não pode ser sobrescrito.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_imutavel_conteudo ON public.contratos;

CREATE TRIGGER enforce_imutavel_conteudo
BEFORE UPDATE ON public.contratos
FOR EACH ROW
EXECUTE FUNCTION public.prevent_imutavel_update();
