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
  Tag,
} from "antd";
import {
  SearchOutlined,
  AppstoreOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import {
  useGetAllClubsQuery,
  useApplyToClubMutation,
  useGetFacultiesQuery,
  useGetCategoriesQuery,
} from "../store/api/studentApi";
import ClubCard from "../components/ClubCard";
import LoadingSpinner from "../components/LoadingSpinner";

const { Title } = Typography;

export default function AllClubs() {
  const [filters, setFilters] = useState({
    facultyId: undefined,
    categoryId: undefined,
    search: "",
    page: 1,
    limit: 12,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [applyingId, setApplyingId] = useState(null);

  const { data, isLoading } = useGetAllClubsQuery(
    Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined && v !== "")
    )
  );
  const { data: facultiesData } = useGetFacultiesQuery();
  const { data: categoriesData } = useGetCategoriesQuery();
  const [applyToClub] = useApplyToClubMutation();

  const clubs = data?.data?.clubs || [];
  const pagination = data?.data?.pagination || {};
  const faculties = facultiesData?.data || [];
  const categories = categoriesData?.data || [];

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleApply = async (clubId) => {
    try {
      setApplyingId(clubId);
      const result = await applyToClub(clubId).unwrap();
      if (result.success) {
        message.success("Ariza muvaffaqiyatli topshirildi!");
      }
    } catch (error) {
      message.error(error.data?.message || "Xatolik yuz berdi");
    } finally {
      setApplyingId(null);
    }
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setFilters({
      facultyId: undefined,
      categoryId: undefined,
      search: "",
      page: 1,
      limit: 12,
    });
    setSearchTerm("");
  };

  const hasActiveFilters =
    filters.facultyId || filters.categoryId || filters.search;

  if (isLoading && filters.page === 1) return <LoadingSpinner size="large" />;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <Title level={3} className="!mb-0 flex items-center gap-2">
          <AppstoreOutlined className="text-cyan-600" />
          Barcha to'garaklar
        </Title>

        {hasActiveFilters && (
          <Button size="small" onClick={clearFilters} icon={<FilterOutlined />}>
            Filterlarni tozalash
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <Select
            placeholder="Fakultet"
            className="w-full md:w-56"
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

          <Select
            placeholder="Kategoriya"
            className="w-full md:w-56"
            allowClear
            value={filters.categoryId}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                categoryId: value || undefined,
                page: 1,
              }))
            }
            loading={!categoriesData}
          >
            {categories.map((cat) => (
              <Select.Option key={cat._id} value={cat._id}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.name}
                  {cat.clubCount > 0 && (
                    <Tag className="ml-auto">{cat.clubCount}</Tag>
                  )}
                </div>
              </Select.Option>
            ))}
          </Select>

          <Input
            placeholder="Qidirish..."
            prefix={<SearchOutlined />}
            className="w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Active filters display */}
        {hasActiveFilters && (
          <div className="mt-3 flex flex-wrap gap-2">
            {filters.facultyId && (
              <Tag
                closable
                onClose={() =>
                  setFilters((prev) => ({
                    ...prev,
                    facultyId: undefined,
                    page: 1,
                  }))
                }
                color="cyan"
              >
                {faculties.find((f) => f.id === filters.facultyId)?.name}
              </Tag>
            )}
            {filters.categoryId && (
              <Tag
                closable
                onClose={() =>
                  setFilters((prev) => ({
                    ...prev,
                    categoryId: undefined,
                    page: 1,
                  }))
                }
                color={
                  categories.find((c) => c._id === filters.categoryId)?.color
                }
              >
                {categories.find((c) => c._id === filters.categoryId)?.name}
              </Tag>
            )}
            {filters.search && (
              <Tag
                closable
                onClose={() => {
                  setSearchTerm("");
                  setFilters((prev) => ({ ...prev, search: "", page: 1 }));
                }}
              >
                Qidiruv: {filters.search}
              </Tag>
            )}
          </div>
        )}
      </Card>

      {/* Statistics */}
      {categories.length > 0 && !hasActiveFilters && (
        <Row gutter={[12, 12]}>
          {categories.slice(0, 6).map((cat) => (
            <Col xs={12} sm={8} md={4} key={cat._id}>
              <Card
                className="text-center cursor-pointer hover:shadow-md transition-all"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    categoryId: cat._id,
                    page: 1,
                  }))
                }
                style={{ borderTop: `3px solid ${cat.color}` }}
              >
                <div className="text-2xl mb-2" style={{ color: cat.color }}>
                  {cat.clubCount || 0}
                </div>
                <div className="text-xs text-gray-600 truncate">{cat.name}</div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {clubs.length > 0 ? (
        <>
          <Row gutter={[16, 16]}>
            {clubs.map((club) => (
              <Col
                key={club._id || club.id}
                xs={24} // Mobile: 1 column
                sm={12} // Tablet: 2 columns
                lg={8} // Desktop: 3 columns
                xl={6} // Large desktop: 4 columns
              >
                <ClubCard
                  club={club}
                  onApply={handleApply}
                  applyingId={applyingId}
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
              hasActiveFilters
                ? "Mos to'garaklar topilmadi"
                : "To'garaklar mavjud emas"
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            {hasActiveFilters && (
              <Button onClick={clearFilters}>Filterlarni tozalash</Button>
            )}
          </Empty>
        </Card>
      )}
    </div>
  );
}
