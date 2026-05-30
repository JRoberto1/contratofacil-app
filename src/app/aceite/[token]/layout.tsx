// Layout isolado para a página pública de aceite — sem Header, Footer ou LoginGuard
export default function AceiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      {children}
    </div>
  );
}
