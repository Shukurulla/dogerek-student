import { useState } from "react";
import {
  Card,
  Button,
  Table,
  Typography,
  Tag,
  Empty,
  Space,
  Popconfirm,
  message,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  GlobalOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  UserOutlined,
  PhoneOutlined,
  CalendarOutlined,
  BookOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  useGetExternalCoursesQuery,
  useDeleteExternalCourseMutation,
} from "../store/api/studentApi";
import ExternalCourseModal from "../components/ExternalCourseModal";
import LoadingSpinner from "../components/LoadingSpinner";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function ExternalCourses() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const { data, isLoading } = useGetExternalCoursesQuery();
  const [deleteCourse] = useDeleteExternalCourseMutation();

  const courses = data?.data || [];

  const weekDays = {
    1: "Du",
    2: "Se",
    3: "Ch",
    4: "Pa",
    5: "Ju",
    6: "Sh",
    7: "Ya",
  };

  const handleAdd = () => {
    setEditingCourse(null);
    setModalVisible(true);
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const result = await deleteCourse(id).unwrap();
      if (result.success) {
        message.success("Tashqi kurs o'chirildi");
      }
    } catch (error) {
      message.error("Xatolik yuz berdi");
    }
  };

  const columns = [
    {
      title: "Kurs nomi",
      key: "course",
      render: (_, record) => (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOutlined className="text-purple-500" />
            <Text className="font-medium">{record.courseName}</Text>
          </div>
          <Text className="text-xs text-gray-500">
            {record.institutionName}
          </Text>
        </div>
      ),
    },
    {
      title: "Jadval",
      key: "schedule",
      render: (_, record) => (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ClockCircleOutlined className="text-gray-400" />
            <Text className="text-sm">
              {record.schedule?.time?.start} - {record.schedule?.time?.end}
            </Text>
          </div>
          <div className="flex gap-1">
            {record.schedule?.days?.map((day) => (
              <Tag key={day} color="purple" className="m-0 text-xs">
                {weekDays[day]}
              </Tag>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Manzil",
      dataIndex: "address",
      key: "address",
      render: (address) => (
        <div className="flex items-start gap-2">
          <EnvironmentOutlined className="text-gray-400 mt-1" />
          <Text className="text-sm">{address}</Text>
        </div>
      ),
    },
    {
      title: "O'qituvchi",
      key: "instructor",
      render: (_, record) => {
        if (!record.instructor?.name)
          return <Text className="text-gray-400">-</Text>;
        return (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <UserOutlined className="text-gray-400" />
              <Text className="text-sm">{record.instructor.name}</Text>
            </div>
            {record.instructor.phone && (
              <div className="flex items-center gap-2">
                <PhoneOutlined className="text-gray-400 text-xs" />
                <Text className="text-xs text-gray-500">
                  {record.instructor.phone}
                </Text>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Muddat",
      key: "duration",
      render: (_, record) => {
        if (!record.startDate) return <Text className="text-gray-400">-</Text>;
        return (
          <div className="text-sm">
            <div className="flex items-center gap-1">
              <CalendarOutlined className="text-gray-400 text-xs" />
              <Text className="text-xs">
                {dayjs(record.startDate).format("DD.MM.YYYY")}
              </Text>
            </div>
            <div className="flex items-center gap-1">
              <Text className="text-xs text-gray-400">→</Text>
              <Text className="text-xs">
                {record.endDate
                  ? dayjs(record.endDate).format("DD.MM.YYYY")
                  : "Davom etmoqda"}
              </Text>
            </div>
          </div>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        const isActive = record.isActive !== false;
        const isExpired =
          record.endDate && dayjs(record.endDate).isBefore(dayjs());

        if (!isActive) {
          return <Tag color="gray">Faol emas</Tag>;
        }
        if (isExpired) {
          return <Tag color="orange">Tugagan</Tag>;
        }
        return <Tag color="green">Faol</Tag>;
      },
    },
    {
      title: "Amallar",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="text-blue-500 hover:text-blue-600"
          />
          <Popconfirm
            title="O'chirishni tasdiqlaysizmi?"
            description="Bu amalni qaytarib bo'lmaydi"
            onConfirm={() => handleDelete(record._id)}
            okText="Ha"
            cancelText="Yo'q"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              className="text-red-500 hover:text-red-600"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isLoading) return <LoadingSpinner size="large" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title level={3}>Tashqi kurslar</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          className="bg-gradient-to-r from-purple-500 to-purple-600 border-0"
        >
          Yangi kurs qo'shish
        </Button>
      </div>

      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-0">
        <div className="flex items-center gap-3">
          <GlobalOutlined className="text-3xl text-purple-500" />
          <div>
            <Title level={5} className="!mb-1">
              Tashqi kurslar haqida
            </Title>
            <Text className="text-gray-600">
              Universitet tashqarisida qatnayotgan kurslaringizni qo'shing. Bu
              ma'lumotlar sizning band ekanligingizni ko'rsatadi.
            </Text>
          </div>
        </div>
      </Card>

      {courses.length > 0 ? (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Card className="text-center border-purple-200 bg-purple-50">
                <Statistic
                  title="Jami kurslar"
                  value={courses.length}
                  prefix={<BookOutlined />}
                  valueStyle={{ color: "#722ed1" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="text-center border-green-200 bg-green-50">
                <Statistic
                  title="Faol kurslar"
                  value={courses.filter((c) => c.isActive !== false).length}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="text-center border-orange-200 bg-orange-50">
                <Statistic
                  title="Tugagan kurslar"
                  value={
                    courses.filter(
                      (c) => c.endDate && dayjs(c.endDate).isBefore(dayjs())
                    ).length
                  }
                  prefix={<CalendarOutlined />}
                  valueStyle={{ color: "#fa8c16" }}
                />
              </Card>
            </Col>
          </Row>

          <Card className="border-0 shadow-md">
            <Table
              columns={columns}
              dataSource={courses}
              rowKey="_id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Jami: ${total} ta`,
              }}
            />
          </Card>
        </>
      ) : (
        <Card className="text-center py-12">
          <Empty
            description="Tashqi kurslar mavjud emas"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              className="bg-gradient-to-r from-purple-500 to-purple-600 border-0"
            >
              Birinchi kursni qo'shish
            </Button>
          </Empty>
        </Card>
      )}

      <ExternalCourseModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingCourse(null);
        }}
        editingCourse={editingCourse}
      />
    </div>
  );
}
