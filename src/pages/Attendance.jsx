import { useState } from "react";
import {
  Card,
  Table,
  Select,
  DatePicker,
  Typography,
  Empty,
  Tag,
  Progress,
  Row,
  Col,
  Statistic,
  Button,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
  BookOutlined,
  TrophyOutlined,
  WarningOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import {
  useGetMyAttendanceQuery,
  useGetMyClubsQuery,
} from "../store/api/studentApi";
import LoadingSpinner from "../components/LoadingSpinner";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function Attendance() {
  const [filters, setFilters] = useState({
    clubId: null,
    startDate: null,
    endDate: null,
  });

  const { data: clubsData, isLoading: clubsLoading } = useGetMyClubsQuery();
  const { data, isLoading } = useGetMyAttendanceQuery(filters);

  const clubs = clubsData?.data || [];
  const attendance = data?.data || [];

  if (clubsLoading || isLoading) return <LoadingSpinner size="large" />;

  // Calculate statistics
  const totalClasses = attendance.length;
  const presentCount = attendance.filter((a) => a.present).length;
  const absentCount = attendance.filter((a) => !a.present).length;
  const attendancePercentage =
    totalClasses > 0 ? ((presentCount / totalClasses) * 100).toFixed(1) : 0;

  const getStatusTag = (present) => {
    if (present) {
      return (
        <Tag color="green" icon={<CheckCircleOutlined />}>
          Kelgan
        </Tag>
      );
    }
    return (
      <Tag color="red" icon={<CloseCircleOutlined />}>
        Kelmagan
      </Tag>
    );
  };

  const columns = [
    {
      title: "To'garak",
      key: "club",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <BookOutlined className="text-cyan-500" />
          <Text className="font-medium">{record.club?.name}</Text>
        </div>
      ),
    },
    {
      title: "Sana",
      dataIndex: "date",
      key: "date",
      render: (date) => (
        <div className="flex items-center gap-2">
          <CalendarOutlined className="text-gray-400" />
          <div>
            <Text>{dayjs(date).format("DD.MM.YYYY")}</Text>
            <Text className="block text-xs text-gray-500">
              {dayjs(date).format("dddd")}
            </Text>
          </div>
        </div>
      ),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
      defaultSortOrder: "descend",
    },
    {
      title: "Status",
      dataIndex: "present",
      key: "present",
      render: (present) => getStatusTag(present),
      filters: [
        { text: "Kelgan", value: true },
        { text: "Kelmagan", value: false },
      ],
      onFilter: (value, record) => record.present === value,
    },
    {
      title: "Sabab",
      dataIndex: "reason",
      key: "reason",
      width: 250,
      render: (reason, record) => {
        if (!record.present && reason) {
          return (
            <div className="p-2 bg-orange-50 rounded">
              <Text className="text-orange-600 text-sm">{reason}</Text>
            </div>
          );
        }
        return <Text className="text-gray-400">-</Text>;
      },
    },
    {
      title: "Dars materiali",
      key: "material",
      render: (_, record) => {
        if (record.telegramPostLink) {
          return (
            <Button
              type="link"
              icon={<LinkOutlined />}
              href={record.telegramPostLink}
              target="_blank"
              size="small"
            >
              Telegram post
            </Button>
          );
        }
        return <Text className="text-gray-400">-</Text>;
      },
    },
  ];

  const handleDateChange = (dates) => {
    if (dates) {
      setFilters({
        ...filters,
        startDate: dates[0]?.format("YYYY-MM-DD"),
        endDate: dates[1]?.format("YYYY-MM-DD"),
      });
    } else {
      setFilters({
        ...filters,
        startDate: null,
        endDate: null,
      });
    }
  };

  if (isLoading) return <LoadingSpinner size="large" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title level={3}>Mening davomatim</Title>

        <div className="flex gap-3">
          <Select
            placeholder="To'garak tanlang"
            style={{ width: 200 }}
            allowClear
            onChange={(value) => setFilters({ ...filters, clubId: value })}
          >
            {clubs.map((club) => (
              <Select.Option key={club._id} value={club._id}>
                {club.name}
              </Select.Option>
            ))}
          </Select>

          <RangePicker
            placeholder={["Boshlanish", "Tugash"]}
            format="DD.MM.YYYY"
            onChange={handleDateChange}
          />
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <Card className="border-0 shadow-md">
            <Statistic
              title="Jami darslar"
              value={totalClasses}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#13c2c2" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={6}>
          <Card className="border-0 shadow-md">
            <Statistic
              title="Qatnashgan"
              value={presentCount}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={6}>
          <Card className="border-0 shadow-md">
            <Statistic
              title="Qatnashmagan"
              value={absentCount}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={6}>
          <Card className="border-0 shadow-md">
            <Statistic
              title="Davomat"
              value={attendancePercentage}
              suffix="%"
              prefix={<TrophyOutlined />}
              valueStyle={{
                color:
                  attendancePercentage >= 75
                    ? "#52c41a"
                    : attendancePercentage >= 50
                    ? "#fa8c16"
                    : "#ff4d4f",
              }}
            />
            <Progress
              percent={parseFloat(attendancePercentage)}
              showInfo={false}
              strokeColor={{
                "0%": "#ff4d4f",
                "50%": "#fa8c16",
                "100%": "#52c41a",
              }}
              className="mt-2"
            />
          </Card>
        </Col>
      </Row>

      {attendancePercentage < 75 && totalClasses > 0 && (
        <Card className="border-l-4 border-orange-400 bg-orange-50">
          <div className="flex items-center gap-3">
            <WarningOutlined className="text-2xl text-orange-500" />
            <div>
              <Text className="font-medium text-orange-900">
                Diqqat! Sizning davomatingiz past
              </Text>
              <Text className="block text-sm text-orange-700 mt-1">
                To'garak darslariga muntazam qatnashing. Davomat 75% dan past
                bo'lsa, to'garakdan chetlatilishingiz mumkin.
              </Text>
            </div>
          </div>
        </Card>
      )}

      <Card className="border-0 shadow-md">
        {attendance.length > 0 ? (
          <Table
            columns={columns}
            dataSource={attendance}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Jami: ${total} ta`,
            }}
            rowClassName={(record) => (!record.present ? "bg-red-50" : "")}
          />
        ) : (
          <Empty
            description="Davomat ma'lumotlari mavjud emas"
            className="py-12"
          />
        )}
      </Card>

      {clubs.length > 0 && (
        <Card className="bg-gradient-to-r from-cyan-50 to-teal-50 border-0">
          <Title level={5} className="mb-4">
            To'garaklar bo'yicha davomat
          </Title>
          <Row gutter={[16, 16]}>
            {clubs.map((club) => {
              const clubAttendance = attendance.filter(
                (a) => a.club?._id === club._id
              );
              const clubPresent = clubAttendance.filter(
                (a) => a.present
              ).length;
              const clubTotal = clubAttendance.length;
              const clubPercentage =
                clubTotal > 0
                  ? ((clubPresent / clubTotal) * 100).toFixed(1)
                  : 0;

              return (
                <Col xs={24} sm={12} md={8} key={club._id}>
                  <div className="bg-white rounded-lg p-4">
                    <Text className="font-medium block mb-2">{club.name}</Text>
                    <div className="flex justify-between items-center mb-2">
                      <Text className="text-sm text-gray-500">
                        {clubPresent}/{clubTotal} dars
                      </Text>
                      <Text
                        className="font-bold"
                        style={{
                          color:
                            clubPercentage >= 75
                              ? "#52c41a"
                              : clubPercentage >= 50
                              ? "#fa8c16"
                              : "#ff4d4f",
                        }}
                      >
                        {clubPercentage}%
                      </Text>
                    </div>
                    <Progress
                      percent={parseFloat(clubPercentage)}
                      size="small"
                      showInfo={false}
                      strokeColor={{
                        "0%": "#ff4d4f",
                        "50%": "#fa8c16",
                        "100%": "#52c41a",
                      }}
                    />
                  </div>
                </Col>
              );
            })}
          </Row>
        </Card>
      )}
    </div>
  );
}
