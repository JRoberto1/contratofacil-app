export default function Footer() {
  return (
    <footer className="bg-surface-container-low w-full py-12 pb-24 md:pb-12">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 w-full max-w-7xl mx-auto border-t border-outline-variant/15 pt-8">
        <div className="mb-4 md:mb-0">
          <p className="text-xs font-medium font-body text-slate-500 opacity-70">
            ContratoFácil — Um produto FlowIQ © 2024
          </p>
        </div>
        <div className="flex gap-8">
          <a href="#" className="text-xs font-medium font-body text-slate-500 hover:text-primary transition-opacity">Termos</a>
          <a href="#" className="text-xs font-medium font-body text-slate-500 hover:text-primary transition-opacity">Privacidade</a>
          <a href="#" className="text-xs font-medium font-body text-slate-500 hover:text-primary transition-opacity">Ajuda</a>
        </div>
      </div>
    </footer>
  );
}
