import { useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Badge } from "antd";
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

const { Sider } = Layout;

export default function Sidebar({ collapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: applicationsData } = useGetMyApplicationsQuery();

  const pendingCount =
    applicationsData?.data?.filter((a) => a.status === "pending").length || 0;

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

  return (
    <Sider
      width={256}
      collapsed={collapsed}
      className="!fixed left-0 top-0 bottom-0 z-10 shadow-xl"
      theme="dark"
      style={{
        background: "linear-gradient(180deg, #006d75 0%, #08979c 100%)",
      }}
    >
      <div className="h-16 flex items-center justify-center border-b border-cyan-700">
        <h1
          className={`text-white font-bold transition-all duration-300 ${
            collapsed ? "text-xl" : "text-2xl"
          }`}
        >
          {collapsed ? "S" : "Student Panel"}
        </h1>
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        className="mt-4 bg-transparent"
        style={{ background: "transparent" }}
      />
    </Sider>
  );
}
