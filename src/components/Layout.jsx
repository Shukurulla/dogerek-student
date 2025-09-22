import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Layout as AntLayout } from "antd";
import Sidebar from "./Sidebar";
import Header from "./Header";

const { Content } = AntLayout;

export default function Layout() {
  const [collapsed, setCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto-collapse sidebar on mobile
      if (mobile) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <AntLayout className="min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <AntLayout
        className={`transition-all duration-300 ${
          isMobile ? "ml-0" : collapsed ? "ml-20" : "ml-64"
        }`}
      >
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content className="p-3 md:p-6 bg-gray-50 min-h-[calc(100vh-64px)]">
          <div className="animate-fade-in max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </Content>
      </AntLayout>
    </AntLayout>
  );
}
