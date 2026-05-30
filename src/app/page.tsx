"use client";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [activePreviewLayout, setActivePreviewLayout] = useState(0);

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const previewPills = [
    "Completo Formal",
    "Executivo",
    "Simplificado",
    "Minimalista",
  ];

  const professions = [
    { icon: "photo_camera", name: "Fotógrafo" },
    { icon: "videocam", name: "Videomaker" },
    { icon: "palette", name: "Designer Gráfico" },
    { icon: "code", name: "Desenvolvedor" },
    { icon: "smartphone", name: "Social Media" },
    { icon: "edit", name: "Redator" },
    { icon: "electrical_services", name: "Eletricista" },
    { icon: "format_paint", name: "Pintor" },
    { icon: "construction", name: "Pedreiro" },
    { icon: "content_cut", name: "Cabeleireiro" },
    { icon: "fitness_center", name: "Personal Trainer" },
    { icon: "restaurant", name: "Chef" },
  ];

  return (
    <main>
      {/* Hero Section */}
      <header className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold uppercase tracking-wider mb-8">
          <span className="material-symbols-outlined text-sm" data-icon="verified" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          2 contratos por mês grátis
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold font-headline tracking-tight text-primary leading-tight max-w-4xl mb-6">
          Contrato profissional em 5 minutos. Sem advogado, sem complicação.
        </h1>
        <p className="text-on-surface-variant text-lg max-w-2xl mb-10 font-body">
          Chega de burocracia ou documentos genéricos. Gere contratos juridicamente seguros e personalizados para sua profissão em instantes.
        </p>
        <Link 
          href="/gerar" 
          className="signature-gradient text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 inline-block"
        >
          Gerar meu contrato grátis
        </Link>
      </header>

      {/* Social Proof */}
      <section className="bg-surface-container-low w-full">
        <div className="max-w-7xl mx-auto px-6 py-6 md:py-8 flex flex-col md:flex-row justify-center items-center gap-6">
          <div className="flex-1 flex justify-center text-center">
            <span className="font-bold text-xs uppercase tracking-widest text-on-surface-variant font-body">16 milhões de MEIs no Brasil</span>
          </div>
          <div className="hidden md:block w-px h-8 bg-outline-variant/30"></div>
          <div className="flex-1 flex justify-center text-center md:hidden w-1/2 h-px bg-outline-variant/30 my-2"></div>
          <div className="flex-1 flex justify-center text-center">
            <span className="font-bold text-xs uppercase tracking-widest text-on-surface-variant font-body">5 minutos para gerar</span>
          </div>
          <div className="hidden md:block w-px h-8 bg-outline-variant/30"></div>
          <div className="flex-1 flex justify-center text-center md:hidden w-1/2 h-px bg-outline-variant/30 my-2"></div>
          <div className="flex-1 flex justify-center text-center">
            <span className="font-bold text-xs uppercase tracking-widest text-on-surface-variant font-body">4 formatos de contrato</span>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-24 bg-[#fff5f3]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold font-headline text-primary mb-4">Por que você precisa disso</h2>
            <p className="text-on-surface-variant max-w-xl mx-auto font-body">Proteja seu trabalho e garanta seus recebimentos sem as complicações do passado.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-2xl shadow-sm flex flex-col">
              <div className="w-14 h-14 rounded-full bg-[#ffe8e0] flex items-center justify-center text-[#ff5a36] mb-6 shadow-sm">
                <span className="material-symbols-outlined text-3xl">gavel</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-on-surface font-headline">Advogado cobra R$ 300–800</h3>
              <p className="text-on-surface-variant font-body leading-relaxed text-sm">Por um contrato simples que você poderia ter em minutos.</p>
            </div>
            <div className="bg-white p-10 rounded-2xl shadow-sm flex flex-col">
              <div className="w-14 h-14 rounded-full bg-[#ffe8e0] flex items-center justify-center text-[#ff5a36] mb-6 shadow-sm">
                <span className="material-symbols-outlined text-3xl">description</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-on-surface font-headline">Templates do Google não servem</h3>
              <p className="text-on-surface-variant font-body leading-relaxed text-sm">Modelos genéricos não têm as cláusulas do seu serviço específico.</p>
            </div>
            <div className="bg-white p-10 rounded-2xl shadow-sm flex flex-col">
              <div className="w-14 h-14 rounded-full bg-[#ffe8e0] flex items-center justify-center text-[#ff5a36] mb-6 shadow-sm">
                <span className="material-symbols-outlined text-3xl">schedule</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-on-surface font-headline">Processo manual leva horas</h3>
              <p className="text-on-surface-variant font-body leading-relaxed text-sm">E ainda pode estar errado — sem garantia jurídica nenhuma.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold font-headline text-primary mb-4">Como funciona</h2>
          </div>
          
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Desktop only dashed line */}
            <div className="hidden md:block absolute top-[60px] left-[16.6%] right-[16.6%] h-[2px] border-t-2 border-dashed border-outline-variant/30 z-0"></div>
            
            <div className="flex flex-col items-center text-center z-10 relative bg-white px-4">
              <div className="w-32 h-32 flex flex-col items-center justify-center mb-6 relative">
                <span className="text-[5rem] font-extrabold font-headline text-[#002b73] opacity-5 absolute -top-4">01</span>
                <div className="w-16 h-16 rounded-2xl bg-[#f0f4f8] flex items-center justify-center text-primary relative z-10">
                  <span className="material-symbols-outlined text-3xl">category</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 font-headline text-on-surface">Escolha sua profissão</h3>
              <p className="text-on-surface-variant text-sm font-body max-w-[250px]">Fotógrafo, designer, eletricista e muito mais.</p>
            </div>
            
            <div className="flex flex-col items-center text-center z-10 relative bg-white px-4">
              <div className="w-32 h-32 flex flex-col items-center justify-center mb-6 relative">
                <span className="text-[5rem] font-extrabold font-headline text-[#002b73] opacity-5 absolute -top-4">02</span>
                <div className="w-16 h-16 rounded-2xl bg-[#f0f4f8] flex items-center justify-center text-primary relative z-10">
                  <span className="material-symbols-outlined text-3xl">edit_note</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 font-headline text-on-surface">Preencha o formulário</h3>
              <p className="text-on-surface-variant text-sm font-body max-w-[250px]">Nome, valor, prazo e entregáveis — em linguagem simples.</p>
            </div>
            
            <div className="flex flex-col items-center text-center z-10 relative bg-white px-4">
              <div className="w-32 h-32 flex flex-col items-center justify-center mb-6 relative">
                <span className="text-[5rem] font-extrabold font-headline text-[#002b73] opacity-5 absolute -top-4">03</span>
                <div className="w-16 h-16 rounded-2xl bg-[#f0f4f8] flex items-center justify-center text-primary relative z-10">
                  <span className="material-symbols-outlined text-3xl">picture_as_pdf</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 font-headline text-on-surface">Baixe o PDF</h3>
              <p className="text-on-surface-variant text-sm font-body max-w-[250px]">Contrato profissional pronto para enviar ao cliente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feito para sua profissão */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold font-headline text-primary mb-4">Feito para a sua profissão</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {professions.map((prof) => (
              <Link key={prof.name} href="/gerar" className="flex items-center justify-center gap-3 bg-white p-5 rounded-2xl shadow-sm hover:bg-primary-fixed/30 border-2 border-transparent hover:border-primary active:scale-95 transition-all group outline-none">
                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">{prof.icon}</span>
                <span className="font-bold font-headline text-on-surface text-sm">{prof.name}</span>
              </Link>
            ))}
            <Link href="/gerar" className="flex items-center justify-center gap-3 bg-surface-container-low p-5 rounded-2xl border-2 border-dashed border-outline-variant hover:border-primary hover:bg-surface-container transition-all group outline-none">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">more_horiz</span>
              <span className="font-bold font-headline text-on-surface-variant group-hover:text-primary text-sm transition-colors">Outras profissões</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Veja o contrato antes de pagar */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-extrabold font-headline text-primary mb-12 text-center">Veja o contrato antes de pagar</h2>
          
          {/* Card Formato Documento */}
          <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-xl overflow-hidden relative" style={{ backgroundImage: "radial-gradient(#e1e3e4 0.5px, transparent 0.5px)", backgroundSize: "20px 20px" }}>
            <div className="p-8 pb-32">
              <h3 className="font-headline font-bold text-primary text-center text-sm md:text-base uppercase tracking-wide mb-6">CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h3>
              <div className="w-full h-px bg-outline-variant/20 mb-8"></div>
              
              <div className="space-y-4 mb-12">
                <div className="h-4 w-full bg-surface-container-highest rounded"></div>
                <div className="h-4 w-11/12 bg-surface-container-highest rounded"></div>
                <div className="h-4 w-3/4 bg-surface-container-highest rounded"></div>
                <div className="h-4 w-full bg-surface-container-highest rounded"></div>
                <div className="h-4 w-5/6 bg-surface-container-highest rounded"></div>
                <div className="h-4 w-full bg-surface-container-highest rounded"></div>
                <div className="h-4 w-2/3 bg-surface-container-highest rounded"></div>
                <div className="h-4 w-10/12 bg-surface-container-highest rounded"></div>
              </div>
              
              <div className="flex justify-between items-center px-4">
                <div className="flex flex-col items-center w-[45%]">
                  <div className="w-full h-px border-t border-dashed border-outline-variant/40 mb-2"></div>
                  <span className="font-body text-[9px] uppercase tracking-widest text-on-surface-variant text-center">ASSINATURA CONTRATANTE</span>
                </div>
                <div className="flex flex-col items-center w-[45%]">
                  <div className="w-full h-px border-t border-dashed border-outline-variant/40 mb-2"></div>
                  <span className="font-body text-[9px] uppercase tracking-widest text-on-surface-variant text-center">ASSINATURA CONTRATADO</span>
                </div>
              </div>
            </div>
            
            {/* Fade effect */}
            <div className="absolute bottom-0 left-0 right-0 h-[80px]" style={{ background: "linear-gradient(to bottom, transparent, white)" }}></div>
          </div>
          
          {/* Scrollable Horizontal Pills */}
          <div className="mt-10 overflow-x-auto w-full max-w-4xl no-scrollbar pb-4 flex justify-start md:justify-center">
            <div className="flex gap-3 px-4 min-w-max">
              {previewPills.map((pill, index) => (
                <button
                  key={index}
                  onClick={() => setActivePreviewLayout(index)}
                  className={`px-6 py-3 rounded-full font-bold font-body text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    activePreviewLayout === index 
                      ? "bg-primary text-white shadow-md" 
                      : "bg-surface-container-high text-on-surface-variant hover:bg-outline-variant hover:text-on-surface"
                  }`}
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Validade Juridica */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold font-headline text-primary">Tem validade jurídica?</h2>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-[#3B6D11] text-3xl">check_circle</span>
              <p className="font-body text-on-surface font-medium max-w-[220px]">O Código de Processo Civil reconhece documentos eletrônicos</p>
            </div>
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-[#3B6D11] text-3xl">check_circle</span>
              <p className="font-body text-on-surface font-medium max-w-[220px]">Link de aceite por e-mail incluso em todo contrato</p>
            </div>
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-[#3B6D11] text-3xl">check_circle</span>
              <p className="font-body text-on-surface font-medium max-w-[220px]">Cláusula LGPD incluída automaticamente</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold font-headline text-center text-primary mb-4">Planos que cabem no seu momento</h2>
          <p className="text-center text-on-surface-variant font-body mb-16 max-w-xl mx-auto">Comece grátis e evolua conforme sua demanda. Sem fidelidade, cancele quando quiser.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-stretch">

            {/* Grátis */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl flex flex-col shadow-sm border border-outline-variant/20">
              <span className="text-[11px] font-bold uppercase tracking-widest text-outline mb-3">Grátis</span>
              <div className="mb-1">
                <span className="text-3xl font-extrabold font-headline text-on-surface">R$ 0</span>
              </div>
              <p className="text-[11px] text-on-surface-variant mb-5 font-body">Sem cartão</p>
              <ul className="text-xs space-y-2.5 mb-6 text-on-surface-variant font-body flex-1">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[15px] text-[#3B6D11]">check</span>2 contratos/mês</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[15px] text-[#3B6D11]">check</span>PDF profissional</li>
              </ul>
              <Link href="/gerar" className="block w-full py-2.5 rounded-full bg-surface-container-high text-on-surface font-bold text-sm text-center hover:bg-surface-container-highest transition-colors font-headline">Começar agora</Link>
            </div>

            {/* Avulso */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl flex flex-col shadow-sm border border-outline-variant/20">
              <span className="text-[11px] font-bold uppercase tracking-widest text-outline mb-3">Avulso</span>
              <div className="mb-1 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold font-headline text-on-surface">R$ 4,90</span>
                <span className="text-xs text-on-surface-variant font-body">/contrato</span>
              </div>
              <p className="text-[11px] text-on-surface-variant mb-5 font-body">Pague só quando precisar</p>
              <ul className="text-xs space-y-2.5 mb-6 text-on-surface-variant font-body flex-1">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[15px] text-[#3B6D11]">check</span>Categorias ilimitadas</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[15px] text-[#3B6D11]">check</span>PDF profissional</li>
              </ul>
              <Link href="/planos#avulso" className="block w-full py-2.5 rounded-full bg-surface-container-high text-on-surface font-bold text-sm text-center hover:bg-surface-container-highest transition-colors font-headline">Começar agora</Link>
            </div>

            {/* Mensal — DESTAQUE */}
            <div className="bg-primary p-6 rounded-2xl flex flex-col shadow-xl relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#ff5a36] text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-md whitespace-nowrap">⭐ Mais Popular</div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/70 mb-3 mt-2">Mensal</span>
              <div className="mb-1 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold font-headline text-white">R$ 19</span>
                <span className="text-xs text-white/70 font-body">/mês</span>
              </div>
              <p className="text-[11px] text-white/70 mb-5 font-body">Contratos ilimitados</p>
              <ul className="text-xs space-y-2.5 mb-6 text-white/90 font-body flex-1">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[15px] text-white">check</span>Uso ilimitado</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[15px] text-white">check</span>Histórico completo</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[15px] text-white">check</span>4 formatos de exportação</li>
              </ul>
              <Link href="/planos" className="block w-full py-2.5 rounded-full bg-white text-primary font-bold text-sm text-center hover:bg-surface-container-low transition-colors font-headline shadow-sm">Começar agora</Link>
            </div>

            {/* Semestral */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl flex flex-col shadow-sm border border-outline-variant/20">
              <span className="text-[11px] font-bold uppercase tracking-widest text-outline mb-3">Semestral</span>
              <div className="mb-1 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold font-headline text-on-surface">R$ 89</span>
                <span className="text-xs text-on-surface-variant font-body">/6 meses</span>
              </div>
              <p className="text-[11px] text-[#3B6D11] font-bold mb-5 font-body">−22% · Economia real</p>
              <ul className="text-xs space-y-2.5 mb-6 text-on-surface-variant font-body flex-1">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[15px] text-[#3B6D11]">check</span>Todos os recursos Pro</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[15px] text-[#3B6D11]">check</span>Contratos ilimitados</li>
              </ul>
              <Link href="/planos" className="block w-full py-2.5 rounded-full bg-surface-container-high text-on-surface font-bold text-sm text-center hover:bg-surface-container-highest transition-colors font-headline">Começar agora</Link>
            </div>

            {/* Anual */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl flex flex-col shadow-sm border border-outline-variant/20">
              <span className="text-[11px] font-bold uppercase tracking-widest text-outline mb-3">Anual</span>
              <div className="mb-1 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold font-headline text-on-surface">R$ 159</span>
                <span className="text-xs text-on-surface-variant font-body">/ano</span>
              </div>
              <p className="text-[11px] text-[#3B6D11] font-bold mb-5 font-body">Melhor custo-benefício</p>
              <ul className="text-xs space-y-2.5 mb-6 text-on-surface-variant font-body flex-1">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[15px] text-[#3B6D11]">check</span>Acesso Premium total</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[15px] text-[#3B6D11]">check</span>Prioridade no suporte</li>
              </ul>
              <Link href="/planos" className="block w-full py-2.5 rounded-full bg-surface-container-high text-on-surface font-bold text-sm text-center hover:bg-surface-container-highest transition-colors font-headline">Começar agora</Link>
            </div>

          </div>

          {/* Incluso em todos os planos pagos */}
          <div className="mt-12 pt-10 border-t border-outline-variant/20">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-6 font-label">Incluso em todos os planos pagos</p>
            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
              {[
                { icon: "history",          label: "Histórico completo" },
                { icon: "picture_as_pdf",   label: "PDF Profissional" },
                { icon: "description",      label: "Download em Word" },
                { icon: "support_agent",    label: "Suporte por e-mail" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[20px] text-primary">{icon}</span>
                  <span className="text-xs font-medium font-body">{label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Dúvidas Frequentes FAQ */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold font-headline text-primary">Dúvidas frequentes</h2>
          </div>
          <div className="flex flex-col space-y-3">
            {[
              { q: "Preciso de advogado para usar?", a: "Não. O ContratoFácil foi feito para qualquer pessoa usar sem nenhum conhecimento jurídico. Basta preencher o formulário em linguagem simples." },
              { q: "Em quanto tempo o contrato fica pronto?", a: "Em menos de 5 minutos após preencher o formulário. A IA gera o documento instantaneamente." },
              { q: "Posso editar o contrato depois de gerado?", a: "Sim. O contrato é totalmente editável antes do download. Você pode ajustar qualquer cláusula diretamente na plataforma." },
              { q: "Como funciona o pagamento?", a: "Pix instantâneo para o avulso de R$ 4,90. Planos de assinatura também disponíveis a partir de R$ 19/mês para contratos ilimitados." }
            ].map((faq, idx) => (
              <div key={idx} className={`rounded-xl transition-all duration-300 overflow-hidden cursor-pointer ${faqOpen === idx ? 'bg-surface-container-lowest' : 'bg-surface-container-low'}`}>
                <button onClick={() => toggleFaq(idx)} className="w-full text-left p-5 flex items-center justify-between outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
                  <span className="font-bold font-headline text-on-surface pr-4">{faq.q}</span>
                  <span className={`material-symbols-outlined transition-transform duration-300 flex-shrink-0 text-primary ${faqOpen === idx ? 'rotate-180' : ''}`}>keyboard_arrow_down</span>
                </button>
                <div className={`px-5 font-body text-sm text-on-surface-variant transition-all duration-300 ${faqOpen === idx ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0 overflow-hidden pb-0'}`}>
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-[#002b73] py-20 w-full flex justify-center">
        <div className="px-6 flex flex-col items-center text-center max-w-[560px]">
          <h2 className="text-4xl font-extrabold font-headline text-white mb-10 leading-tight">Formalize seu próximo serviço agora.</h2>
          <Link href="/gerar" className="bg-white text-[#002b73] font-bold font-headline rounded-full px-12 py-4 mb-4 hover:bg-surface-container-low active:scale-95 transition-all block w-full md:w-auto">
            Gerar contrato grátis
          </Link>
          <span className="font-body text-[13px] text-white/60 font-medium">Sem cartão · 2 contratos grátis por mês</span>
        </div>
      </section>
    </main>
  );
}
