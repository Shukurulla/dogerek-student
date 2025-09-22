import { useState } from "react";
import {
  Card,
  Button,
  Typography,
  Tag,
  Empty,
  Space,
  Popconfirm,
  message,
  Row,
  Col,
  Statistic,
  Tooltip,
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

  const getStatusTag = (course) => {
    const isActive = course.isActive !== false;
    const isExpired = course.endDate && dayjs(course.endDate).isBefore(dayjs());

    if (!isActive) {
      return <Tag color="gray">Faol emas</Tag>;
    }
    if (isExpired) {
      return <Tag color="orange">Tugagan</Tag>;
    }
    return <Tag color="green">Faol</Tag>;
  };

  const CourseCard = ({ course }) => (
    <Card
      className="h-full shadow-md border-0 hover:shadow-xl transition-all duration-300"
      cover={
        <div className="h-32 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center relative">
          <GlobalOutlined className="text-5xl text-white/80" />
          <div className="absolute top-2 right-2">{getStatusTag(course)}</div>
        </div>
      }
      actions={[
        <Tooltip title="Tahrirlash" key="edit">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(course)}
            className="text-blue-500 hover:text-blue-600"
          />
        </Tooltip>,
        <Popconfirm
          key="delete"
          title="O'chirishni tasdiqlaysizmi?"
          description="Bu amalni qaytarib bo'lmaydi"
          onConfirm={() => handleDelete(course._id)}
          okText="Ha"
          cancelText="Yo'q"
        >
          <Tooltip title="O'chirish">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              className="text-red-500 hover:text-red-600"
            />
          </Tooltip>
        </Popconfirm>,
      ]}
    >
      <div className="space-y-3">
        <div>
          <Title level={5} className="!mb-1">
            {course.courseName}
          </Title>
          <Text className="text-gray-600 text-sm">
            {course.institutionName}
          </Text>
        </div>

        <div className="space-y-2">
          {/* Schedule */}
          <div className="flex items-center gap-2">
            <ClockCircleOutlined className="text-gray-400" />
            <div>
              <Text className="text-sm">
                {course.schedule?.time?.start} - {course.schedule?.time?.end}
              </Text>
              <div className="flex gap-1 mt-1">
                {course.schedule?.days?.map((day) => (
                  <Tag key={day} color="purple" className="m-0 text-xs">
                    {weekDays[day]}
                  </Tag>
                ))}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-2">
            <EnvironmentOutlined className="text-gray-400 mt-1" />
            <Text className="text-sm text-gray-600 line-clamp-2">
              {course.address}
            </Text>
          </div>

          {/* Instructor */}
          {course.instructor?.name && (
            <div className="flex items-start gap-2">
              <UserOutlined className="text-gray-400" />
              <div>
                <Text className="text-sm block">{course.instructor.name}</Text>
                {course.instructor.phone && (
                  <Text className="text-xs text-gray-500">
                    <PhoneOutlined className="mr-1" />
                    {course.instructor.phone}
                  </Text>
                )}
              </div>
            </div>
          )}

          {/* Duration */}
          {course.startDate && (
            <div className="flex items-center gap-2">
              <CalendarOutlined className="text-gray-400" />
              <div className="text-sm">
                <Text className="text-gray-600">
                  {dayjs(course.startDate).format("DD.MM.YYYY")}
                  {course.endDate && (
                    <>
                      {" - "}
                      {dayjs(course.endDate).format("DD.MM.YYYY")}
                    </>
                  )}
                </Text>
              </div>
            </div>
          )}

          {/* Student Phone */}
          {course.studentPhone && (
            <div className="pt-2 border-t">
              <Text className="text-xs text-gray-500">
                Sizning tel: {course.studentPhone}
              </Text>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  if (isLoading) return <LoadingSpinner size="large" />;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <Title level={3} className="!mb-0">
          Tashqi kurslar
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          className="bg-gradient-to-r from-purple-500 to-purple-600 border-0 w-full sm:w-auto"
        >
          Yangi kurs qo'shish
        </Button>
      </div>

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <GlobalOutlined className="text-3xl text-purple-500 flex-shrink-0" />
          <div>
            <Title level={5} className="!mb-1">
              Tashqi kurslar haqida
            </Title>
            <Text className="text-gray-600 text-sm sm:text-base">
              Universitet tashqarisida qatnayotgan kurslaringizni qo'shing. Bu
              ma'lumotlar sizning band ekanligingizni ko'rsatadi.
            </Text>
          </div>
        </div>
      </Card>

      {courses.length > 0 ? (
        <>
          {/* Statistics */}
          <Row gutter={[12, 12]} className="mb-4">
            <Col xs={24} sm={8}>
              <Card className="text-center border-purple-200 bg-purple-50">
                <Statistic
                  title="Jami kurslar"
                  value={courses.length}
                  prefix={<BookOutlined />}
                  valueStyle={{ color: "#722ed1", fontSize: 24 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="text-center border-green-200 bg-green-50">
                <Statistic
                  title="Faol kurslar"
                  value={courses.filter((c) => c.isActive !== false).length}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: "#52c41a", fontSize: 24 }}
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
                  valueStyle={{ color: "#fa8c16", fontSize: 24 }}
                />
              </Card>
            </Col>
          </Row>

          {/* Courses Grid */}
          <Row gutter={[16, 16]}>
            {courses.map((course) => (
              <Col
                key={course._id}
                xs={24} // Mobile: 1 column
                sm={12} // Tablet: 2 columns
                lg={8} // Desktop: 3 columns
              >
                <CourseCard course={course} />
              </Col>
            ))}
          </Row>
        </>
      ) : (
        <Card className="text-center py-8 md:py-12">
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
