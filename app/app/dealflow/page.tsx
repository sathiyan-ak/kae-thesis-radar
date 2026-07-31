import { Suspense } from "react";
import { DealflowView } from "@/components/views";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <DealflowView />
    </Suspense>
  );
}
