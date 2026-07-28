import { redirect } from "next/navigation";

export default function HomePage() {
  // Redirect home to /app
  redirect("/app");
}
