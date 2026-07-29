import { notFound } from "next/navigation";
import { CompanyView } from "@/components/views";
import { candidates } from "@/lib/healthtech-data";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const candidate = candidates.find(c => c.slug === slug);
  if (!candidate) notFound();
  return <CompanyView candidate={candidate}/>;
}
