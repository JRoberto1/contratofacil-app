-- =============================================================================
-- ContratoFácil — Schema do Banco de Dados
-- © 2026 FlowIQ. Todos os direitos reservados.
--
-- Execute este arquivo no SQL Editor do Supabase:
-- supabase.com → seu projeto → SQL Editor → New Query → cole e Execute
-- =============================================================================

-- -----------------------------------------------------------------------------
-- EXTENSÕES
-- -----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- TABELA: perfis de usuário
-- Criado automaticamente quando o usuário faz login pela primeira vez
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.perfis (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  nome          TEXT,
  avatar_url    TEXT,
  plano         TEXT NOT NULL DEFAULT 'gratis'
                CHECK (plano IN ('gratis', 'avulso', 'mensal', 'semestral', 'anual')),
  contratos_mes INTEGER NOT NULL DEFAULT 0,
  periodo_reset DATE NOT NULL DEFAULT CURRENT_DATE,
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- TABELA: contratos gerados
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contratos (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id       UUID NOT NULL REFERENCES public.perfis(id) ON DELETE CASCADE,

  -- Dados do formulário
  categoria        TEXT NOT NULL,
  categoria_custom TEXT,

  -- Prestador
  prestador_nome   TEXT NOT NULL,
  prestador_doc    TEXT NOT NULL,

  -- Cliente
  cliente_nome     TEXT NOT NULL,
  cliente_doc      TEXT NOT NULL,

  -- Serviço
  servico_descricao    TEXT NOT NULL,
  servico_valor        NUMERIC(10,2) NOT NULL,
  servico_prazo        TEXT NOT NULL,
  servico_pagamento    TEXT NOT NULL,

  -- Contrato gerado
  tipo             TEXT NOT NULL DEFAULT 'completo-formal'
                   CHECK (tipo IN ('completo-formal','resumido-formal','completo-dia-a-dia','resumido-dia-a-dia')),
  conteudo         TEXT,
  status           TEXT NOT NULL DEFAULT 'rascunho'
                   CHECK (status IN ('rascunho', 'pago', 'enviado')),

  -- PDF
  pdf_url          TEXT,
  pdf_gerado_em    TIMESTAMPTZ,

  -- Pagamento
  pago             BOOLEAN NOT NULL DEFAULT FALSE,
  stripe_session_id TEXT,
  pago_em          TIMESTAMPTZ,

  criado_em        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- TABELA: pagamentos / assinaturas
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pagamentos (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id        UUID NOT NULL REFERENCES public.perfis(id) ON DELETE CASCADE,
  contrato_id       UUID REFERENCES public.contratos(id) ON DELETE SET NULL,
  plano             TEXT NOT NULL,
  valor_centavos    INTEGER NOT NULL,
  metodo            TEXT NOT NULL CHECK (metodo IN ('pix', 'cartao')),
  status            TEXT NOT NULL DEFAULT 'pendente'
                    CHECK (status IN ('pendente', 'aprovado', 'falhou', 'reembolsado')),
  stripe_session_id TEXT,
  abacate_id        TEXT,
  criado_em         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS)
-- Cada usuário só acessa seus próprios dados
-- -----------------------------------------------------------------------------
ALTER TABLE public.perfis   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contratos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;

-- Perfis
CREATE POLICY "usuario_le_proprio_perfil"
  ON public.perfis FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "usuario_atualiza_proprio_perfil"
  ON public.perfis FOR UPDATE
  USING (auth.uid() = id);

-- Contratos
CREATE POLICY "usuario_le_proprios_contratos"
  ON public.contratos FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "usuario_insere_proprio_contrato"
  ON public.contratos FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "usuario_atualiza_proprio_contrato"
  ON public.contratos FOR UPDATE
  USING (auth.uid() = usuario_id);

CREATE POLICY "usuario_deleta_proprio_contrato"
  ON public.contratos FOR DELETE
  USING (auth.uid() = usuario_id);

-- Pagamentos
CREATE POLICY "usuario_le_proprios_pagamentos"
  ON public.pagamentos FOR SELECT
  USING (auth.uid() = usuario_id);

-- Service role pode fazer tudo (webhooks de pagamento)
CREATE POLICY "service_role_full_access_contratos"
  ON public.contratos FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "service_role_full_access_pagamentos"
  ON public.pagamentos FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "service_role_full_access_perfis"
  ON public.perfis FOR ALL
  USING (auth.role() = 'service_role');

-- -----------------------------------------------------------------------------
-- TRIGGER: criar perfil automaticamente após signup
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.perfis (id, email, nome, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------------------------------------
-- TRIGGER: atualiza updated_at automaticamente
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_perfis_updated_at
  BEFORE UPDATE ON public.perfis
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_contratos_updated_at
  BEFORE UPDATE ON public.contratos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- -----------------------------------------------------------------------------
-- STORAGE: bucket para PDFs gerados
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('contratos-pdf', 'contratos-pdf', false)
ON CONFLICT (id) DO NOTHING;

-- Apenas o próprio usuário acessa seu PDF
CREATE POLICY "usuario_acessa_proprio_pdf"
  ON storage.objects FOR SELECT
  USING (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "service_role_upload_pdf"
  ON storage.objects FOR INSERT
  WITH CHECK (auth.role() = 'service_role');
