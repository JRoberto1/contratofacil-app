import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import EditarContratoClient from "./EditarContratoClient";

export default async function ContratoIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: contrato, error } = await supabase
    .from('contratos')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !contrato) {
    notFound();
  }

  if (contrato.usuario_id !== user.id) {
    redirect("/meus-contratos");
  }

  return <EditarContratoClient contrato={contrato} contratoId={id} />;
}
