import { Card, Tag, Button, Progress, Typography, Space, Tooltip } from "antd";
import {
  BookOutlined,
  UserOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SendOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

export default function ClubCard({ club, onApply, applying }) {
  const weekDays = {
    1: "Du",
    2: "Se",
    3: "Ch",
    4: "Pa",
    5: "Ju",
    6: "Sh",
    7: "Ya",
  };

  const weekType = {
    odd: "Toq haftalar",
    even: "Juft haftalar",
    both: "Har hafta",
  };

  const isEnrolled = club.enrollmentStatus === "approved";
  const isPending = club.enrollmentStatus === "pending";
  const isRejected = club.enrollmentStatus === "rejected";
  const isFull = club.capacity && club.currentStudents >= club.capacity;

  const getStatusButton = () => {
    if (isEnrolled) {
      return (
        <Button
          block
          disabled
          icon={<CheckCircleOutlined />}
          className="bg-green-50 text-green-600 border-green-200"
        >
          Ro'yxatdan o'tgansiz
        </Button>
      );
    }
    if (isPending) {
      return (
        <Button
          block
          disabled
          icon={<ClockCircleOutlined />}
          className="bg-orange-50 text-orange-600 border-orange-200"
        >
          Ariza ko'rib chiqilmoqda
        </Button>
      );
    }
    if (isRejected) {
      return (
        <Button
          block
          disabled
          icon={<CloseCircleOutlined />}
          className="bg-red-50 text-red-600 border-red-200"
        >
          Ariza rad etilgan
        </Button>
      );
    }
    if (isFull) {
      return (
        <Button block disabled>
          To'garak to'lgan
        </Button>
      );
    }
    return (
      <Button
        type="primary"
        block
        icon={<SendOutlined />}
        onClick={() => onApply(club._id)}
        loading={applying}
        className="bg-gradient-to-r from-cyan-500 to-teal-600 border-0"
      >
        Ariza topshirish
      </Button>
    );
  };

  const percentage = club.capacity
    ? (club.currentStudents / club.capacity) * 100
    : 0;

  return (
    <Card
      className="h-full shadow-md border-0 hover:shadow-xl transition-all duration-300"
      cover={
        <div className="h-32 bg-gradient-to-r from-cyan-500 to-teal-600 flex items-center justify-center">
          <BookOutlined className="text-5xl text-white/80" />
        </div>
      }
    >
      <div className="space-y-3">
        <div>
          <Title level={5} className="!mb-1">
            {club.name}
          </Title>
          <Tag color="cyan">{club.faculty?.name}</Tag>
        </div>

        {club.description && (
          <Text className="text-gray-600 text-sm line-clamp-2">
            {club.description}
          </Text>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <UserOutlined className="text-gray-400" />
            <Text className="text-sm">{club.tutor?.profile?.fullName}</Text>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <ClockCircleOutlined className="text-gray-400" />
            <Text className="text-sm">
              {club.schedule?.time?.start} - {club.schedule?.time?.end}
            </Text>
          </div>

          <div className="flex items-center gap-2">
            <CalendarOutlined className="text-gray-400" />
            <div className="flex gap-1">
              {club.schedule?.days?.map((day) => (
                <Tag key={day} color="blue" className="m-0 text-xs">
                  {weekDays[day]}
                </Tag>
              ))}
            </div>
          </div>

          {club.location && (
            <div className="flex items-center gap-2 text-gray-600">
              <EnvironmentOutlined className="text-gray-400" />
              <Text className="text-sm">{club.location}</Text>
            </div>
          )}
        </div>

        <div className="pt-3 border-t">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1">
              <TeamOutlined className="text-gray-400" />
              <Text className="text-sm text-gray-600">O'rinlar</Text>
            </div>
            <Text className="font-medium">
              {club.currentStudents} / {club.capacity || "∞"}
            </Text>
          </div>
          {club.capacity && (
            <Progress
              percent={percentage}
              size="small"
              strokeColor={{
                "0%": "#13c2c2",
                "100%": percentage > 90 ? "#ff4d4f" : "#52c41a",
              }}
              showInfo={false}
            />
          )}
        </div>

        <div className="pt-3">{getStatusButton()}</div>
      </div>
    </Card>
  );
}
