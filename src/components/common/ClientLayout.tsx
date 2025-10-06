
'use client';

import { usePathname } from "next/navigation";
import Chatbot from "./Chatbot";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/' || pathname === '/login';

  return (
    <main>
      {children}
      {!isLoginPage && <Chatbot />}
    </main>
  );
}
