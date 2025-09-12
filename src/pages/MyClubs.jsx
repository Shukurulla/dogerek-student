import {
  Card,
  Row,
  Col,
  Typography,
  Empty,
  Tag,
  Button,
  List,
  Avatar,
} from "antd";
import {
  BookOutlined,
  UserOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  CalendarOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useGetMyClubsQuery } from "../store/api/studentApi";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function MyClubs() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetMyClubsQuery();
  const clubs = data?.data || [];

  const weekDays = {
    1: "Dushanba",
    2: "Seshanba",
    3: "Chorshanba",
    4: "Payshanba",
    5: "Juma",
    6: "Shanba",
    7: "Yakshanba",
  };

  const weekType = {
    odd: "Toq haftalar",
    even: "Juft haftalar",
    both: "Har hafta",
  };

  if (isLoading) return <LoadingSpinner size="large" />;

  if (clubs.length === 0) {
    return (
      <div className="space-y-6">
        <Title level={3}>Mening to'garaklarim</Title>
        <Card className="text-center py-12">
          <Empty
            description="Siz hali hech qanday to'garakka a'zo emassiz"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button
              type="primary"
              onClick={() => navigate("/all-clubs")}
              className="bg-gradient-to-r from-cyan-500 to-teal-600 border-0"
            >
              To'garak tanlash
            </Button>
          </Empty>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title level={3}>Mening to'garaklarim</Title>
        <Tag color="green" icon={<CheckCircleOutlined />} className="px-3 py-1">
          {clubs.length} ta to'garak
        </Tag>
      </div>

      <Row gutter={[16, 16]}>
        {clubs.map((club) => (
          <Col xs={24} lg={12} xl={8} key={club._id}>
            <Card
              className="h-full shadow-md border-0 hover:shadow-xl transition-all duration-300"
              cover={
                <div className="h-40 bg-gradient-to-r from-cyan-500 to-teal-600 flex items-center justify-center relative">
                  <BookOutlined className="text-5xl text-white/80" />
                  <Tag
                    color="green"
                    className="absolute top-4 right-4 px-3 py-1"
                  >
                    A'zo
                  </Tag>
                </div>
              }
            >
              <div className="space-y-4">
                <div>
                  <Title level={5} className="!mb-2">
                    {club.name}
                  </Title>
                  <Tag color="cyan">{club.faculty?.name}</Tag>
                </div>

                {club.description && (
                  <Text className="text-gray-600 text-sm block">
                    {club.description}
                  </Text>
                )}

                <div className="space-y-3 pt-3 border-t">
                  <div className="flex items-start gap-3">
                    <UserOutlined className="text-gray-400 mt-1" />
                    <div>
                      <Text className="text-sm block font-medium">
                        {club.tutor?.profile?.fullName}
                      </Text>
                      <Text className="text-xs text-gray-500">O'qituvchi</Text>
                      {club.tutor?.profile?.phone && (
                        <div className="flex items-center gap-1 mt-1">
                          <PhoneOutlined className="text-xs text-gray-400" />
                          <Text className="text-xs text-gray-500">
                            {club.tutor.profile.phone}
                          </Text>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <ClockCircleOutlined className="text-gray-400" />
                    <div>
                      <Text className="text-sm">
                        {club.schedule?.time?.start} -{" "}
                        {club.schedule?.time?.end}
                      </Text>
                      <Text className="text-xs text-gray-500 block">
                        {weekType[club.schedule?.weekType]}
                      </Text>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CalendarOutlined className="text-gray-400 mt-1" />
                    <div className="flex flex-wrap gap-1">
                      {club.schedule?.days?.map((day) => (
                        <Tag key={day} color="blue" className="m-0">
                          {weekDays[day]}
                        </Tag>
                      ))}
                    </div>
                  </div>

                  {club.location && (
                    <div className="flex items-center gap-3">
                      <EnvironmentOutlined className="text-gray-400" />
                      <Text className="text-sm">{club.location}</Text>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <TeamOutlined className="text-gray-400" />
                    <Text className="text-sm">
                      {club.currentStudents || 0} talaba
                    </Text>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <Text className="text-xs text-gray-500">
                      A'zo bo'lgan sana
                    </Text>
                    <Text className="text-sm font-medium">
                      {dayjs(club.enrolledAt).format("DD.MM.YYYY")}
                    </Text>
                  </div>
                  {club.approvedAt && (
                    <div className="flex justify-between items-center mt-1">
                      <Text className="text-xs text-gray-500">
                        Tasdiqlangan sana
                      </Text>
                      <Text className="text-sm font-medium">
                        {dayjs(club.approvedAt).format("DD.MM.YYYY")}
                      </Text>
                    </div>
                  )}
                </div>

                {club.telegramChannelLink && (
                  <a
                    href={club.telegramChannelLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button type="primary" ghost block icon={<TeamOutlined />}>
                      Telegram kanalga qo'shilish
                    </Button>
                  </a>
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
