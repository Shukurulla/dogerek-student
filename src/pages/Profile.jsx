import { useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Avatar,
  Button,
  Form,
  Input,
  Modal,
  message,
  Tag,
  Divider,
  Space,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  LockOutlined,
  MailOutlined,
  IdcardOutlined,
  TeamOutlined,
  BookOutlined,
  GlobalOutlined,
  CalendarOutlined,
  SaveOutlined,
  HomeOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../store/api/authApi";
import { useChangePasswordMutation } from "../store/api/studentApi";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function Profile() {
  const dispatch = useDispatch();
  const { student } = useSelector((state) => state.auth);
  const [changePassword, { isLoading: changingPassword }] =
    useChangePasswordMutation();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const handleEditProfile = () => {
    editForm.setFieldsValue({
      email: student?.email,
    });
    setEditModalVisible(true);
  };

  const handleUpdateProfile = async (values) => {
    try {
      const result = await dispatch(updateProfile(values)).unwrap();
      if (result.success) {
        message.success("Profil yangilandi");
        setEditModalVisible(false);
      }
    } catch (error) {
      message.error("Xatolik yuz berdi");
    }
  };

  const handleChangePassword = async (values) => {
    try {
      const result = await changePassword(values).unwrap();
      if (result.success) {
        message.success("Parol muvaffaqiyatli o'zgartirildi");
        setPasswordModalVisible(false);
        passwordForm.resetFields();
      }
    } catch (error) {
      message.error(error.data?.message || "Xatolik yuz berdi");
    }
  };

  // Info Item Component for responsive design
  const InfoItem = ({ label, value, icon }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      {icon && <div className="text-gray-400 mt-1">{icon}</div>}
      <div className="flex-1">
        <Text className="text-xs text-gray-500 block">{label}</Text>
        <Text className="text-sm font-medium text-gray-800">
          {value || "-"}
        </Text>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <Title level={3} className="px-4 md:px-0">
        Mening profilim
      </Title>

      <Row gutter={[16, 16]}>
        {/* Left Sidebar - Profile Card */}
        <Col xs={24} lg={8}>
          <Card className="text-center shadow-md border-0">
            <Avatar
              size={100}
              src={student?.image}
              icon={!student?.image && <UserOutlined />}
              className="mb-4 bg-gradient-to-r from-cyan-500 to-teal-600"
            />
            <Title level={4} className="!mb-2 text-base md:text-lg">
              {student?.full_name}
            </Title>
            <Text className="text-gray-600 block mb-1 text-sm">
              {student?.student_id_number}
            </Text>
            <Tag color="cyan" className="mb-4">
              {student?.group?.name}
            </Tag>

            <div className="space-y-2">
              <Button
                type="primary"
                ghost
                block
                icon={<EditOutlined />}
                onClick={handleEditProfile}
              >
                Profilni tahrirlash
              </Button>
              <Button
                block
                icon={<LockOutlined />}
                onClick={() => setPasswordModalVisible(true)}
              >
                Parolni o'zgartirish
              </Button>
            </div>

            <Divider />

            <div className="text-left space-y-3">
              <div className="p-3 bg-cyan-50 rounded-lg">
                <Text className="text-gray-600 text-xs">To'garaklar</Text>
                <div className="flex items-center justify-between mt-1">
                  <BookOutlined className="text-cyan-500 text-lg" />
                  <Text className="text-lg font-bold">
                    {student?.enrolledClubs?.filter(
                      (c) => c.status === "approved"
                    ).length || 0}
                  </Text>
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-lg">
                <Text className="text-gray-600 text-xs">Tashqi kurslar</Text>
                <div className="flex items-center justify-between mt-1">
                  <GlobalOutlined className="text-purple-500 text-lg" />
                  <Text className="text-lg font-bold">
                    {student?.externalCourses?.length || 0}
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Right Content - Information Cards */}
        <Col xs={24} lg={16}>
          {/* Personal Information */}
          <Card
            title={
              <span className="text-base md:text-lg">Shaxsiy ma'lumotlar</span>
            }
            className="shadow-md border-0 mb-4"
          >
            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <InfoItem
                  label="F.I.O"
                  value={student?.full_name}
                  icon={<UserOutlined />}
                />
                <InfoItem
                  label="Student ID"
                  value={student?.student_id_number}
                  icon={<IdcardOutlined />}
                />
                <InfoItem
                  label="Email"
                  value={student?.email || "Kiritilmagan"}
                  icon={<MailOutlined />}
                />
              </Col>
              <Col xs={24} md={12}>
                <InfoItem
                  label="Jins"
                  value={student?.gender?.name}
                  icon={<UserOutlined />}
                />
                <InfoItem
                  label="Tug'ilgan sana"
                  value={
                    student?.birth_date
                      ? dayjs.unix(student.birth_date).format("DD.MM.YYYY")
                      : "-"
                  }
                  icon={<CalendarOutlined />}
                />
              </Col>
            </Row>
          </Card>

          {/* Education Information */}
          <Card
            title={
              <span className="text-base md:text-lg">Ta'lim ma'lumotlari</span>
            }
            className="shadow-md border-0 mb-4"
          >
            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <InfoItem
                  label="Fakultet"
                  value={
                    <Tag color="blue" className="mt-1">
                      {student?.department?.name}
                    </Tag>
                  }
                  icon={<HomeOutlined />}
                />
                <InfoItem
                  label="Yo'nalish"
                  value={student?.specialty?.name}
                  icon={<BookOutlined />}
                />
                <InfoItem
                  label="Guruh"
                  value={
                    <Tag color="cyan" className="mt-1">
                      {student?.group?.name}
                    </Tag>
                  }
                  icon={<TeamOutlined />}
                />
                <InfoItem
                  label="Ta'lim tili"
                  value={student?.group?.educationLang?.name}
                />
                <InfoItem label="Bosqich" value={student?.level?.name} />
                <InfoItem label="Semestr" value={student?.semester?.name} />
              </Col>
              <Col xs={24} md={12}>
                <InfoItem
                  label="O'quv yili"
                  value={student?.educationYear?.name}
                />
                <InfoItem
                  label="Ta'lim turi"
                  value={student?.educationType?.name}
                />
                <InfoItem
                  label="Ta'lim shakli"
                  value={student?.educationForm?.name}
                />
                <InfoItem
                  label="To'lov shakli"
                  value={student?.paymentForm?.name}
                />
                <InfoItem label="Kirgan yili" value={student?.year_of_enter} />
                <InfoItem
                  label="Status"
                  value={
                    <Tag color="green" className="mt-1">
                      {student?.studentStatus?.name}
                    </Tag>
                  }
                />
              </Col>
            </Row>
          </Card>

          {/* System Information */}
          <Card
            title={
              <span className="text-base md:text-lg">Tizim ma'lumotlari</span>
            }
            className="shadow-md border-0"
          >
            <InfoItem
              label="Ro'yxatdan o'tgan"
              value={
                student?.createdAt
                  ? dayjs(student.createdAt).format("DD.MM.YYYY HH:mm")
                  : "-"
              }
              icon={<CalendarOutlined />}
            />
            <InfoItem
              label="Oxirgi kirish"
              value={
                student?.lastLogin
                  ? dayjs(student.lastLogin).format("DD.MM.YYYY HH:mm")
                  : "-"
              }
              icon={<ClockCircleOutlined />}
            />
            <InfoItem
              label="Profil holati"
              value={<Tag color="green">Faol</Tag>}
              icon={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Edit Profile Modal */}
      <Modal
        title="Profilni tahrirlash"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={window.innerWidth < 768 ? "95%" : 500}
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdateProfile}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: "email", message: "Email formati noto'g'ri!" }]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="example@mail.com"
              size="large"
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              icon={<SaveOutlined />}
              className="bg-gradient-to-r from-cyan-500 to-teal-600 border-0"
            >
              Saqlash
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        title="Parolni o'zgartirish"
        open={passwordModalVisible}
        onCancel={() => {
          setPasswordModalVisible(false);
          passwordForm.resetFields();
        }}
        footer={null}
        width={window.innerWidth < 768 ? "95%" : 500}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            name="oldPassword"
            label="Joriy parol"
            rules={[
              { required: true, message: "Joriy parol kiritilishi shart!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Joriy parol"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Yangi parol"
            rules={[
              { required: true, message: "Yangi parol kiritilishi shart!" },
              {
                min: 6,
                message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Yangi parol"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Yangi parolni tasdiqlash"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Parolni tasdiqlang!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Parollar mos kelmayapti!"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Yangi parolni takrorlang"
              size="large"
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={changingPassword}
              icon={<SaveOutlined />}
              className="bg-gradient-to-r from-cyan-500 to-teal-600 border-0"
            >
              Parolni o'zgartirish
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
