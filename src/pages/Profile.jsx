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
  Descriptions,
  Tag,
  Divider,
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

  return (
    <div className="space-y-6">
      <Title level={3}>Mening profilim</Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card className="text-center shadow-md border-0">
            <Avatar
              size={120}
              src={student?.image}
              icon={!student?.image && <UserOutlined />}
              className="mb-4 bg-gradient-to-r from-cyan-500 to-teal-600"
            />
            <Title level={4} className="!mb-2">
              {student?.full_name}
            </Title>
            <Text className="text-gray-600 block mb-1">
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

        <Col xs={24} lg={16}>
          <Card title="Shaxsiy ma'lumotlar" className="shadow-md border-0 mb-6">
            <Descriptions column={{ xs: 1, sm: 2 }} bordered>
              <Descriptions.Item label="F.I.O">
                {student?.full_name}
              </Descriptions.Item>
              <Descriptions.Item label="Student ID">
                {student?.student_id_number}
              </Descriptions.Item>
              <Descriptions.Item label="Jins">
                {student?.gender?.name || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Tug'ilgan sana">
                {student?.birth_date
                  ? dayjs.unix(student.birth_date).format("DD.MM.YYYY")
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Email" span={2}>
                {student?.email || (
                  <Text className="text-gray-400">Kiritilmagan</Text>
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Ta'lim ma'lumotlari" className="shadow-md border-0 mb-6">
            <Descriptions column={{ xs: 1, sm: 2 }} bordered>
              <Descriptions.Item label="Fakultet" span={2}>
                <Tag color="blue">{student?.department?.name}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Yo'nalish" span={2}>
                {student?.specialty?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Guruh">
                <Tag color="cyan">{student?.group?.name}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ta'lim tili">
                {student?.group?.educationLang?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Bosqich">
                {student?.level?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Semestr">
                {student?.semester?.name}
              </Descriptions.Item>
              <Descriptions.Item label="O'quv yili">
                {student?.educationYear?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Ta'lim turi">
                {student?.educationType?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Ta'lim shakli">
                {student?.educationForm?.name}
              </Descriptions.Item>
              <Descriptions.Item label="To'lov shakli">
                {student?.paymentForm?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Kirgan yili">
                {student?.year_of_enter}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color="green">{student?.studentStatus?.name}</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Tizim ma'lumotlari" className="shadow-md border-0">
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Ro'yxatdan o'tgan">
                {student?.createdAt
                  ? dayjs(student.createdAt).format("DD.MM.YYYY HH:mm")
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Oxirgi kirish">
                {student?.lastLogin
                  ? dayjs(student.lastLogin).format("DD.MM.YYYY HH:mm")
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Profil holati">
                <Tag color="green">Faol</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      {/* Edit Profile Modal */}
      <Modal
        title="Profilni tahrirlash"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
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
