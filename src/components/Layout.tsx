import { ReactNode } from "react";
import BottomNav from "./BottomNav";

interface LayoutProps {
  children: ReactNode;
  showBottomNav?: boolean;
}

const Layout = ({ children, showBottomNav = true }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background pb-16">
      <main className="max-w-4xl mx-auto">
        {children}
      </main>
      {showBottomNav && <BottomNav />}
    </div>
  );
};

export default Layout;