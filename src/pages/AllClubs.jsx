import { useState } from "react";
import {
  Row,
  Col,
  Card,
  Select,
  Input,
  Typography,
  Empty,
  Tag,
  Button,
  message,
} from "antd";
import { SearchOutlined, BookOutlined } from "@ant-design/icons";
import {
  useGetAllClubsQuery,
  useApplyToClubMutation,
} from "../store/api/studentApi";
import ClubCard from "../components/ClubCard";
import LoadingSpinner from "../components/LoadingSpinner";

const { Title } = Typography;

export default function AllClubs() {
  const [filters, setFilters] = useState({
    facultyId: null,
    search: "",
    page: 1,
    limit: 12,
  });

  const { data, isLoading } = useGetAllClubsQuery(filters);
  const [applyToClub, { isLoading: applying }] = useApplyToClubMutation();

  const clubs = data?.data?.clubs || [];
  const pagination = data?.data?.pagination || {};

  // Mock faculties
  const faculties = [
    { id: 1, name: "Matematika fakulteti" },
    { id: 2, name: "Fizika fakulteti" },
    { id: 3, name: "Informatika fakulteti" },
    { id: 4, name: "Tarix fakulteti" },
  ];

  const handleApply = async (clubId) => {
    try {
      const result = await applyToClub(clubId).unwrap();
      if (result.success) {
        message.success("Ariza muvaffaqiyatli topshirildi!");
      }
    } catch (error) {
      message.error(error.data?.message || "Xatolik yuz berdi");
    }
  };

  if (isLoading) return <LoadingSpinner size="large" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title level={3}>Barcha to'garaklar</Title>

        <div className="flex gap-3">
          <Select
            placeholder="Fakultet"
            style={{ width: 200 }}
            allowClear
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, facultyId: value }))
            }
          >
            {faculties.map((f) => (
              <Select.Option key={f.id} value={f.id}>
                {f.name}
              </Select.Option>
            ))}
          </Select>

          <Input
            placeholder="Qidirish..."
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
          />
        </div>
      </div>

      {clubs.length > 0 ? (
        <>
          <Row gutter={[16, 16]}>
            {clubs.map((club) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={club._id}>
                <ClubCard
                  club={club}
                  onApply={handleApply}
                  applying={applying}
                />
              </Col>
            ))}
          </Row>

          {pagination.pages > 1 && (
            <div className="flex justify-center mt-6">
              <Button.Group>
                {Array.from({ length: pagination.pages }, (_, i) => (
                  <Button
                    key={i + 1}
                    type={filters.page === i + 1 ? "primary" : "default"}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, page: i + 1 }))
                    }
                  >
                    {i + 1}
                  </Button>
                ))}
              </Button.Group>
            </div>
          )}
        </>
      ) : (
        <Card className="text-center py-12">
          <Empty
            description="To'garaklar topilmadi"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      )}
    </div>
  );
}
