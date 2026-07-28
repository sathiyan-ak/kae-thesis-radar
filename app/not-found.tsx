import Link from "next/link";

export default function NotFound() {
  return <main className="flex min-h-screen items-center justify-center p-6"><div className="glass max-w-md rounded-2xl p-8 text-center"><p className="text-sm text-zinc-500">Screen not found</p><h1 className="mt-3 text-2xl font-semibold text-white">This company is not in the seed pipeline.</h1><Link href="/" className="mt-6 inline-flex rounded-xl bg-emerald-200 px-4 py-2.5 text-sm font-semibold text-[#082017]">Return to dashboard</Link></div></main>;
}
