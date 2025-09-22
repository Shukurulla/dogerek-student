import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Layout,
  Button,
  Dropdown,
  Avatar,
  Space,
  Badge,
  Typography,
  Drawer,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { logout } from "../store/api/authApi";
import { useGetMyApplicationsQuery } from "../store/api/studentApi";
import { message } from "antd";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

export default function Header({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { student } = useSelector((state) => state.auth);
  const { data: applicationsData } = useGetMyApplicationsQuery();

  const notifications =
    applicationsData?.data?.filter(
      (a) => a.status !== "pending" && !a.notification?.seen
    ) || [];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    message.success("Tizimdan chiqdingiz");
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profil",
      onClick: () => navigate("/profile"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Chiqish",
      onClick: handleLogout,
    },
  ];

  const notificationItems = notifications.map((notif, index) => ({
    key: index,
    label: (
      <div className="py-1">
        <Text className="font-medium block">{notif.club?.name} to'garak</Text>
        <Text className="block text-xs text-gray-500">
          Arizangiz{" "}
          {notif.status === "approved" ? "qabul qilindi" : "rad etildi"}
        </Text>
      </div>
    ),
    onClick: () => navigate("/applications"),
  }));

  return (
    <AntHeader className="bg-white px-3 md:px-6 flex items-center justify-between shadow-sm sticky top-0 z-10">
      {/* Left Section */}
      <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className="text-lg"
        />

        {/* Desktop Student Info */}
        <div className="hidden sm:flex items-center gap-2">
          <IdcardOutlined className="text-cyan-600" />
          <Text className="font-medium text-gray-700 text-sm md:text-base">
            {student?.student_id_number}
          </Text>
          <Text className="text-gray-500 hidden md:inline">|</Text>
          <Text className="text-gray-600 text-sm md:text-base hidden md:inline">
            {student?.group?.name}
          </Text>
        </div>

        {/* Mobile Student Info */}
        <div className="sm:hidden">
          <Text className="font-medium text-gray-700 text-xs truncate">
            {student?.student_id_number}
          </Text>
        </div>
      </div>

      {/* Right Section */}
      <Space size={[8, 0]} className="flex-shrink-0">
        {/* Notifications */}
        <Dropdown
          menu={{ items: notificationItems }}
          placement="bottomRight"
          disabled={notifications.length === 0}
          trigger={["click"]}
        >
          <Badge count={notifications.length} size="small">
            <Button
              type="text"
              shape="circle"
              icon={<BellOutlined className="text-base md:text-lg" />}
              size="small"
            />
          </Badge>
        </Dropdown>

        {/* User Menu */}
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          arrow
          trigger={["click"]}
        >
          <Space
            className="cursor-pointer hover:bg-gray-50 px-1 md:px-3 py-1 rounded-lg transition-colors"
            size={[4, 0]}
          >
            <Avatar
              src={student?.image}
              icon={!student?.image && <UserOutlined />}
              className="bg-cyan-500"
              size={window.innerWidth < 640 ? "small" : "default"}
            />
            {/* Desktop Name Display */}
            <div className="text-left hidden md:block">
              <div className="font-medium text-sm">{student?.full_name}</div>
              <div className="text-xs text-gray-500 hidden lg:block">
                {student?.department?.name}
              </div>
            </div>
            {/* Mobile Name Display - First name only */}
            <div className="text-left block md:hidden">
              <Text className="text-xs font-medium truncate max-w-[80px]">
                {student?.first_name || student?.full_name?.split(" ")[0]}
              </Text>
            </div>
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  );
}
