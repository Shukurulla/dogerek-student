import { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  TimePicker,
  DatePicker,
  Button,
  Space,
  message,
} from "antd";
import {
  useAddExternalCourseMutation,
  useUpdateExternalCourseMutation,
} from "../store/api/studentApi";
import dayjs from "dayjs";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

export default function ExternalCourseModal({
  visible,
  onClose,
  editingCourse,
}) {
  const [form] = Form.useForm();
  const [addCourse, { isLoading: adding }] = useAddExternalCourseMutation();
  const [updateCourse, { isLoading: updating }] =
    useUpdateExternalCourseMutation();

  useEffect(() => {
    if (editingCourse) {
      form.setFieldsValue({
        courseName: editingCourse.courseName,
        institutionName: editingCourse.institutionName,
        address: editingCourse.address,
        days: editingCourse.schedule?.days,
        time: editingCourse.schedule?.time
          ? [
              dayjs(editingCourse.schedule.time.start, "HH:mm"),
              dayjs(editingCourse.schedule.time.end, "HH:mm"),
            ]
          : undefined,
        instructorName: editingCourse.instructor?.name,
        instructorPhone: editingCourse.instructor?.phone?.replace("+998", ""),
        studentPhone: editingCourse.studentPhone?.replace("+998", ""),
        duration: editingCourse.startDate
          ? [dayjs(editingCourse.startDate), dayjs(editingCourse.endDate)]
          : undefined,
      });
    } else {
      form.resetFields();
    }
  }, [editingCourse, form]);

  const handleSubmit = async (values) => {
    try {
      const formattedValues = {
        courseName: values.courseName,
        institutionName: values.institutionName,
        address: values.address,
        schedule: {
          days: values.days,
          time: values.time
            ? {
                start: values.time[0].format("HH:mm"),
                end: values.time[1].format("HH:mm"),
              }
            : undefined,
        },
        instructorName: values.instructorName,
        instructorPhone: values.instructorPhone,
        studentPhone: values.studentPhone,
        startDate: values.duration?.[0]?.format("YYYY-MM-DD"),
        endDate: values.duration?.[1]?.format("YYYY-MM-DD"),
      };

      if (editingCourse) {
        const result = await updateCourse({
          id: editingCourse._id,
          ...formattedValues,
        }).unwrap();
        if (result.success) {
          message.success("Kurs ma'lumotlari yangilandi");
        }
      } else {
        const result = await addCourse(formattedValues).unwrap();
        if (result.success) {
          message.success("Tashqi kurs qo'shildi");
        }
      }
      onClose();
    } catch (error) {
      message.error("Xatolik yuz berdi");
    }
  };

  const weekDays = [
    { value: 1, label: "Dushanba" },
    { value: 2, label: "Seshanba" },
    { value: 3, label: "Chorshanba" },
    { value: 4, label: "Payshanba" },
    { value: 5, label: "Juma" },
    { value: 6, label: "Shanba" },
    { value: 7, label: "Yakshanba" },
  ];

  return (
    <Modal
      title={editingCourse ? "Kursni tahrirlash" : "Yangi tashqi kurs"}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="courseName"
          label="Kurs nomi"
          rules={[{ required: true, message: "Kurs nomi kiritilishi shart!" }]}
        >
          <Input placeholder="Ingliz tili kursi" size="large" />
        </Form.Item>

        <Form.Item
          name="institutionName"
          label="O'quv markaz nomi"
          rules={[
            { required: true, message: "O'quv markaz nomi kiritilishi shart!" },
          ]}
        >
          <Input placeholder="Uni Academy" size="large" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Manzil"
          rules={[{ required: true, message: "Manzil kiritilishi shart!" }]}
        >
          <TextArea
            placeholder="Nukus shahri, Berdax ko'chasi 25-uy"
            rows={2}
          />
        </Form.Item>

        <Form.Item
          name="days"
          label="Dars kunlari"
          rules={[{ required: true, message: "Kunlar tanlanishi shart!" }]}
        >
          <Select
            mode="multiple"
            placeholder="Kunlarni tanlang"
            size="large"
            options={weekDays}
          />
        </Form.Item>

        <Form.Item
          name="time"
          label="Dars vaqti"
          rules={[{ required: true, message: "Vaqt kiritilishi shart!" }]}
        >
          <TimePicker.RangePicker
            format="HH:mm"
            placeholder={["Boshlanish", "Tugash"]}
            size="large"
            className="w-full"
          />
        </Form.Item>

        <Form.Item name="instructorName" label="O'qituvchi ismi">
          <Input placeholder="O'qituvchi F.I.O" size="large" />
        </Form.Item>

        <Form.Item name="instructorPhone" label="O'qituvchi telefoni">
          <Input
            addonBefore="+998"
            placeholder="90 123 45 67"
            maxLength={9}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="studentPhone"
          label="Sizning telefoningiz"
          rules={[
            { required: true, message: "Telefon raqam kiritilishi shart!" },
          ]}
        >
          <Input
            addonBefore="+998"
            placeholder="90 123 45 67"
            maxLength={9}
            size="large"
          />
        </Form.Item>

        <Form.Item name="duration" label="Kurs muddati">
          <RangePicker
            placeholder={["Boshlanish", "Tugash"]}
            format="DD.MM.YYYY"
            size="large"
            className="w-full"
          />
        </Form.Item>

        <Form.Item className="mb-0">
          <Space className="w-full justify-end">
            <Button onClick={onClose}>Bekor qilish</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={adding || updating}
              className="bg-gradient-to-r from-cyan-500 to-teal-600 border-0"
            >
              {editingCourse ? "Yangilash" : "Qo'shish"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
