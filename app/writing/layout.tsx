import type { ReactNode } from "react";
import "@/components/writing/writing.css";

export default function WritingLayout({ children }: { children: ReactNode }) {
  return <div className="writing">{children}</div>;
}
