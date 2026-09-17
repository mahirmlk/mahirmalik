import { permanentRedirect } from "next/navigation";

// Canonical route moved to /writing. This preserves old /blog links.
// 308 (permanent) passes link equity from old /blog backlinks.
export default function BlogIndexRedirect() {
  permanentRedirect("/writing");
}
