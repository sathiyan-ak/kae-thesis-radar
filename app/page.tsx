import { Dashboard } from "@/components/dashboard";
import { companies } from "@/lib/companies";
import { thesisOpportunities } from "@/lib/thesis";

export default function HomePage() {
  return <Dashboard companies={companies} thesis={thesisOpportunities} />;
}
