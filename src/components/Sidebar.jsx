import { useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Badge, Drawer } from "antd";
import {
  DashboardOutlined,
  AppstoreOutlined,
  BookOutlined,
  FormOutlined,
  GlobalOutlined,
  CalendarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useGetMyApplicationsQuery } from "../store/api/studentApi";
import { useState, useEffect } from "react";
import { logo } from "../../public";

const { Sider } = Layout;

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const { data: applicationsData } = useGetMyApplicationsQuery();

  const pendingCount =
    applicationsData?.data?.filter((a) => a.status === "pending").length || 0;

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close drawer on mobile after navigation
  const handleMenuClick = (key) => {
    navigate(key);
    if (isMobile) {
      setCollapsed(true);
    }
  };

  const menuItems = [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/all-clubs",
      icon: <AppstoreOutlined />,
      label: "Barcha to'garaklar",
    },
    {
      key: "/my-clubs",
      icon: <BookOutlined />,
      label: "Mening to'garaklarim",
    },
    {
      key: "/applications",
      icon: <FormOutlined />,
      label: (
        <span className="flex items-center justify-between">
          <span>Arizalarim</span>
          {pendingCount > 0 && <Badge count={pendingCount} className="ml-2" />}
        </span>
      ),
    },
    {
      key: "/external-courses",
      icon: <GlobalOutlined />,
      label: "Tashqi kurslar",
    },
    {
      key: "/attendance",
      icon: <CalendarOutlined />,
      label: "Davomatim",
    },
    {
      key: "/profile",
      icon: <UserOutlined />,
      label: "Profil",
    },
  ];

  const siderContent = (
    <>
      <div className="h-16 flex items-center justify-center border-b border-cyan-700">
        <h1
          className={`text-white font-bold transition-all duration-300 ${
            collapsed && !isMobile ? "text-xl" : "text-xl md:text-2xl"
          }`}
        >
          {collapsed && !isMobile ? (
            "S"
          ) : (
            <div className="flex items-center justify-start gap-2">
              <img src={logo} className="w-[50px] " alt="" />
              <p>Student panel</p>
            </div>
          )}
        </h1>
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => handleMenuClick(key)}
        className="mt-4 bg-transparent"
        style={{ background: "transparent" }}
      />
    </>
  );

  // Mobile Drawer
  if (isMobile) {
    return (
      <Drawer
        placement="left"
        closable={false}
        onClose={() => setCollapsed(true)}
        open={!collapsed}
        width={256}
        bodyStyle={{
          padding: 0,
          background: "linear-gradient(180deg, #006d75 0%, #08979c 100%)",
        }}
        className="md:hidden"
      >
        {siderContent}
      </Drawer>
    );
  }

  // Desktop Sider
  return (
    <Sider
      width={256}
      collapsed={collapsed}
      className="!fixed left-0 top-0 bottom-0 z-10 shadow-xl hidden md:block"
      theme="dark"
      style={{
        background: "linear-gradient(180deg, #006d75 0%, #08979c 100%)",
      }}
    >
      {siderContent}
    </Sider>
  );
}
