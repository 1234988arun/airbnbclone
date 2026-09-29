'use client'

import { usePathname } from "next/navigation";
import Nav from "./Nav";


const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const isSlugPage =
  pathname !== "/" &&
  pathname.split("/").filter(Boolean).length === 1;

  const hideNav =   pathname === "/not-found" || pathname === "/login" || pathname === "/signup" || pathname === "/auth/auth-failed" || pathname === "/listingpage1" || pathname === "/listingpage2" ||
  pathname === "/listingpage3" || pathname === "/mylisting" || isSlugPage
  ;
  return (
    <div className="layout-shell">
      {!hideNav && <div className="navbar-wrapper"><Nav /></div>}
      {children}
    </div>
  );
};

export default Layout;