-- Criação da tabela de auditoria de IA (logs_qualidade)

CREATE TABLE IF NOT EXISTS public.logs_qualidade (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    contrato_id UUID REFERENCES public.contratos(id) ON DELETE CASCADE,
    alertas TEXT[] NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configurações de RLS (Row Level Security)
ALTER TABLE public.logs_qualidade ENABLE ROW LEVEL SECURITY;

-- Como é apenas registro interno da API Service Role e verificação, 
-- não precisamos dar SELECT para usuários anônimos. 
-- Podemos dar permissão de INSERT para admin ou service_role,
-- Mas no backend o createClient() pode usar a role autenticada se for o dono.
-- Para simplificar a API, permitimos que o usuário insira o log no próprio contrato,
-- ou desabilitamos restrições rígidas se for via service_role.

CREATE POLICY "Usuários podem ver seus próprios logs"
    ON public.logs_qualidade
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.contratos
            WHERE contratos.id = logs_qualidade.contrato_id
            AND contratos.usuario_id = auth.uid()
        )
    );

CREATE POLICY "Usuários logados podem registrar anomalias de contrato"
    ON public.logs_qualidade
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');
