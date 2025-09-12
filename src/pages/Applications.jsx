import { Card, Table, Tag, Typography, Empty, Badge } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
  BookOutlined,
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

  const columns = [
    {
      title: "To'garak",
      key: "club",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <BookOutlined className="text-cyan-500 text-lg" />
          <div>
            <Text className="font-medium">{record.club?.name}</Text>
            <Text className="block text-xs text-gray-500">
              {record.club?.schedule?.time?.start} -{" "}
              {record.club?.schedule?.time?.end}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Ariza sanasi",
      dataIndex: "applicationDate",
      key: "date",
      render: (date) => (
        <div className="flex items-center gap-2">
          <CalendarOutlined className="text-gray-400" />
          <div>
            <Text>{dayjs(date).format("DD.MM.YYYY")}</Text>
            <Text className="block text-xs text-gray-500">
              {dayjs(date).format("HH:mm")}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Javob sanasi",
      dataIndex: "processedDate",
      key: "processedDate",
      render: (date) =>
        date ? (
          <Text>{dayjs(date).format("DD.MM.YYYY HH:mm")}</Text>
        ) : (
          <Text className="text-gray-400">-</Text>
        ),
    },
    {
      title: "Sabab",
      dataIndex: "rejectionReason",
      key: "reason",
      width: 250,
      render: (reason, record) => {
        if (record.status === "rejected" && reason) {
          return (
            <div className="p-2 bg-red-50 rounded">
              <Text className="text-red-600 text-sm">{reason}</Text>
            </div>
          );
        }
        if (record.status === "approved") {
          return <Text className="text-green-600">Tabriklaymiz! ✅</Text>;
        }
        return <Text className="text-gray-400">-</Text>;
      },
    },
  ];

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

  return (
    <div className="space-y-6">
      <Title level={3}>Mening arizalarim</Title>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-orange-200 bg-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-gray-600">Kutilayotgan</Text>
              <div className="text-2xl font-bold text-orange-600 mt-1">
                {pendingCount}
              </div>
            </div>
            <ClockCircleOutlined className="text-3xl text-orange-400" />
          </div>
        </Card>

        <Card className="border border-green-200 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-gray-600">Qabul qilingan</Text>
              <div className="text-2xl font-bold text-green-600 mt-1">
                {approvedCount}
              </div>
            </div>
            <CheckCircleOutlined className="text-3xl text-green-400" />
          </div>
        </Card>

        <Card className="border border-red-200 bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-gray-600">Rad etilgan</Text>
              <div className="text-2xl font-bold text-red-600 mt-1">
                {rejectedCount}
              </div>
            </div>
            <CloseCircleOutlined className="text-3xl text-red-400" />
          </div>
        </Card>
      </div>

      <Card className="border-0 shadow-md">
        {applications.length > 0 ? (
          <Table
            columns={columns}
            dataSource={applications}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Jami: ${total} ta`,
            }}
          />
        ) : (
          <Empty description="Hali ariza topshirmadingiz" className="py-12" />
        )}
      </Card>
    </div>
  );
}
