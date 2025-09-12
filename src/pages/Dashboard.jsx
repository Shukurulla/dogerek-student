import React from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  Typography,
  List,
  Tag,
  Empty,
  Button,
} from "antd";
import {
  BookOutlined,
  FormOutlined,
  GlobalOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useGetStudentDashboardQuery } from "../store/api/studentApi";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function Dashboard() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetStudentDashboardQuery();

  if (isLoading) return <LoadingSpinner size="large" />;
  if (error)
    return (
      <div className="text-center py-12 text-red-500">Xatolik yuz berdi</div>
    );

  const dashboard = data?.data || {};
  const { profile, statistics, activeClubs, externalCourses } = dashboard;

  // Chart data
  const pieData = [
    { name: "Kelgan", value: statistics?.thisMonthPresent || 0 },
    {
      name: "Kelmagan",
      value:
        statistics?.thisMonthAttendance - statistics?.thisMonthPresent || 0,
    },
  ];
  const COLORS = ["#13c2c2", "#ff4d4f"];

  const StatCard = ({ title, value, icon, color, suffix, onClick }) => (
    <Card
      className="card-hover border-0 shadow-md cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <Text className="text-gray-500 text-sm">{title}</Text>
          <div className="mt-2">
            <Statistic
              value={value}
              suffix={suffix}
              valueStyle={{ fontSize: "28px", fontWeight: 600, color }}
            />
          </div>
        </div>
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center`}
          style={{ backgroundColor: `${color}20` }}
        >
          {React.cloneElement(icon, { style: { fontSize: "24px", color } })}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-cyan-500 to-teal-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <Title level={2} className="!text-white !mb-1">
              Xush kelibsiz, {profile?.full_name}!
            </Title>
            <Text className="text-white/90">
              {profile?.department?.name} • {profile?.group?.name}
            </Text>
          </div>
          <div className="text-right">
            <Text className="text-white/80 block">Student ID</Text>
            <Text className="text-xl font-bold text-white">
              {profile?.student_id_number}
            </Text>
          </div>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="To'garaklar"
            value={statistics?.enrolledClubs || 0}
            icon={<BookOutlined />}
            color="#13c2c2"
            suffix="ta"
            onClick={() => navigate("/my-clubs")}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Kutilayotgan arizalar"
            value={statistics?.pendingApplications || 0}
            icon={<FormOutlined />}
            color="#fa8c16"
            suffix="ta"
            onClick={() => navigate("/applications")}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tashqi kurslar"
            value={statistics?.externalCourses || 0}
            icon={<GlobalOutlined />}
            color="#722ed1"
            suffix="ta"
            onClick={() => navigate("/external-courses")}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Oylik davomat"
            value={statistics?.attendancePercentage || 0}
            icon={<CalendarOutlined />}
            color="#52c41a"
            suffix="%"
            onClick={() => navigate("/attendance")}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card
            title="Mening to'garaklarim"
            className="shadow-md border-0 h-full"
            extra={
              <Button type="link" onClick={() => navigate("/my-clubs")}>
                Barchasi <RightOutlined />
              </Button>
            }
          >
            {activeClubs?.length > 0 ? (
              <List
                dataSource={activeClubs.slice(0, 3)}
                renderItem={(club) => (
                  <List.Item className="border-0">
                    <div className="w-full">
                      <div className="flex justify-between items-center">
                        <Text className="font-medium">{club.name}</Text>
                        <Tag color="cyan">Faol</Tag>
                      </div>
                      {club.schedule && (
                        <Text className="text-xs text-gray-500">
                          {club.schedule.time?.start || club.schedule} -{" "}
                          {club.schedule.time?.end || ""}
                        </Text>
                      )}
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="To'garak mavjud emas">
                <Button
                  type="primary"
                  onClick={() => navigate("/all-clubs")}
                  className="bg-gradient-to-r from-cyan-500 to-teal-600 border-0"
                >
                  To'garak tanlash
                </Button>
              </Empty>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title="Oylik davomat statistikasi"
            className="shadow-md border-0 h-full"
          >
            {statistics?.thisMonthAttendance > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="flex justify-around mt-4">
                  <div className="text-center">
                    <ClockCircleOutlined className="text-2xl text-red-500 mb-1" />
                    <Text className="block text-gray-500">Kelmagan</Text>
                    <Text className="text-xl font-bold">
                      {statistics?.thisMonthAttendance -
                        statistics?.thisMonthPresent || 0}
                    </Text>
                  </div>
                </div>
              </>
            ) : (
              <Empty description="Ma'lumot mavjud emas" />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title="Tashqi kurslar"
            className="shadow-md border-0 h-full"
            extra={
              <Button type="link" onClick={() => navigate("/external-courses")}>
                Barchasi <RightOutlined />
              </Button>
            }
          >
            {externalCourses?.length > 0 ? (
              <List
                dataSource={externalCourses.slice(0, 3)}
                renderItem={(course) => (
                  <List.Item className="border-0">
                    <div className="w-full">
                      <Text className="font-medium block">{course.name}</Text>
                      <Text className="text-xs text-gray-500">
                        {course.institution}
                      </Text>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="Tashqi kurs mavjud emas">
                <Button onClick={() => navigate("/external-courses")}>
                  Kurs qo'shish
                </Button>
              </Empty>
            )}
          </Card>
        </Col>
      </Row>

      <Card
        className="shadow-md border-0 bg-gradient-to-r from-cyan-50 to-teal-50"
        bodyStyle={{ padding: 0 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0">
          <button
            className="p-6 hover:bg-white/50 transition-colors text-center"
            onClick={() => navigate("/all-clubs")}
          >
            <BookOutlined className="text-3xl text-cyan-500 mb-2" />
            <Text className="block text-gray-600">To'garaklar</Text>
            <Text className="text-lg font-bold">Ko'rish</Text>
          </button>

          <button
            className="p-6 hover:bg-white/50 transition-colors text-center"
            onClick={() => navigate("/applications")}
          >
            <FormOutlined className="text-3xl text-orange-500 mb-2" />
            <Text className="block text-gray-600">Arizalar</Text>
            <Text className="text-lg font-bold">
              {statistics?.pendingApplications || 0} ta
            </Text>
          </button>

          <button
            className="p-6 hover:bg-white/50 transition-colors text-center"
            onClick={() => navigate("/attendance")}
          >
            <CalendarOutlined className="text-3xl text-green-500 mb-2" />
            <Text className="block text-gray-600">Davomat</Text>
            <Text className="text-lg font-bold">
              {statistics?.attendancePercentage || 0}%
            </Text>
          </button>

          <button
            className="p-6 hover:bg-white/50 transition-colors text-center"
            onClick={() => navigate("/external-courses")}
          >
            <GlobalOutlined className="text-3xl text-purple-500 mb-2" />
            <Text className="block text-gray-600">Tashqi kurslar</Text>
            <Text className="text-lg font-bold">
              {statistics?.externalCourses || 0} ta
            </Text>
          </button>
        </div>
      </Card>
    </div>
  );
}
