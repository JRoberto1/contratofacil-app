import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#f7f9fb] mb-20 flex flex-col items-center justify-center py-8 px-4 opacity-60">
      <div className="flex gap-4 mb-2">
        <Link
          href="/termos"
          className="text-[10px] font-['Inter'] font-normal text-[#74777f] no-underline hover:text-[#002b73] transition-colors"
        >
          Termos
        </Link>
        <Link
          href="/privacidade"
          className="text-[10px] font-['Inter'] font-normal text-[#74777f] no-underline hover:text-[#002b73] transition-colors"
        >
          Privacidade
        </Link>
      </div>
      <p className="text-[10px] font-['Inter'] font-normal text-[#74777f]">Um produto FlowIQ</p>
    </footer>
  );
}
