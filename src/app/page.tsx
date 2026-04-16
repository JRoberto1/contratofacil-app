import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <header className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold uppercase tracking-wider mb-8">
          <span className="material-symbols-outlined text-sm" data-icon="verified" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          2 contratos por mês grátis
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold font-headline tracking-tight text-primary leading-tight max-w-4xl mb-6">
          Contrato profissional em 5 minutos.
        </h1>
        <p className="text-on-surface-variant text-lg max-w-2xl mb-10 font-body">
          Chega de burocracia ou documentos genéricos. Gere contratos juridicamente seguros e personalizados para sua profissão em instantes.
        </p>
        <Link 
          href="/gerar" 
          className="signature-gradient text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 mb-20 inline-block"
        >
          Gerar meu contrato grátis
        </Link>

        {/* Bento Grid Mockup */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full max-w-6xl">
          <div className="md:col-span-8 bg-surface-container-lowest rounded-2xl p-8 shadow-[0_20px_40px_rgba(0,43,115,0.06)] flex flex-col items-start text-left relative overflow-hidden h-[400px]">
            <div className="w-full h-full bg-surface-container-low rounded-lg p-6 opacity-60">
              <div className="h-4 w-3/4 bg-outline-variant/30 rounded mb-4"></div>
              <div className="h-4 w-1/2 bg-outline-variant/30 rounded mb-8"></div>
              <div className="space-y-3">
                <div className="h-2 w-full bg-outline-variant/20 rounded"></div>
                <div className="h-2 w-full bg-outline-variant/20 rounded"></div>
                <div className="h-2 w-5/6 bg-outline-variant/20 rounded"></div>
              </div>
            </div>
            <div className="absolute bottom-12 left-12 right-12 p-6 bg-surface-container-lowest/90 backdrop-blur-md rounded-xl border border-white/50 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full signature-gradient flex items-center justify-center text-white">
                  <span className="material-symbols-outlined">description</span>
                </div>
                <div>
                  <p className="font-bold text-primary font-body">Contrato de Prestação de Serviços</p>
                  <p className="text-xs text-on-surface-variant font-body">Pronto para assinatura digital</p>
                </div>
              </div>
            </div>
          </div>
          <div className="md:col-span-4 grid grid-rows-2 gap-6">
            <div className="bg-primary text-white rounded-2xl p-8 flex flex-col justify-center items-center">
              <span className="text-4xl font-extrabold font-headline mb-1">5min</span>
              <span className="text-sm font-label uppercase tracking-widest opacity-80">Tempo Médio</span>
            </div>
            <div className="bg-secondary-container text-on-secondary-container rounded-2xl p-8 flex flex-col justify-center items-center">
              <span className="material-symbols-outlined text-4xl mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
              <span className="text-lg font-bold font-body">100% Segurança</span>
            </div>
          </div>
        </div>
      </header>

      {/* Social Proof */}
      <section className="py-12 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center md:justify-around gap-8">
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Público</span>
            <span className="text-xl font-extrabold font-headline text-on-surface">16M de MEIs</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Velocidade</span>
            <span className="text-xl font-extrabold font-headline text-on-surface">Gerado em 5min</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Exportação</span>
            <span className="text-xl font-extrabold font-headline text-on-surface">4 Formatos Disponíveis</span>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-24 bg-[#fff5f3]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold font-headline text-primary mb-4">Por que você precisa disso?</h2>
            <p className="text-on-surface-variant max-w-xl mx-auto font-body">Proteja seu trabalho e garanta seus recebimentos sem as complicações do passado.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface-container-lowest p-10 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-full bg-[#ffdbd0] flex items-center justify-center text-[#822803] mb-6">
                <span className="material-symbols-outlined text-3xl">payments</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-primary">Advogado caro</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed font-body">Pagar milhares de reais por um contrato simples não cabe no bolso de quem está começando.</p>
            </div>
            <div className="bg-surface-container-lowest p-10 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-full bg-[#ffdbd0] flex items-center justify-center text-[#822803] mb-6">
                <span className="material-symbols-outlined text-3xl">file_copy</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-primary">Templates genéricos</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed font-body">Baixar modelos do Google é perigoso. Eles não cobrem as especificidades da sua profissão.</p>
            </div>
            <div className="bg-surface-container-lowest p-10 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-full bg-[#ffdbd0] flex items-center justify-center text-[#822803] mb-6">
                <span className="material-symbols-outlined text-3xl">edit_note</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-primary">Processo manual</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed font-body">Ficar editando nomes e valores no Word gasta tempo e causa erros de digitação fatais.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold font-headline text-primary mb-4">Como funciona</h2>
            <div className="h-1.5 w-20 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="flex flex-col items-center text-center z-10">
              <div className="w-20 h-20 rounded-2xl bg-surface-container flex items-center justify-center text-primary text-2xl font-black mb-8 shadow-inner">01</div>
              <h3 className="text-xl font-bold mb-3">Escolha sua profissão</h3>
              <p className="text-on-surface-variant text-sm font-body">Selecione o modelo base otimizado para o que você faz.</p>
            </div>
            <div className="flex flex-col items-center text-center z-10">
              <div className="w-20 h-20 rounded-2xl bg-surface-container flex items-center justify-center text-primary text-2xl font-black mb-8 shadow-inner">02</div>
              <h3 className="text-xl font-bold mb-3">Preencha o formulário</h3>
              <p className="text-on-surface-variant text-sm font-body">Responda perguntas simples e nós cuidamos do texto jurídico.</p>
            </div>
            <div className="flex flex-col items-center text-center z-10">
              <div className="w-20 h-20 rounded-2xl bg-surface-container flex items-center justify-center text-primary text-2xl font-black mb-8 shadow-inner">03</div>
              <h3 className="text-xl font-bold mb-3">Baixe em PDF</h3>
              <p className="text-on-surface-variant text-sm font-body">Seu contrato está pronto para ser enviado e assinado.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Profissões Section */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold font-headline text-primary mb-12 text-center">Feito para a sua profissão</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {["Designer Freelance", "Social Media", "Desenvolvedor", "Personal Trainer", "Fotógrafo", "Consultor", "Arquiteto", "Tradutor"].map(prof => (
              <span key={prof} className="px-6 py-3 rounded-full bg-surface-container-lowest border border-outline-variant/20 text-on-surface font-medium hover:bg-primary hover:text-white transition-all cursor-default font-body">
                {prof}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-24 bg-surface-container-lowest overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <h2 className="text-3xl font-extrabold font-headline text-primary mb-4">Veja o contrato antes de pagar</h2>
          <p className="text-on-surface-variant mb-12 font-body text-center max-w-md">Escolha o tom de voz e o nível de detalhamento do seu documento.</p>
          <div className="flex flex-wrap justify-center gap-2 mb-12 bg-surface-container-low p-2 rounded-full">
            <button className="px-6 py-2 rounded-full bg-primary text-white font-bold text-sm">Completo + Formal</button>
            <button className="px-6 py-2 rounded-full text-on-surface-variant font-medium text-sm hover:bg-surface-container transition-colors">Direto + Simples</button>
            <button className="px-6 py-2 rounded-full text-on-surface-variant font-medium text-sm hover:bg-surface-container transition-colors">Amigável + Moderno</button>
          </div>
          <div className="w-full max-w-4xl bg-white shadow-2xl rounded-t-3xl p-12 border border-outline-variant/10 relative h-[400px]">
            <div className="space-y-6">
              <div className="h-6 w-1/3 bg-surface-container rounded"></div>
              <div className="h-4 w-full bg-surface-container-low rounded"></div>
              <div className="h-4 w-full bg-surface-container-low rounded"></div>
              <div className="h-4 w-4/5 bg-surface-container-low rounded"></div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white via-white/90 to-transparent flex items-end justify-center pb-8 border-b-0">
              <p className="text-sm text-outline font-medium tracking-tight font-body">O restante do documento será revelado após a conclusão.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold font-headline text-center text-primary mb-16">Planos que cabem no seu momento</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Grátis */}
            <div className="bg-surface-container-lowest p-8 rounded-2xl flex flex-col items-center text-center shadow-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-outline mb-4">Grátis</span>
              <div className="mb-6">
                <span className="text-3xl font-extrabold font-headline">R$ 0</span>
              </div>
              <ul className="text-xs space-y-3 mb-8 text-on-surface-variant text-left w-full font-body">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-green-500">check</span> 2 Contratos/mês</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-green-500">check</span> Exportação PDF</li>
              </ul>
              <Link href="/gerar" className="block w-full py-3 rounded-full bg-surface-container-highest text-on-surface font-bold text-sm mt-auto text-center hover:bg-surface-container transition-colors">Começar</Link>
            </div>
            {/* Avulso */}
            <div className="bg-surface-container-lowest p-8 rounded-2xl flex flex-col items-center text-center shadow-xl border-2 border-primary relative">
              <div className="absolute -top-3 px-4 py-1 bg-amber-400 text-on-tertiary-fixed text-[10px] font-black uppercase rounded-full">Destaque</div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Avulso</span>
              <div className="mb-6 flex">
                <span className="text-sm font-bold align-top mt-1">R$</span>
                <span className="text-4xl font-extrabold font-headline text-primary">4,90</span>
              </div>
              <ul className="text-xs space-y-3 mb-8 text-on-surface-variant text-left w-full font-body">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-green-500">check</span> 1 Contrato único</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-green-500">check</span> Sem assinatura</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-green-500">check</span> Formato Word</li>
              </ul>
              <Link href="/gerar" className="block w-full py-3 rounded-full signature-gradient text-white font-bold text-sm mt-auto shadow-md hover:shadow-lg transition-all text-center hover:scale-[1.02]">Comprar</Link>
            </div>
            {/* Mensal */}
            <div className="bg-surface-container-lowest p-8 rounded-2xl flex flex-col items-center text-center shadow-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-outline mb-4">Mensal</span>
              <div className="mb-6">
                <span className="text-3xl font-extrabold font-headline">R$ 19</span>
              </div>
              <ul className="text-xs space-y-3 mb-8 text-on-surface-variant text-left w-full font-body">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-green-500">check</span> Contratos ilimitados</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-green-500">check</span> Cloud</li>
              </ul>
              <Link href="/planos" className="block w-full py-3 rounded-full bg-surface-container-highest text-on-surface font-bold text-sm mt-auto text-center hover:bg-surface-container transition-colors">Assinar</Link>
            </div>
            {/* Anual */}
            <div className="bg-surface-container-lowest p-8 rounded-2xl flex flex-col items-center text-center shadow-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-outline mb-4">Anual</span>
              <div className="mb-6">
                <span className="text-3xl font-extrabold font-headline text-primary">R$ 149</span>
              </div>
              <p className="text-[10px] text-on-surface-variant mb-6 font-bold">ECONOMIA DE 35%</p>
              <Link href="/planos" className="block w-full py-3 rounded-full bg-surface-container-highest text-on-surface font-bold text-sm mt-auto text-center hover:bg-surface-container transition-colors">Assinar</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6 mb-12">
        <div className="max-w-5xl mx-auto rounded-3xl bg-primary overflow-hidden relative">
          <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-black"></div>
          <div className="relative z-10 py-20 px-8 flex flex-col items-center text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold font-headline text-white mb-8 tracking-tight">Comece a proteger seu negócio hoje.</h2>
            <Link href="/gerar" className="bg-white text-primary px-10 py-5 rounded-full font-extrabold text-lg hover:bg-surface-container-lowest transition-all hover:scale-105 active:scale-95 shadow-2xl">
              Gerar meu primeiro contrato
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
