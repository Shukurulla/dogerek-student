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
      <div>
        <Text className="font-medium">{notif.club?.name} to'garak</Text>
        <Text className="block text-xs text-gray-500">
          Arizangiz{" "}
          {notif.status === "approved" ? "qabul qilindi" : "rad etildi"}
        </Text>
      </div>
    ),
    onClick: () => navigate("/applications"),
  }));

  return (
    <AntHeader className="bg-white px-6 flex items-center justify-between shadow-sm sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className="text-lg"
        />

        <div className="flex items-center gap-2">
          <IdcardOutlined className="text-cyan-600" />
          <Text className="font-medium text-gray-700">
            {student?.student_id_number}
          </Text>
          <Text className="text-gray-500">|</Text>
          <Text className="text-gray-600">{student?.group?.name}</Text>
        </div>
      </div>

      <Space size="large">
        <Dropdown
          menu={{ items: notificationItems }}
          placement="bottomRight"
          disabled={notifications.length === 0}
        >
          <Badge count={notifications.length} size="small">
            <Button
              type="text"
              shape="circle"
              icon={<BellOutlined className="text-lg" />}
            />
          </Badge>
        </Dropdown>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
          <Space className="cursor-pointer hover:bg-gray-50 px-3 py-1 rounded-lg transition-colors">
            <Avatar
              src={student?.image}
              icon={!student?.image && <UserOutlined />}
              className="bg-cyan-500"
            />
            <div className="text-left">
              <div className="font-medium">{student?.full_name}</div>
              <div className="text-xs text-gray-500">
                {student?.department?.name}
              </div>
            </div>
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  );
}
