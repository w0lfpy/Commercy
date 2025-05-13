'use client';
import { AuthProvider } from "@/context/AuthContext";
import {Navbar} from "@/components";
import { usePathname } from "next/navigation";
import '@/styles/globals.css';

const metadata = {
  title: 'Commerce App',
  name: 'Commerce App',
  description: 'E-commerce app for small businesses',
  keywords: "tienda, online, ecommerce, pequeños, negocios",
};

export default function RootLayout({ children }) {
  const pathName = usePathname();
  const hideNavBarRoutes = ["/login", "/register"];
  const shouldHideNavBar = hideNavBarRoutes.includes(pathName);

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {!shouldHideNavBar && <Navbar />}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
