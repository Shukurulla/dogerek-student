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
import { SearchOutlined, AppstoreOutlined } from "@ant-design/icons";
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
    facultyId: undefined,
    search: "",
    page: 1,
    limit: 12,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useGetAllClubsQuery(
    Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined && v !== "")
    )
  );
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
    <div className="space-y-4 md:space-y-6">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <Title level={3} className="!mb-0 flex items-center gap-2">
          <AppstoreOutlined className="text-cyan-600" />
          Barcha to'garaklar
        </Title>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select
            placeholder="Fakultet"
            style={{ width: "100%" }}
            className="w-full sm:w-48 md:w-56"
            allowClear
            value={filters.facultyId}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                facultyId: value || undefined,
                page: 1,
              }))
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
            className="w-full sm:w-48 md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {clubs.length > 0 ? (
        <>
          <Row gutter={[16, 16]}>
            {clubs.map((club) => (
              <Col
                key={club._id || club.id}
                xs={24} // Mobile: 1 column
                sm={12} // Tablet: 2 columns
                lg={8} // Desktop: 3 columns
              >
                <ClubCard
                  club={club}
                  onApply={handleApply}
                  applying={applying}
                />
              </Col>
            ))}
          </Row>

          {pagination.pages > 1 && (
            <div className="flex justify-center mt-4 md:mt-6">
              <Pagination
                current={pagination.page}
                total={pagination.total}
                pageSize={pagination.limit}
                onChange={handlePageChange}
                showSizeChanger={false}
                showTotal={(total) => `Jami ${total} ta to'garak`}
                responsive
                size="small"
                className="text-center"
              />
            </div>
          )}
        </>
      ) : (
        <Card className="text-center py-8 md:py-12">
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
