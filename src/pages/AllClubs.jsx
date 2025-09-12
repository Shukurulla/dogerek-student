import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Select,
  Input,
  Typography,
  Empty,
  Button,
  message,
  Pagination,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  useGetAllClubsQuery,
  useApplyToClubMutation,
  useGetFacultiesQuery,
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
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useGetAllClubsQuery(filters);
  const { data: facultiesData } = useGetFacultiesQuery();
  const [applyToClub, { isLoading: applying }] = useApplyToClubMutation();

  const clubs = data?.data?.clubs || [];
  const pagination = data?.data?.pagination || {};
  const faculties = facultiesData?.data || [];

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

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

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading && filters.page === 1) return <LoadingSpinner size="large" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <Title level={3} className="!mb-0">
          Barcha to'garaklar
        </Title>

        <div className="flex gap-3 flex-wrap">
          <Select
            placeholder="Fakultet"
            style={{ width: 200 }}
            allowClear
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, facultyId: value, page: 1 }))
            }
            loading={!facultiesData}
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {clubs.length > 0 ? (
        <>
          <Row gutter={[16, 16]}>
            {clubs.map((club) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={club._id || club.id}>
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
              <Pagination
                current={pagination.page}
                total={pagination.total}
                pageSize={pagination.limit}
                onChange={handlePageChange}
                showSizeChanger={false}
                showTotal={(total) => `Jami ${total} ta to'garak`}
              />
            </div>
          )}
        </>
      ) : (
        <Card className="text-center py-12">
          <Empty
            description={
              filters.search || filters.facultyId
                ? "Mos to'garaklar topilmadi"
                : "To'garaklar mavjud emas"
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      )}
    </div>
  );
}
