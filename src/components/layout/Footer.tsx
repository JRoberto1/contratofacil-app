import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#f7f9fb] dark:bg-[#191c1e] full-width mb-20 flex flex-col items-center justify-center py-8 px-4 opacity-60">
      <div className="flex gap-4 mb-4">
        <Link className="text-[10px] font-['Inter'] font-normal text-[#74777f] dark:text-[#8e9199] no-underline hover:text-[#002b73] dark:hover:text-[#d6e3ff] transition-colors" href="/termos">Termos</Link>
        <Link className="text-[10px] font-['Inter'] font-normal text-[#74777f] dark:text-[#8e9199] no-underline hover:text-[#002b73] dark:hover:text-[#d6e3ff] transition-colors" href="/privacidade">Privacidade</Link>
      </div>
      <p className="text-[10px] font-['Inter'] font-normal text-[#74777f] dark:text-[#8e9199]">Um produto FlowIQ</p>
    </footer>
  );
}
