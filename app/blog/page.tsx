import { redirect } from "next/navigation";

// Canonical route moved to /writing. This preserves old /blog links.
export default function BlogIndexRedirect() {
  redirect("/writing");
}
