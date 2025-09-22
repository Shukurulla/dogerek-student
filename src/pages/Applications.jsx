import {
  Card,
  Tag,
  Typography,
  Empty,
  Badge,
  Row,
  Col,
  Statistic,
  Divider,
} from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
  BookOutlined,
  UserOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useGetMyApplicationsQuery } from "../store/api/studentApi";
import LoadingSpinner from "../components/LoadingSpinner";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function Applications() {
  const { data, isLoading } = useGetMyApplicationsQuery();
  const applications = data?.data || [];

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <ClockCircleOutlined className="text-orange-500" />;
      case "approved":
        return <CheckCircleOutlined className="text-green-500" />;
      case "rejected":
        return <CloseCircleOutlined className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusTag = (status) => {
    const config = {
      pending: { color: "orange", text: "Kutilmoqda" },
      approved: { color: "green", text: "Qabul qilingan" },
      rejected: { color: "red", text: "Rad etilgan" },
    };
    return (
      <Tag color={config[status]?.color} icon={getStatusIcon(status)}>
        {config[status]?.text}
      </Tag>
    );
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-orange-50 border-orange-200";
      case "approved":
        return "bg-green-50 border-green-200";
      case "rejected":
        return "bg-red-50 border-red-200";
      default:
        return "";
    }
  };

  if (isLoading) return <LoadingSpinner size="large" />;

  const pendingCount = applications.filter(
    (a) => a.status === "pending"
  ).length;
  const approvedCount = applications.filter(
    (a) => a.status === "approved"
  ).length;
  const rejectedCount = applications.filter(
    (a) => a.status === "rejected"
  ).length;

  const ApplicationCard = ({ application }) => (
    <Card
      className={`shadow-md border hover:shadow-xl transition-all duration-300 ${getStatusBgColor(
        application.status
      )}`}
      cover={
        <div
          className={`h-24 flex items-center justify-center relative ${
            application.status === "pending"
              ? "bg-gradient-to-r from-orange-400 to-orange-500"
              : application.status === "approved"
              ? "bg-gradient-to-r from-green-400 to-green-500"
              : "bg-gradient-to-r from-red-400 to-red-500"
          }`}
        >
          <BookOutlined className="text-4xl text-white/80" />
          <div className="absolute top-3 right-3">
            {getStatusTag(application.status)}
          </div>
        </div>
      }
    >
      <div className="space-y-3">
        {/* Club Name */}
        <div>
          <Title level={5} className="!mb-1">
            {application.club?.name}
          </Title>
          {application.club?.schedule && (
            <Text className="text-xs text-gray-500">
              {application.club.schedule.time?.start} -{" "}
              {application.club.schedule.time?.end}
            </Text>
          )}
        </div>

        <Divider className="my-2" />

        {/* Application Date */}
        <div className="flex items-center gap-2">
          <CalendarOutlined className="text-gray-400" />
          <div>
            <Text className="text-xs text-gray-500 block">Ariza sanasi</Text>
            <Text className="text-sm font-medium">
              {dayjs(application.applicationDate).format("DD.MM.YYYY")}
            </Text>
            <Text className="text-xs text-gray-500">
              {dayjs(application.applicationDate).format("HH:mm")}
            </Text>
          </div>
        </div>

        {/* Response Date */}
        {application.processedDate && (
          <div className="flex items-center gap-2">
            <FileTextOutlined className="text-gray-400" />
            <div>
              <Text className="text-xs text-gray-500 block">Javob sanasi</Text>
              <Text className="text-sm font-medium">
                {dayjs(application.processedDate).format("DD.MM.YYYY HH:mm")}
              </Text>
            </div>
          </div>
        )}

        {/* Processed By */}
        {application.processedBy && (
          <div className="flex items-center gap-2">
            <UserOutlined className="text-gray-400" />
            <div>
              <Text className="text-xs text-gray-500 block">Ko'rib chiqdi</Text>
              <Text className="text-sm">
                {application.processedBy?.profile?.fullName || "Ma'mur"}
              </Text>
            </div>
          </div>
        )}

        {/* Status Message */}
        {application.status === "rejected" && application.rejectionReason && (
          <div className="p-3 bg-red-100 rounded-lg border border-red-200">
            <div className="flex items-start gap-2">
              <ExclamationCircleOutlined className="text-red-500 mt-1" />
              <div>
                <Text className="text-xs text-red-700 font-medium block mb-1">
                  Rad etilish sababi:
                </Text>
                <Text className="text-sm text-red-600">
                  {application.rejectionReason}
                </Text>
              </div>
            </div>
          </div>
        )}

        {application.status === "approved" && (
          <div className="p-3 bg-green-100 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <CheckCircleOutlined className="text-green-500" />
              <Text className="text-green-700 font-medium">
                Tabriklaymiz! Arizangiz qabul qilindi ✅
              </Text>
            </div>
          </div>
        )}

        {application.status === "pending" && (
          <div className="p-3 bg-orange-100 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2">
              <ClockCircleOutlined className="text-orange-500" />
              <Text className="text-orange-700 text-sm">
                Arizangiz ko'rib chiqilmoqda...
              </Text>
            </div>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <Title level={3}>Mening arizalarim</Title>

      {/* Statistics Cards */}
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={8}>
          <Card className="border border-orange-200 bg-orange-50">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-gray-600 text-xs sm:text-sm">
                  Kutilayotgan
                </Text>
                <div className="text-xl sm:text-2xl font-bold text-orange-600 mt-1">
                  {pendingCount}
                </div>
              </div>
              <ClockCircleOutlined className="text-2xl sm:text-3xl text-orange-400" />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card className="border border-green-200 bg-green-50">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-gray-600 text-xs sm:text-sm">
                  Qabul qilingan
                </Text>
                <div className="text-xl sm:text-2xl font-bold text-green-600 mt-1">
                  {approvedCount}
                </div>
              </div>
              <CheckCircleOutlined className="text-2xl sm:text-3xl text-green-400" />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card className="border border-red-200 bg-red-50">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-gray-600 text-xs sm:text-sm">
                  Rad etilgan
                </Text>
                <div className="text-xl sm:text-2xl font-bold text-red-600 mt-1">
                  {rejectedCount}
                </div>
              </div>
              <CloseCircleOutlined className="text-2xl sm:text-3xl text-red-400" />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Applications Grid */}
      {applications.length > 0 ? (
        <Row gutter={[16, 16]}>
          {applications.map((application) => (
            <Col
              key={application._id}
              xs={24} // Mobile: 1 column
              sm={12} // Tablet: 2 columns
              lg={8} // Desktop: 3 columns
            >
              <ApplicationCard application={application} />
            </Col>
          ))}
        </Row>
      ) : (
        <Card className="text-center py-8 md:py-12">
          <Empty description="Hali ariza topshirmadingiz" />
        </Card>
      )}
    </div>
  );
}
