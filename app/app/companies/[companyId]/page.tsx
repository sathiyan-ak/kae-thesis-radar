import { notFound } from "next/navigation";
import { CompanyView } from "@/components/views";
import { candidates } from "@/lib/healthtech-data";

export default async function Page({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;
  const candidate = candidates.find((c) => c.slug === companyId);
  if (!candidate) notFound();
  return <CompanyView candidate={candidate} />;
}
